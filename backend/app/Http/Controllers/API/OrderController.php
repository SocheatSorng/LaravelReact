<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Order::with(['customerAccount', 'orderDetails.book']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('Status', $request->status);
            }

            // Filter by date range
            if ($request->has('from_date')) {
                $query->whereDate('OrderDate', '>=', $request->from_date);
            }
            if ($request->has('to_date')) {
                $query->whereDate('OrderDate', '<=', $request->to_date);
            }

            // Sort orders
            $sortField = $request->input('sort_by', 'OrderDate');
            $sortDirection = $request->input('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);

            // Paginate results
            $perPage = $request->input('per_page', 10);
            $orders = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $orders,
                'message' => 'Orders retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve orders: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'AccountID' => 'required|exists:tbCustomerAccount,AccountID',
            'OrderTotal' => 'required|numeric|min:0',
            'ShippingAddress' => 'required|string',
            'PaymentMethod' => 'required|string',
            'OrderItems' => 'required|array|min:1',
            'OrderItems.*.BookID' => 'required|exists:tbBook,BookID',
            'OrderItems.*.Quantity' => 'required|integer|min:1',
            'OrderItems.*.Price' => 'required|numeric|min:0',
            'Notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create order
            $order = Order::create([
                'AccountID' => $request->AccountID,
                'TotalAmount' => $request->OrderTotal,
                'Status' => 'pending',
                'ShippingAddress' => $request->ShippingAddress,
                'PaymentMethod' => $request->PaymentMethod
            ]);

            // Create order details
            foreach ($request->OrderItems as $item) {
                $book = Book::find($item['BookID']);
                
                // Check stock
                if ($book->StockQuantity < $item['Quantity']) {
                    throw new \Exception("Insufficient stock for book: {$book->Title}");
                }

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

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $order->load(['orderDetails.book', 'customerAccount']),
                'message' => 'Order created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $order = Order::with(['customerAccount', 'orderDetails.book'])->find($id);
            
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $order,
                'message' => 'Order retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'Status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'ShippingAddress' => 'sometimes|required|string',
            'PaymentMethod' => 'sometimes|required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $order = Order::find($id);
            
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            $order->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $order->fresh()->load(['orderDetails.book', 'customerAccount']),
                'message' => 'Order updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $order = Order::find($id);
            
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            if ($order->Status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending orders can be deleted'
                ], 422);
            }

            DB::beginTransaction();

            // Restore stock quantities
            foreach ($order->orderDetails as $detail) {
                $book = Book::find($detail->BookID);
                $book->update([
                    'StockQuantity' => $book->StockQuantity + $detail->Quantity
                ]);
            }

            // Delete order and details
            $order->orderDetails()->delete();
            $order->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function storeGuestOrder(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'Guest checkout is disabled. Please login or create an account to place an order.'
        ], 403);
        
        // Old guest order functionality is commented out since it's no longer needed
        /*
        $validator = Validator::make($request->all(), [
            'GuestName' => 'required|string|max:100',
            'GuestEmail' => 'required|email|max:100',
            'GuestPhone' => 'required|string|max:15',
            'TotalAmount' => 'required|numeric|min:0',
            'ShippingAddress' => 'required|string',
            'PaymentMethod' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.BookID' => 'required|exists:tbBook,BookID',
            'items.*.Quantity' => 'required|integer|min:1',
            'items.*.Price' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create order
            $order = Order::create([
                'AccountID' => null, // Null for guest orders
                'GuestName' => $request->GuestName,
                'GuestEmail' => $request->GuestEmail,
                'GuestPhone' => $request->GuestPhone,
                'TotalAmount' => $request->TotalAmount,
                'Status' => 'pending',
                'ShippingAddress' => $request->ShippingAddress,
                'PaymentMethod' => $request->PaymentMethod,
                'OrderDate' => now() // Set current date/time
            ]);

            // Create order details
            foreach ($request->items as $item) {
                $book = Book::find($item['BookID']);
                
                // Check stock
                if ($book->StockQuantity < $item['Quantity']) {
                    throw new \Exception("Insufficient stock for book: {$book->Title}");
                }

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

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $order->load('orderDetails.book'),
                'message' => 'Guest order created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create guest order: ' . $e->getMessage()
            ], 500);
        }
        */
    }

    /**
     * Get order statistics
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats()
    {
        try {
            // Get total count of all orders
            $totalOrders = Order::count();
            
            // Get count of orders by status
            $pendingOrders = Order::where('Status', 'pending')->count();
            $processingOrders = Order::where('Status', 'processing')->count();
            $shippedOrders = Order::where('Status', 'shipped')->count();
            $deliveredOrders = Order::where('Status', 'delivered')->count();
            $cancelledOrders = Order::where('Status', 'cancelled')->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'totalOrders' => $totalOrders,
                    'pendingOrders' => $pendingOrders,
                    'processingOrders' => $processingOrders,
                    'shippedOrders' => $shippedOrders,
                    'deliveredOrders' => $deliveredOrders,
                    'cancelledOrders' => $cancelledOrders
                ],
                'message' => 'Order statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display order history for a specific account
     *
     * @param Request $request
     * @param int $accountId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOrderHistory(Request $request, $accountId)
    {
        try {
            // Check if account exists (if needed)
            // This depends on how you want to handle non-existent accounts

            // Query orders for the specific account
            $query = Order::with(['orderDetails.book'])
                ->where('AccountID', $accountId)
                ->orderBy('OrderDate', 'desc');

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('Status', $request->status);
            }

            // Filter by date range
            if ($request->has('from_date')) {
                $query->whereDate('OrderDate', '>=', $request->from_date);
            }
            if ($request->has('to_date')) {
                $query->whereDate('OrderDate', '<=', $request->to_date);
            }

            // Paginate results
            $perPage = $request->input('per_page', 10);
            $orders = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $orders,
                'message' => 'Order history retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order history: ' . $e->getMessage()
            ], 500);
        }
    }
}