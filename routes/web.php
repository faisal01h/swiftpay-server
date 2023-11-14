<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransactionJwtController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if(Auth::guard('web')->user()) {
        return redirect(route('dashboard'));
    }
    // return response()->json(Auth::guard('web')->user());
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware(['auth:web', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/transactions', [DashboardController::class, 'showTransactions'])->name('dashboard.transactions');
    Route::post('/transactions/set-status', [TransactionController::class, 'setStatus'])->name('dashboard.transactions.status');

    Route::get('/management', [DashboardController::class, 'managementIndex'])->name('dashboard.management');
    Route::get('/products', [DashboardController::class, 'products'])->name('dashboard.products');
    Route::get('/products/edit/{sku}', [ProductController::class, 'viewEdit'])->name('dashboard.products.edit');
    Route::post('/products/edit/{sku}', [ProductController::class, 'edit']);

    Route::post('/category/image', [ProductController::class, 'categoryImageUpload'])->name('dashboard.categories.image');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/pull-price', [ProductController::class, 'pullDigiflazzPrices'])->name('price.pull');

    Route::get('/wapi/transactions', [TransactionJwtController::class, 'search'])->name('wapi.transactions');
    Route::post('/wapi/role/assign', [DashboardController::class, 'assignRole'])->name('wapi.assign-role');
    Route::post('/wapi/role/remove', [DashboardController::class, 'removeRole'])->name('wapi.remove-role');
    Route::post('/wapi/product/status', [ProductController::class, 'toggleEnabled'])->name('wapi.product.togglestatus');
});


require __DIR__.'/auth.php';
