<?php

use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\ProductApiController;
use App\Http\Controllers\Api\CartApiController;
use App\Http\Controllers\Api\TransactionApiController;
use App\Http\Controllers\Api\AddressApiController;  // ← TAMBAHKAN
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\TransactionController as AdminTransactionController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthApiController::class, 'register']);
Route::post('/login', [AuthApiController::class, 'login']);

Route::get('/products', [ProductApiController::class, 'index']);
Route::get('/products/{id}', [ProductApiController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthApiController::class, 'logout']);
    Route::get('/profile', [AuthApiController::class, 'profile']);

    // Cart
    Route::get('/cart', [CartApiController::class, 'index']);
    Route::post('/cart/add/{productId}', [CartApiController::class, 'add']);
    Route::put('/cart/update/{cartId}', [CartApiController::class, 'update']);
    Route::delete('/cart/remove/{cartId}', [CartApiController::class, 'destroy']);

    // Transaction
    Route::get('/transactions', [TransactionApiController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionApiController::class, 'show']);
    Route::post('/checkout', [TransactionApiController::class, 'checkout']);

    // Address (TAMBAHKAN INI)
    Route::get('/addresses', [AddressApiController::class, 'index']);
    Route::get('/addresses/default', [AddressApiController::class, 'default']);
    Route::post('/addresses', [AddressApiController::class, 'store']);
    Route::put('/addresses/{id}', [AddressApiController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressApiController::class, 'destroy']);
    Route::put('/addresses/{id}/default', [AddressApiController::class, 'setDefault']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    Route::get('/products', [AdminProductController::class, 'index']);
    Route::post('/products', [AdminProductController::class, 'store']);
    Route::get('/products/{id}', [AdminProductController::class, 'show']);
    Route::put('/products/{id}', [AdminProductController::class, 'update']);
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);

    Route::get('/transactions', [AdminTransactionController::class, 'index']);
    Route::put('/transactions/{id}/status', [AdminTransactionController::class, 'updateStatus']);
});