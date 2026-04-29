<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductOrder;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $firstProduct = Product::first();

        // Orden 1: Pendiente
        $order1 = Order::create([
            'customer_name' => 'María González',
            'email' => 'maria@example.com',
            'phone' => '3001234567',
            'shipping_city' => 'Bogotá',
            'shipping_department' => 'Bogotá D.C.',
            'shipping_address' => 'Calle 123 #45-67',
            'billing_address' => 'Calle 123 #45-67',
            'subtotal' => 36000,
            'shipping_cost' => 0,
            'discount_amount' => 0,
            'total' => 36000,
            'status' => 'pending',
            'paid_status' => 'Pendiente',
            'preference_id' => 'test-preference-1',
            'quantity' => 2,
        ]);

        if ($firstProduct) {
            ProductOrder::create([
                'product_id' => $firstProduct->id,
                'order_id' => $order1->id,
                'quantity' => 2,
                'size' => 'Única',
                'price_paid' => 18000,
                'num_in_order' => 1,
            ]);
        }

        // Orden 2: Pagada
        $order2 = Order::create([
            'customer_name' => 'Carlos Rodríguez',
            'email' => 'carlos@example.com',
            'phone' => '3109876543',
            'shipping_city' => 'Medellín',
            'shipping_department' => 'Antioquia',
            'shipping_address' => 'Carrera 80 #23-10',
            'billing_address' => 'Carrera 80 #23-10',
            'subtotal' => 54000,
            'shipping_cost' => 12000,
            'discount_amount' => 5400,
            'total' => 60600,
            'status' => 'paid',
            'paid_status' => 'Pagada',
            'payment_id' => 'MP-TEST-123456',  // CORREGIDO: era pyment_id
            'preference_id' => 'test-preference-2',
            'quantity' => 3,
        ]);

        if ($firstProduct) {
            ProductOrder::create([
                'product_id' => $firstProduct->id,
                'order_id' => $order2->id,
                'quantity' => 3,
                'size' => 'Caballero (39-42)',
                'price_paid' => 18000,
                'discount' => 10,
                'discount_code' => 'TEST10',
                'num_in_order' => 1,
            ]);
        }

        // Orden 3: Enviada (con regalo)
        $order3 = Order::create([
            'customer_name' => 'Ana Martínez',
            'email' => 'ana@example.com',
            'phone' => '3205551234',
            'shipping_city' => 'Cali',
            'shipping_department' => 'Valle del Cauca',
            'shipping_address' => 'Avenida 6N #24-55',
            'billing_address' => 'Avenida 6N #24-55',
            'gift_from' => 'Pedro',    // CORREGIDO: era 'de'
            'gift_to' => 'Juanita',    // CORREGIDO: era 'para'
            'is_gift' => true,
            'gift_message' => '¡Feliz cumpleaños! Con mucho cariño.',
            'subtotal' => 18000,
            'shipping_cost' => 12000,
            'discount_amount' => 0,
            'total' => 30000,
            'status' => 'shipped',
            'paid_status' => 'Pagada',
            'payment_id' => 'MP-TEST-789012',  // CORREGIDO: era pyment_id
            'tracking_number' => 'TRACK-2026-001',
            'shipping_guide' => 'Servientrega',
            'preference_id' => 'test-preference-3',
            'quantity' => 1,
        ]);

        if ($firstProduct) {
            ProductOrder::create([
                'product_id' => $firstProduct->id,
                'order_id' => $order3->id,
                'quantity' => 1,
                'size' => 'Dama (35-38)',
                'price_paid' => 18000,
                'num_in_order' => 1,
            ]);
        }
    }
}
