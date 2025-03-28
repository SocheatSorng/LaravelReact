<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Wishlist::with(['book', 'user']);

            // Filter by user
            if ($request->has('user_id')) {
                $query->where('UserID', $request->user_id);
            }

            $wishlistItems = $query->get();

            return response()->json([
                'success' => true,
                'data' => $wishlistItems,
                'message' => 'Wishlist items retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve wishlist items: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'UserID' => 'required|exists:tbUser,UserID',
            'BookID' => 'required|exists:tbBook,BookID'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if item already exists in wishlist
            $exists = Wishlist::where('UserID', $request->UserID)
                            ->where('BookID', $request->BookID)
                            ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Item already in wishlist'
                ], 400);
            }

            $wishlistItem = Wishlist::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $wishlistItem->load(['book', 'user']),
                'message' => 'Item added to wishlist successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to wishlist: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $wishlistItem = Wishlist::find($id);
            
            if (!$wishlistItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wishlist item not found'
                ], 404);
            }

            $wishlistItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from wishlist successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove item from wishlist: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getUserWishlist($userId)
    {
        try {
            $wishlistItems = Wishlist::with(['book', 'user'])
                                   ->where('UserID', $userId)
                                   ->get();

            return response()->json([
                'success' => true,
                'data' => $wishlistItems,
                'message' => 'User wishlist retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user wishlist: ' . $e->getMessage()
            ], 500);
        }
    }

    public function clearWishlist($userId)
    {
        try {
            Wishlist::where('UserID', $userId)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Wishlist cleared successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear wishlist: ' . $e->getMessage()
            ], 500);
        }
    }
}
