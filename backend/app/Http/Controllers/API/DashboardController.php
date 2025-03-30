<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use App\Models\Order;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats()
    {
        try {
            // Get counts of each entity
            $bookCount = Book::count();
            $categoryCount = Category::count();
            $userCount = User::count();
            $orderCount = Order::count();
            $purchaseCount = Purchase::count();
            
            // Calculate total revenue from orders
            $totalRevenue = Order::sum('TotalAmount');
            
            return response()->json([
                'success' => true,
                'data' => [
                    'TotalBooks' => $bookCount,
                    'TotalCategories' => $categoryCount,
                    'TotalUsers' => $userCount,
                    'TotalOrders' => $orderCount,
                    'TotalPurchases' => $purchaseCount,
                    'TotalRevenue' => $totalRevenue ?? 0
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 