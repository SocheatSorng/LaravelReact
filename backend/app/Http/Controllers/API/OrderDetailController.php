<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\OrderDetail;
use App\Models\Order;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OrderDetailController extends Controller
{
    public function index()
    {
        try {
            $orderDetails = OrderDetail::with(['order', 'book'])->get();
            return response()->json([
                'success' => true,
                'data' => $orderDetails,
                'message' => 'Order details retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order details: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'OrderID' => 'required|exists:tbOrder,OrderID',
            'BookID' => 'required|exists:tbBook,BookID',
            'Quantity' => 'required|integer|min:1',
            'Price' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Check book stock
            $book = Book::find($request->BookID);
            if ($book->StockQuantity < $request->Quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock'
                ], 400);
            }

            // Create order detail
            $orderDetail = OrderDetail::create($request->all());

            // Update book stock
            $book->update([
                'StockQuantity' => $book->StockQuantity - $request->Quantity
            ]);

            // Update order total
            $order = Order::find($request->OrderID);
            $order->update([
                'TotalAmount' => $order->TotalAmount + ($request->Price * $request->Quantity)
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $orderDetail->load(['order', 'book']),
                'message' => 'Order detail created successfully'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order detail: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $orderDetail = OrderDetail::with(['order', 'book'])->find($id);
            
            if (!$orderDetail) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order detail not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $orderDetail,
                'message' => 'Order detail retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order detail: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'Quantity' => 'sometimes|required|integer|min:1',
            'Price' => 'sometimes|required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $orderDetail = OrderDetail::find($id);
            if (!$orderDetail) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order detail not found'
                ], 404);
            }

            // Handle stock updates if quantity changes
            if ($request->has('Quantity')) {
                $book = Book::find($orderDetail->BookID);
                $quantityDiff = $request->Quantity - $orderDetail->Quantity;
                
                if ($quantityDiff > 0 && $book->StockQuantity < $quantityDiff) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Insufficient stock'
                    ], 400);
                }

                $book->update([
                    'StockQuantity' => $book->StockQuantity - $quantityDiff
                ]);
            }

            $orderDetail->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $orderDetail->fresh()->load(['order', 'book']),
                'message' => 'Order detail updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order detail: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $orderDetail = OrderDetail::find($id);
            if (!$orderDetail) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order detail not found'
                ], 404);
            }

            // Restore book stock
            $book = Book::find($orderDetail->BookID);
            $book->update([
                'StockQuantity' => $book->StockQuantity + $orderDetail->Quantity
            ]);

            // Update order total
            $order = Order::find($orderDetail->OrderID);
            $order->update([
                'TotalAmount' => $order->TotalAmount - ($orderDetail->Price * $orderDetail->Quantity)
            ]);

            $orderDetail->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order detail deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete order detail: ' . $e->getMessage()
            ], 500);
        }
    }
}
