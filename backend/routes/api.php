<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\BookController;
use App\Http\Controllers\API\BookDetailController;

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

// Book Details CRUD routes
Route::prefix('book-details')->group(function () {
    Route::get('/', [BookDetailController::class, 'index']);
    Route::post('/', [BookDetailController::class, 'store']);
    Route::get('/{id}', [BookDetailController::class, 'show']);
    Route::put('/{id}', [BookDetailController::class, 'update']);
    Route::delete('/{id}', [BookDetailController::class, 'destroy']);
    Route::get('/book/{bookId}', [BookDetailController::class, 'getByBookId']);
});

// Keep existing category routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/categories/{id}/books', [CategoryController::class, 'books']);
Route::post('/categories', [CategoryController::class, 'store']);
