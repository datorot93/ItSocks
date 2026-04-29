<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wish_list_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wish_list_id')->constrained('wish_list')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('product')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wish_list_product');
    }
};
