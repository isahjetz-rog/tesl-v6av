<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminCarController;
use App\Http\Controllers\AdminSettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Tesla Inventory CMS
|--------------------------------------------------------------------------
*/

// Public Frontend
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/cars/{id}', [HomeController::class, 'show'])->name('cars.show');
Route::post('/inquiries', [InquiryController::class, 'store'])->name('inquiries.store');

// Laravel Auth Authentication Scaffolding (Breeze/Jetstream or custom)
Auth::routes(['register' => false]); // Disable open admin registration for security

// Admin Protected Area (guarded by standard auth middleware)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    
    // Core Dashboard Statistics View
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    
    // Car Inventory Management CRUD Operations
    Route::resource('cars', AdminCarController::class)->except(['show']);
    Route::post('cars/{id}/toggle-active', [AdminCarController::class, 'toggleActive'])->name('cars.toggle-active');
    
    // Customer Inquiries Processing
    Route::get('inquiries', [AdminController::class, 'inquiries'])->name('inquiries.index');
    Route::put('inquiries/{id}/status', [AdminController::class, 'updateInquiryStatus'])->name('inquiries.update-status');
    Route::delete('inquiries/{id}', [AdminController::class, 'destroyInquiry'])->name('inquiries.destroy');
    
    // Site Settings CMS Panel
    Route::get('settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [AdminSettingController::class, 'update'])->name('settings.update');
});
