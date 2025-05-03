<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\BookController;
use App\Http\Controllers\API\BookDetailController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\OrderDetailController;
use App\Http\Controllers\API\PurchaseController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\WishlistController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\PageContentController;
use App\Http\Controllers\API\ApiKeyController;
use App\Http\Controllers\API\CustomerAccountController;
use App\Http\Controllers\API\CustomerOrderController;
use App\Http\Middleware\ValidateApiKey;
use App\Http\Middleware\AdminOnly;
use Illuminate\Support\Str;
use App\Models\ApiKey;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/me', [AuthController::class, 'me']);

// Admin-only API key management routes
Route::prefix('api-keys')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/', [ApiKeyController::class, 'index']);
    Route::post('/', [ApiKeyController::class, 'store']);
    Route::get('/{id}', [ApiKeyController::class, 'show']);
    Route::put('/{id}', [ApiKeyController::class, 'update']);
    Route::delete('/{id}', [ApiKeyController::class, 'destroy']);
    Route::post('/{id}/regenerate', [ApiKeyController::class, 'regenerate']);
});

// Apply API key middleware to all routes that need protection
Route::middleware('api.key')->group(function () {
    // Books CRUD routes
    Route::prefix('books')->group(function () {
        Route::get('/search', [BookController::class, 'search']);
        Route::get('/', [BookController::class, 'index']);
        Route::post('/', [BookController::class, 'store']);
        Route::get('/featured', [BookController::class, 'featured']);
        Route::get('/{id}', [BookController::class, 'show']);
        Route::put('/{id}', [BookController::class, 'update']);
        Route::delete('/{id}', [BookController::class, 'destroy']);
        Route::get('/{id}/related', [BookController::class, 'related']);
        Route::get('/{id}/image', [BookController::class, 'getImage']);
    });

    // Book details CRUD routes
    Route::prefix('book-details')->group(function () {
        Route::get('/', [BookDetailController::class, 'index']);
        Route::post('/', [BookDetailController::class, 'store']);
        Route::get('/{id}', [BookDetailController::class, 'show']);
        Route::put('/{id}', [BookDetailController::class, 'update']);
        Route::delete('/{id}', [BookDetailController::class, 'destroy']);
        Route::get('/book/{bookId}', [BookDetailController::class, 'getByBookId']);
    });

    // Category CRUD routes
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::get('/{id}', [CategoryController::class, 'show']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
        Route::get('/{id}/books', [CategoryController::class, 'books']);
    });

    // Order CRUD routes
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::post('/guest', [OrderController::class, 'storeGuestOrder']);
        Route::get('/stats', [OrderController::class, 'getStats']);
        Route::get('/account/{accountId}/history', [OrderController::class, 'getOrderHistory']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::put('/{id}', [OrderController::class, 'update']);
        Route::delete('/{id}', [OrderController::class, 'destroy']);
        Route::post('/{id}/payment', [OrderController::class, 'updatePayment'])->middleware('paypal.return');
    });

    // OrderDetail CRUD routes
    Route::prefix('order-details')->group(function () {
        Route::get('/', [OrderDetailController::class, 'index']);
        Route::post('/', [OrderDetailController::class, 'store']);
        Route::get('/{id}', [OrderDetailController::class, 'show']);
        Route::put('/{id}', [OrderDetailController::class, 'update']);
        Route::delete('/{id}', [OrderDetailController::class, 'destroy']);
    });

    // User CRUD routes
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/stats', [UserController::class, 'getStats']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    // Purchase CRUD routes
    Route::prefix('purchases')->group(function () {
        Route::get('/', [PurchaseController::class, 'index']);
        Route::post('/', [PurchaseController::class, 'store']);
        Route::get('/{id}', [PurchaseController::class, 'show']);
        Route::put('/{id}', [PurchaseController::class, 'update']);
        Route::delete('/{id}', [PurchaseController::class, 'destroy']);
    });

    // Cart CRUD routes
    Route::prefix('carts')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'store']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/{id}', [CartController::class, 'destroy']);
        Route::get('/user/{userId}', [CartController::class, 'getUserCart']);
        Route::delete('/user/{userId}/clear', [CartController::class, 'clearCart']);
    });

    // Wishlist CRUD routes
    Route::prefix('wishlists')->group(function () {
        Route::get('/', [WishlistController::class, 'index']);
        Route::post('/', [WishlistController::class, 'store']);
        Route::delete('/{id}', [WishlistController::class, 'destroy']);
        Route::get('/user/{userId}', [WishlistController::class, 'getUserWishlist']);
        Route::delete('/user/{userId}/clear', [WishlistController::class, 'clearWishlist']);
    });

    // Dashboard routes
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
    });

    // Page Content CRUD routes
    Route::prefix('page-contents')->group(function () {
        Route::get('/', [PageContentController::class, 'index']);
        Route::post('/', [PageContentController::class, 'store']);
        Route::get('/{slug}', [PageContentController::class, 'show']);
        Route::put('/{slug}', [PageContentController::class, 'update']);
        Route::delete('/{slug}', [PageContentController::class, 'destroy']);
    });
});

// Public page content routes (unprotected)
Route::prefix('public')->group(function () {
    Route::get('/pages/{slug}', [PageContentController::class, 'getPublishedPage']);
});

// CSRF Token route for web apps
Route::get('/csrf-token', function() {
    // Force regenerate a new token
    $token = Str::random(40);
    session(['_token' => $token]);
    
    Log::info('CSRF token generated', [
        'token' => $token,
        'ip' => request()->ip(),
        'timestamp' => now()->toDateTimeString()
    ]);
    
    return response()->json([
        'token' => $token,
        'status' => 'success'
    ]);
});

// PayPal webhook for web platform notifications
Route::post('/paypal-webhook', function(Request $request) {
    // Log the webhook request with more details
    Log::info('PayPal webhook received', [
        'data' => $request->all(), 
        'headers' => $request->header(),
        'ip' => $request->ip(),
        'path' => $request->path(),
        'timestamp' => now()->toDateTimeString()
    ]);
    
    // Extract order ID and payment ID
    $orderId = $request->input('order_id');
    $paymentId = $request->input('payment_id') ?? $request->input('paymentId');
    $isDirect = $request->input('is_direct_webhook', false);
    $fullUrl = $request->input('full_url', '');
    
    // Handle case where the order ID contains query parameters
    if ($orderId && strpos($orderId, '?') !== false) {
        $parts = explode('?', $orderId);
        $orderId = $parts[0];
        
        Log::info('Extracted order ID from malformed parameter', [
            'original' => $request->input('order_id'),
            'extracted' => $orderId
        ]);
        
        // Try to extract payment ID from embedded query string if not already set
        if (!$paymentId && isset($parts[1])) {
            parse_str($parts[1], $queryParams);
            $paymentId = $queryParams['paymentId'] ?? null;
            
            if ($paymentId) {
                Log::info('Extracted payment ID from embedded query string', [
                    'extracted_payment_id' => $paymentId
                ]);
            }
        }
    }
    
    // If we have a full URL but no payment ID, try to extract it
    if (!$paymentId && $fullUrl) {
        if (preg_match('/paymentId=([^&]+)/', $fullUrl, $matches)) {
            $paymentId = $matches[1];
            Log::info('Extracted payment ID from full URL', [
                'extracted_payment_id' => $paymentId
            ]);
        }
    }
    
    // If no order ID provided, but we have a payment ID, try to find the order by payment transaction
    $order = null;
    if (!$orderId && $paymentId) {
        Log::info('No order ID provided, trying to find order by payment ID', [
            'payment_id' => $paymentId
        ]);
        
        // First try to find an order with this payment ID in payment details column if it exists
        try {
            $orderWithPaymentDetails = \App\Models\Order::where('OrderStatus', '!=', 'Completed')
                ->where('PaymentMethod', 'PayPal')
                ->where(function($query) use ($paymentId) {
                    $query->where('PaymentDetails', 'like', '%'.$paymentId.'%')
                          ->orWhere('Notes', 'like', '%'.$paymentId.'%');
                })
                ->orderBy('OrderDate', 'desc')
                ->first();
                
            if ($orderWithPaymentDetails) {
                $order = $orderWithPaymentDetails;
                Log::info('Found order by payment ID in details column', [
                    'order_id' => $order->OrderID,
                    'order_status' => $order->OrderStatus
                ]);
                $orderId = $order->OrderID;
            }
        } catch (\Exception $e) {
            Log::warning('Error searching for order with payment details', [
                'error' => $e->getMessage()
            ]);
        }
        
        // If still not found, get the most recent PayPal order
        if (!$order) {
            $order = \App\Models\Order::where('OrderStatus', '!=', 'Completed')
                ->where('PaymentMethod', 'PayPal')
                ->orderBy('OrderDate', 'desc')
                ->first();
                
            if ($order) {
                Log::info('Found most recent PayPal order', [
                    'order_id' => $order->OrderID,
                    'order_status' => $order->OrderStatus
                ]);
                $orderId = $order->OrderID;
            }
        }
    } else if ($orderId) {
        // Get the order by ID
        $order = \App\Models\Order::find($orderId);
    }
    
    if ($order) {
        // Log the order info
        Log::info('Found order for webhook', [
            'order_id' => $order->OrderID,
            'order_status' => $order->OrderStatus,
            'is_direct' => $isDirect
        ]);
        
        // Only process if not already completed
        if ($order->OrderStatus !== 'Completed') {
            // Load order relationships
            $order->load(['orderDetails.book', 'customerAccount']);
            
            // Create notification for admin
            try {
                $telegramService = app(\App\Services\TelegramBotService::class);
                $notificationService = new \App\Services\OrderNotificationService($telegramService);
                $notified = $notificationService->sendNewOrderNotifications($order);
                
                // Update order status if notification sent
                if ($notified) {
                    $order->OrderStatus = 'Completed';
                    $order->save();
                    
                    Log::info('Order notification sent successfully', [
                        'order_id' => $order->OrderID,
                        'is_direct' => $isDirect
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Failed to send order notification', [
                    'order_id' => $order->OrderID,
                    'error' => $e->getMessage(),
                    'is_direct' => $isDirect
                ]);
            }
        } else {
            Log::info('Order already completed, skipping notification', [
                'order_id' => $order->OrderID,
                'is_direct' => $isDirect
            ]);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Webhook processed successfully',
            'order_status' => $order->OrderStatus
        ]);
    } else {
        Log::warning('Order not found for webhook', [
            'order_id' => $orderId,
            'payment_id' => $paymentId,
            'is_direct' => $isDirect
        ]);
    }
    
    return response()->json([
        'success' => false,
        'message' => 'No valid order found'
    ]);
});

// Keep the existing public route for backward compatibility
Route::get('/pages/{slug}', [PageContentController::class, 'getPublishedPage']);

// Customer Account routes
Route::prefix('customer')->middleware('api.key')->group(function () {
    // Public routes (no auth required)
    Route::post('/register', [CustomerAccountController::class, 'register']);
    Route::post('/login', [CustomerAccountController::class, 'login']);
    
    // Protected routes (auth required)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [CustomerAccountController::class, 'logout']);
        Route::get('/profile', [CustomerAccountController::class, 'show']);
        Route::put('/profile', [CustomerAccountController::class, 'update']);
        Route::post('/change-password', [CustomerAccountController::class, 'changePassword']);
        Route::post('/deactivate', [CustomerAccountController::class, 'deactivate']);
        
        // Customer order routes
        Route::prefix('orders')->group(function () {
            Route::post('/', [CustomerOrderController::class, 'placeOrder']);
            Route::get('/', [CustomerOrderController::class, 'getMyOrders']);
            Route::get('/{id}', [CustomerOrderController::class, 'getMyOrder']);
            Route::post('/{id}/cancel', [CustomerOrderController::class, 'cancelMyOrder']);
            Route::post('/{id}/payment', [CustomerOrderController::class, 'updateOrderPayment'])->middleware('paypal.return');
        });
    });
    
    // Admin-only routes
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/accounts', [CustomerAccountController::class, 'index']);
        Route::get('/accounts/{id}', [CustomerAccountController::class, 'getById']);
        Route::post('/accounts/{id}/toggle-activation', [CustomerAccountController::class, 'toggleActivation']);
    });
});