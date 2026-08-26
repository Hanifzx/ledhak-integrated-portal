<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Tambahkan nilai 'Hilang' ke kolom enum status pada tabel items.
     * MySQL tidak mendukung ALTER COLUMN ENUM via Blueprint, jadi gunakan raw SQL.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE items MODIFY COLUMN status ENUM('Tersedia', 'Dipinjam', 'Perbaikan', 'Hilang') NOT NULL DEFAULT 'Tersedia'");
    }

    public function down(): void
    {
        // Hapus nilai 'Hilang' — item yang statusnya Hilang akan diubah ke Perbaikan dulu
        DB::statement("UPDATE items SET status = 'Perbaikan' WHERE status = 'Hilang'");
        DB::statement("ALTER TABLE items MODIFY COLUMN status ENUM('Tersedia', 'Dipinjam', 'Perbaikan') NOT NULL DEFAULT 'Tersedia'");
    }
};
