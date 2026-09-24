<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;

// ONE-TIME SETUP — DELETE AFTER USE
Route::get('/run-setup', function () {
    $log = [];

    if (!Schema::hasColumn('admins', 'api_token')) {
        Schema::table('admins', function ($table) {
            $table->string('api_token', 80)->nullable()->unique()->after('role');
        });
        $log[] = 'api_token column added';
    } else {
        $log[] = 'api_token column already exists';
    }

    $hash = Hash::make('admin@123');
    $updated = DB::table('admins')->where('email', 'admin@hamsasoham.com')->update([
        'password'  => $hash,
        'api_token' => null,
    ]);

    if ($updated) {
        $log[] = 'Admin password reset to admin@123';
    } else {
        DB::table('admins')->insert([
            'name'       => 'Hamsa Soham Admin',
            'email'      => 'admin@hamsasoham.com',
            'password'   => $hash,
            'role'       => 'admin',
            'api_token'  => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $log[] = 'Admin user created with password admin@123';
    }

    return response()->json(['success' => true, 'log' => $log]);
});

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
