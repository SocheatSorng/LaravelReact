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

// Books CRUD routes
Route::prefix('books')->group(function () {
    Route::get('/', [BookController::class, 'index']);
    Route::post('/', [BookController::class, 'store']);
    Route::get('/featured', [BookController::class, 'featured']);
    Route::get('/{id}', [BookController::class, 'show']);
    Route::put('/{id}', [BookController::class, 'update']);
    Route::delete('/{id}', [BookController::class, 'destroy']);
    Route::get('/{id}/related', [BookController::class, 'related']);
});

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
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
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