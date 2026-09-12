<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

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

 Route::post('/register',[AuthController::class,'register'])->name('register')->middleware('throttle:6,1');

 Route::post('/login',[AuthController::class,'login'])->name('login')->middleware('throttle:6,1');

 Route::post('/logout',[AuthController::class,'logout'])->name('logout')->middleware('auth:sanctum');   


