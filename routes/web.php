<?php

use App\Http\Controllers\Admin\ArtikelController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InventarisController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Admin\PeminjamanController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Root route -> redirect ke dashboard (jika belum login, otomatis ke /login)
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Login Redirect with Intended URL
Route::get('/login-redirect', function (Illuminate\Http\Request $request) {
    if ($request->has('redirect')) {
        session()->put('url.intended', $request->query('redirect'));
    }
    return redirect()->route('login');
})->name('login.redirect');

// Public Item Detail (QR Code Resolution) - Menggunakan Encrypted Hash
Route::get('/item/{hash}', [\App\Http\Controllers\PublicItemController::class, 'show'])->name('public.item.show');


// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Admin routes — semua butuh login
Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {

    // Inventaris
    Route::get('/inventaris', [InventarisController::class, 'index'])->name('inventaris.index');
    Route::post('/inventaris', [InventarisController::class, 'store'])->name('inventaris.store');
    Route::put('/inventaris/{item}', [InventarisController::class, 'update'])->name('inventaris.update');
    Route::patch('/inventaris/{item}/status', [InventarisController::class, 'updateStatus'])->name('inventaris.status');
    Route::delete('/inventaris/{item}', [InventarisController::class, 'destroy'])->name('inventaris.destroy');
    Route::get('/inventaris/{item}/download-qr', [InventarisController::class, 'downloadQr'])->name('inventaris.download-qr');

    // Peminjaman
    Route::get('/peminjaman', [PeminjamanController::class, 'index'])->name('peminjaman.index');
    Route::post('/peminjaman', [PeminjamanController::class, 'store'])->name('peminjaman.store');
    Route::post('/peminjaman/{loan}/return', [PeminjamanController::class, 'returnLoan'])->name('peminjaman.return');

    // Artikel
    Route::get('/artikel', [ArtikelController::class, 'index'])->name('artikel.index');
    Route::get('/artikel/create', [ArtikelController::class, 'create'])->name('artikel.create');
    Route::post('/artikel', [ArtikelController::class, 'store'])->name('artikel.store');
    Route::get('/artikel/{artikel}/edit', [ArtikelController::class, 'edit'])->name('artikel.edit');
    Route::put('/artikel/{artikel}', [ArtikelController::class, 'update'])->name('artikel.update');
    Route::delete('/artikel/{artikel}', [ArtikelController::class, 'destroy'])->name('artikel.destroy');

    // Laporan
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');

    // Pengaturan
    Route::get('/pengaturan', [PengaturanController::class, 'index'])->name('pengaturan.index');
    Route::patch('/pengaturan/profile', [PengaturanController::class, 'updateProfile'])->name('pengaturan.profile');
    Route::post('/pengaturan/password', [PengaturanController::class, 'updatePassword'])->name('pengaturan.password');

    // Profile (bawaan Breeze — tidak lagi dipakai, tetapi dipertahankan untuk kompatibilitas)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
