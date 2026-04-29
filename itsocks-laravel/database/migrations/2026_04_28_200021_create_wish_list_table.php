<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Nota: en FastAPI el tablename original era 'whish_list' (typo)
        // En Laravel usamos el nombre correcto 'wish_list'
        Schema::create('wish_list', function (Blueprint $table) {
            $table->id();
            $table->string('id_list')->unique(); // token público
            $table->string('url_list')->nullable();
            $table->text('json_list')->nullable(); // legacy JSON de productos
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wish_list');
    }
};
