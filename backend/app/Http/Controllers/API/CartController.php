<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Cart::with(['book', 'user']);

            // Filter by user
            if ($request->has('user_id')) {
                $query->where('UserID', $request->user_id);
            }

            $cartItems = $query->get();

            return response()->json([
                'success' => true,
                'data' => $cartItems,
                'message' => 'Cart items retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve cart items: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'UserID' => 'required|exists:tbUser,UserID',
            'BookID' => 'required|exists:tbBook,BookID',
            'Quantity' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Check if book exists and has enough stock
            $book = Book::find($request->BookID);
            if ($book->StockQuantity < $request->Quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock'
                ], 400);
            }

            // Check if item already exists in cart
            $existingItem = Cart::where('UserID', $request->UserID)
                               ->where('BookID', $request->BookID)
                               ->first();

            if ($existingItem) {
                $existingItem->update([
                    'Quantity' => $existingItem->Quantity + $request->Quantity
                ]);
                $cartItem = $existingItem;
            } else {
                $cartItem = Cart::create($request->all());
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $cartItem->load(['book', 'user']),
                'message' => 'Item added to cart successfully'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to cart: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'Quantity' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $cartItem = Cart::find($id);
            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found'
                ], 404);
            }

            // Check stock availability
            $book = Book::find($cartItem->BookID);
            if ($book->StockQuantity < $request->Quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock'
                ], 400);
            }

            $cartItem->update([
                'Quantity' => $request->Quantity
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $cartItem->fresh()->load(['book', 'user']),
                'message' => 'Cart item updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cart item: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $cartItem = Cart::find($id);
            
            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found'
                ], 404);
            }

            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cart item removed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove cart item: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getUserCart($userId)
    {
        try {
            $cartItems = Cart::with(['book', 'user'])
                            ->where('UserID', $userId)
                            ->get();

            return response()->json([
                'success' => true,
                'data' => $cartItems,
                'message' => 'User cart retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user cart: ' . $e->getMessage()
            ], 500);
        }
    }

    public function clearCart($userId)
    {
        try {
            Cart::where('UserID', $userId)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cart cleared successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cart: ' . $e->getMessage()
            ], 500);
        }
    }
}
