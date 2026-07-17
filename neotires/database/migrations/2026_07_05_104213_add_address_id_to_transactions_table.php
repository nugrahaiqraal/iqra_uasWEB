<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('address_id')->nullable()->constrained()->onDelete('set null');
            $table->text('shipping_address')->nullable(); // Simpan alamat lengkap saat checkout
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['address_id', 'shipping_address']);
        });
    }
};