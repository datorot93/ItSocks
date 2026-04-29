<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subcategory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_category')->constrained('category')->onDelete('restrict');
            $table->string('code')->nullable();
            $table->string('name');
            $table->integer('discount')->default(0);
            $table->string('image_url')->nullable();
            $table->integer('priority')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subcategory');
    }
};
