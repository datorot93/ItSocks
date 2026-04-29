<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipping', function (Blueprint $table) {
            $table->id();
            $table->string('municipio_ciudad');
            $table->string('departamento');
            $table->integer('tarifa'); // tarifa en COP
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipping');
    }
};
