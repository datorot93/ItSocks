<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabla "orders" con typos CORREGIDOS respecto al esquema FastAPI original:
     *   billing_addess  → billing_address
     *   pyment_id       → payment_id
     *   de              → gift_from
     *   para            → gift_to
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // Datos del cliente
            $table->string('customer_name');         // reemplaza first_name + last_name
            $table->string('first_name')->nullable(); // mantenido para compatibilidad
            $table->string('last_name')->nullable();  // mantenido para compatibilidad
            $table->string('email');
            $table->string('phone')->nullable();      // reemplaza phone_number
            $table->string('document')->nullable();
            $table->string('document_type')->nullable();
            // Dirección de envío
            $table->string('shipping_city');          // reemplaza city
            $table->string('shipping_department')->nullable(); // reemplaza region
            $table->string('shipping_address')->nullable();   // reemplaza address
            $table->string('billing_address')->nullable();    // CORREGIDO: era billing_addess
            // Pago
            $table->string('payment_id')->nullable();         // CORREGIDO: era pyment_id
            $table->string('preference_id')->nullable();      // reemplaza preference
            $table->string('paid_status')->default('Pendiente');
            // Regalo
            $table->string('gift_from')->nullable();          // CORREGIDO: era 'de'
            $table->string('gift_to')->nullable();            // CORREGIDO: era 'para'
            $table->boolean('is_gift')->default(false);       // reemplaza isGift
            $table->string('gift_message')->nullable();
            // Logística
            $table->string('shipping_guide')->nullable()->default('No asignada');
            $table->string('shipping_guide_url')->nullable();
            $table->string('shipping_guide_number')->nullable();
            $table->string('tracking_number')->nullable();
            // Montos
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            // Estado
            $table->string('status')->default('pending');     // equivalente a state/paid_status
            $table->string('country')->nullable();
            $table->string('extra_info')->nullable();
            $table->text('special_instructions')->nullable();
            $table->integer('quantity')->default(0);          // legacy: total items
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
