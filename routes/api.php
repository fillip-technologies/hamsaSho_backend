<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        $dbConnected = true;
    } catch (\Exception $e) {
        $dbConnected = false;
    }

    return response()->json([
        'status' => 'ok',
        'database' => 'MySQL / MariaDB',
        'dbStatus' => ['connected' => $dbConnected],
        'message' => 'Hamsa Soham Admin & Inquiries API is running',
        'timestamp' => now()->toISOString(),
    ]);
});

// Admin routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminController::class, 'login']);
    Route::get('/db-status', [AdminController::class, 'dbStatus']);
    Route::middleware('admin.auth')->group(function () {
        Route::get('/me', [AdminController::class, 'me']);
    });
});

// Contact routes
Route::prefix('contacts')->group(function () {
    Route::post('/', [ContactController::class, 'store']);             // public
    Route::middleware('admin.auth')->group(function () {
        Route::get('/', [ContactController::class, 'index']);
        Route::get('/stats', [ContactController::class, 'stats']);
        Route::patch('/{id}/status', [ContactController::class, 'updateStatus']);
        Route::delete('/{id}', [ContactController::class, 'destroy']);
    });
});

// Testimonial routes
Route::prefix('testimonials')->group(function () {
    Route::get('/', [TestimonialController::class, 'index']);          // public
    Route::middleware('admin.auth')->group(function () {
        Route::post('/', [TestimonialController::class, 'store']);
        Route::put('/{id}', [TestimonialController::class, 'update']);
        Route::delete('/{id}', [TestimonialController::class, 'destroy']);
    });
});
