<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthJwtController;
use App\Http\Controllers\Payments\ApiGamesController;
use App\Http\Controllers\Payments\DigiflazzController;
use App\Http\Controllers\Payments\PaymentController;
use App\Http\Controllers\Payments\PlnController;
use App\Http\Controllers\ProfileJwtController;
use App\Http\Controllers\TransactionJwtController;
use App\Models\User;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', function (Request $request) {
    try {
        $user = User::findOrFail($request->user_id);
    } catch(Exception $_e) {
        return response()->json([
            "message" => "User not found"
        ], 404);
    }
    $user["roles"] = $user->roles;
    foreach($user["roles"] as $role) {
        $role->detail;
        $role->createdBy;
    }
    return response()->json($user, 200);
});

Route::controller(AuthJwtController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
});

Route::controller(ProfileJwtController::class)->group(function () {
    Route::post('profile', 'getProfile');
});

Route::controller(TransactionJwtController::class)->middleware('auth:api')->group(function () {
    Route::get('transactions', 'search')->name('api.transactions');
});

Route::controller(PaymentController::class)->group(function () {
    Route::get('payment/list', 'getCommodities');
});

Route::controller(PlnController::class)->group(function () {
    Route::get('payment/pln/check', 'checkSub');
});

Route::controller(ApiGamesController::class)->group(function () {
    Route::get('payment/apigames/account', 'accountInfo');
    Route::post('payment/apigames/purchase', 'purchase');
    Route::get('payment/apigames/status', 'checkTransactionStatus');
});

Route::controller(DigiflazzController::class)->group(function () {
    Route::get('payment/digiflazz', 'balanceCheck');
});
