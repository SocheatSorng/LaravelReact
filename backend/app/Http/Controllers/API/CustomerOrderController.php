<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CustomerAccount;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Book;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Services\OrderNotificationService;

class CustomerOrderController extends Controller
{
    /**
     * The order notification service instance.
     *
     * @var \App\Services\OrderNotificationService
     */
    protected $notificationService;

    /**
     * Create a new controller instance.
     *
     * @param  \App\Services\OrderNotificationService  $notificationService
     * @return void
     */
    public function __construct(OrderNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Create a new order for the authenticated customer
     */
    public function placeOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ShippingAddress' => 'required|string',
            'PaymentMethod' => 'required|string|in:credit_card,paypal,bank_transfer,cash_on_delivery',
            'items' => 'required|array|min:1',
            'items.*.BookID' => 'required|exists:tbBook,BookID',
            'items.*.Quantity' => 'required|integer|min:1',
            'items.*.Price' => 'required|numeric|min:0',
            'UseCartItems' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Get the authenticated customer
            $customer = $request->user();

            // Calculate total amount
            $totalAmount = 0;
            $orderItems = [];

            // Use cart items if specified
            if ($request->has('UseCartItems') && $request->UseCartItems) {
                $cartItems = Cart::where('AccountID', $customer->AccountID)->get();
                
                if ($cartItems->isEmpty()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Your cart is empty'
                    ], 400);
                }

                foreach ($cartItems as $cartItem) {
                    $book = Book::find($cartItem->BookID);
                    
                    if (!$book) {
                        continue;
                    }
                    
                    // Check stock
                    if ($book->StockQuantity < $cartItem->Quantity) {
                        throw new \Exception("Insufficient stock for book: {$book->Title}");
                    }
                    
                    $orderItems[] = [
                        'BookID' => $book->BookID,
                        'Quantity' => $cartItem->Quantity,
                        'Price' => $book->Price
                    ];
                    
                    $totalAmount += ($book->Price * $cartItem->Quantity);
                }
            } else {
                // Use items from request
                foreach ($request->items as $item) {
                    $book = Book::find($item['BookID']);
                    
                    // Check stock
                    if ($book->StockQuantity < $item['Quantity']) {
                        throw new \Exception("Insufficient stock for book: {$book->Title}");
                    }
                    
                    $totalAmount += ($item['Price'] * $item['Quantity']);
                    $orderItems[] = $item;
                }
            }

            // Create order
            $order = Order::create([
                'AccountID' => $customer->AccountID,
                'TotalAmount' => $totalAmount,
                'Status' => 'pending',
                'ShippingAddress' => $request->ShippingAddress,
                'PaymentMethod' => $request->PaymentMethod,
                'OrderDate' => now()
            ]);

            // Create order details
            foreach ($orderItems as $item) {
                $book = Book::find($item['BookID']);
                
                // Create order detail
                OrderDetail::create([
                    'OrderID' => $order->OrderID,
                    'BookID' => $item['BookID'],
                    'Quantity' => $item['Quantity'],
                    'Price' => $item['Price']
                ]);

                // Update stock
                $book->update([
                    'StockQuantity' => $book->StockQuantity - $item['Quantity']
                ]);
            }

            // Clear cart if using cart items
            if ($request->has('UseCartItems') && $request->UseCartItems) {
                Cart::where('AccountID', $customer->AccountID)->delete();
            }

            DB::commit();

            // Load relationships
            $order->load(['orderDetails.book', 'customerAccount']);

            // Only send notification for non-PayPal orders or if order status is not pending
            // For PayPal, notifications will be sent after payment confirmation
            if ($order->PaymentMethod !== 'paypal' && $order->Status !== 'pending') {
                $this->notificationService->sendNewOrderNotifications($order);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Order placed successfully',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to place order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all orders for the authenticated customer
     */
    public function getMyOrders(Request $request)
    {
        try {
            $customer = $request->user();
            
            $query = Order::with(['orderDetails.book'])
                ->where('AccountID', $customer->AccountID);
            
            // Filter by status
            if ($request->has('status')) {
                $query->where('Status', $request->status);
            }
            
            // Sort orders
            $sortField = $request->input('sort_by', 'OrderDate');
            $sortDirection = $request->input('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);
            
            // Paginate results
            $perPage = $request->input('per_page', 10);
            $orders = $query->paginate($perPage);
            
            return response()->json([
                'status' => 'success',
                'data' => $orders,
                'message' => 'Orders retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve orders: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific order for the authenticated customer
     */
    public function getMyOrder(Request $request, $id)
    {
        try {
            $customer = $request->user();
            
            $order = Order::with(['orderDetails.book'])
                ->where('AccountID', $customer->AccountID)
                ->where('OrderID', $id)
                ->first();
            
            if (!$order) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Order not found or does not belong to you'
                ], 404);
            }
            
            return response()->json([
                'status' => 'success',
                'data' => $order,
                'message' => 'Order retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel an order for the authenticated customer
     * Only pending orders can be canceled
     */
    public function cancelMyOrder(Request $request, $id)
    {
        try {
            $customer = $request->user();
            
            $order = Order::with('orderDetails')
                ->where('AccountID', $customer->AccountID)
                ->where('OrderID', $id)
                ->first();
            
            if (!$order) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Order not found or does not belong to you'
                ], 404);
            }
            
            if ($order->Status !== 'pending') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only pending orders can be canceled'
                ], 400);
            }
            
            DB::beginTransaction();
            
            // Restore stock quantities
            foreach ($order->orderDetails as $detail) {
                $book = Book::find($detail->BookID);
                $book->update([
                    'StockQuantity' => $book->StockQuantity + $detail->Quantity
                ]);
            }
            
            // Update order status
            $order->update([
                'Status' => 'cancelled'
            ]);
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'data' => $order->fresh(),
                'message' => 'Order canceled successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to cancel order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update order payment status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateOrderPayment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'PaymentMethod' => 'required|string',
            'PaymentStatus' => 'required|string|in:pending,processing,completed,failed,cancelled',
            'PaymentDetails' => 'sometimes|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $customer = $request->user();
            
            DB::beginTransaction();
            
            $order = Order::where('AccountID', $customer->AccountID)
                ->where('OrderID', $id)
                ->first();

            if (!$order) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Order not found or does not belong to you'
                ], 404);
            }

            // Update the order status based on payment status
            $orderStatus = 'pending';
            if ($request->PaymentStatus === 'completed') {
                $orderStatus = 'processing'; // Change to 'completed' if you want to mark as complete
            } elseif ($request->PaymentStatus === 'failed') {
                $orderStatus = 'cancelled';
            }

            $order->update([
                'Status' => $orderStatus,
                // You could also store payment details if you have a column for it
                // 'PaymentDetails' => json_encode($request->PaymentDetails)
            ]);

            DB::commit();

            // Only send notification if payment is completed
            if ($request->PaymentStatus === 'completed') {
                // Load order relationships for the notification
                $order->load(['orderDetails.book', 'customerAccount']);
                
                // Send order notification
                $this->notificationService->sendNewOrderNotifications($order);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Payment updated successfully',
                'data' => $order->fresh(['orderDetails.book', 'customerAccount'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update payment: ' . $e->getMessage()
            ], 500);
        }
    }
} 