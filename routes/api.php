<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use app\Http\Controllers\Api\UserController;


Route::get('/ping', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is working',
        'time' => now()->toDateTimeString(),
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register'])->name('register')->middleware('throttle:6,1');

Route::post('/login', [AuthController::class, 'login'])->name('login')->middleware('throttle:6,1');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth:sanctum');

Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('forgotPassword')->middleware('throttle:6,1');

Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('reset-password')->middleware('throttle:6,1');

Route::post('/change-password', [AuthController::class, 'changePassword'])->name('changePassword')->middleware('auth:sanctum');

Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Verification link kou handle krta hai (email se aata hai, browser mein khulta hai -> auth:sanctum nahi, sirf signed)
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');   // naam EXACT yahi rakhna (notification isi se URL banata hai)

// Dobara verification email bhejo (login zaroori)
Route::post('/email/verification-notification', [AuthController::class, 'resendVerification'])
    ->middleware(['auth:sanctum', 'throttle:6,1'])
    ->name('verification.send');

    Route::get('/users', [UserController::class, 'index'])
    ->middleware(['auth:sanctum']);
