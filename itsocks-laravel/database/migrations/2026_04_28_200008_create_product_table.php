<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_design')->nullable()->constrained('design')->onDelete('set null');
            $table->foreignId('id_type')->nullable()->constrained('type')->onDelete('set null');
            $table->foreignId('id_subcategory')->nullable()->constrained('subcategory')->onDelete('set null');
            $table->string('code')->nullable();
            $table->string('name');
            $table->string('talla')->nullable(); // legacy field — talla descriptiva (ej: "Única")
            $table->decimal('price', 10, 2);
            $table->boolean('state')->default(true); // is_active
            $table->string('color')->nullable(); // legacy field
            $table->integer('discount')->default(0);
            $table->boolean('compresion')->default(false);
            $table->integer('quantity')->default(0);
            $table->text('description')->nullable();
            $table->boolean('season')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
