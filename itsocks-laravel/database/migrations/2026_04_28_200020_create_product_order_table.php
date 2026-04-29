<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_order', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('product')->onDelete('restrict');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->string('pack')->nullable();
            $table->decimal('pack_cost', 10, 2)->nullable();
            $table->integer('num_in_order')->default(1);
            $table->string('size')->nullable();
            $table->integer('discount')->default(0);
            $table->string('discount_code')->nullable();
            $table->decimal('price_paid', 10, 2)->nullable();
            $table->string('color')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_order');
    }
};
