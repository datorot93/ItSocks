<?php

namespace Tests\Feature\Api;

use App\Mail\OrderConfirmation;
use App\Jobs\SendShippingGuideEmail;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shipping;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_crear_orden_basica(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/v1/orders', [
            'customer_name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'phone' => '3001234567',
            'shipping_city' => 'Bogotá',
            'shipping_department' => 'Bogotá D.C.',
            'shipping_address' => 'Calle 123 # 45-67',
            'subtotal' => 45000,
            'shipping_cost' => 0,
            'total' => 45000,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.email', 'juan@example.com');
    }

    public function test_crear_orden_dispara_email_confirmacion(): void
    {
        Mail::fake();

        $product = Product::factory()->create(['price' => 45000]);

        $response = $this->postJson('/api/v1/orders', [
            'customer_name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'phone' => '3001234567',
            'shipping_city' => 'Bogotá',
            'subtotal' => 45000,
            'shipping_cost' => 0,
            'total' => 45000,
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1, 'size' => 'M'],
            ],
        ]);

        $response->assertStatus(201);
        Mail::assertQueued(OrderConfirmation::class, fn ($mail) =>
            $mail->hasTo('juan@example.com')
        );
    }

    public function test_crear_orden_persiste_en_bd(): void
    {
        Mail::fake();

        $this->postJson('/api/v1/orders', [
            'customer_name' => 'Ana García',
            'email' => 'ana@example.com',
            'phone' => '3009999999',
            'shipping_city' => 'Medellín',
            'subtotal' => 60000,
            'shipping_cost' => 8000,
            'total' => 68000,
        ]);

        $this->assertDatabaseHas('orders', [
            'email' => 'ana@example.com',
            'shipping_city' => 'Medellín',
        ]);
    }

    public function test_listar_ordenes_requiere_autenticacion(): void
    {
        $response = $this->getJson('/api/v1/orders');
        $response->assertStatus(401);
    }

    public function test_listar_ordenes_como_admin(): void
    {
        Order::factory()->count(3)->create();

        $response = $this->asAdmin()->getJson('/api/v1/orders');

        $response->assertStatus(200);
    }

    public function test_obtener_orden_por_id(): void
    {
        $order = Order::factory()->create();

        $response = $this->asAdmin()->getJson("/api/v1/orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $order->id);
    }

    public function test_orden_no_existente_retorna_404(): void
    {
        $response = $this->asAdmin()->getJson('/api/v1/orders/99999');
        $response->assertStatus(404);
    }

    public function test_actualizar_estado_orden(): void
    {
        $order = Order::factory()->create(['status' => 'pending']);

        $response = $this->asAdmin()->putJson("/api/v1/orders/{$order->id}", [
            'status' => 'paid',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'paid']);
    }

    public function test_agregar_guia_de_envio_dispara_job(): void
    {
        Queue::fake();
        $order = Order::factory()->create(['status' => 'paid', 'email' => 'cliente@example.com']);

        $response = $this->asAdmin()->postJson("/api/v1/orders/{$order->id}/shipping-guide", [
            'tracking_number' => 'TCC-123456789',
        ]);

        $response->assertStatus(200);
        Queue::assertPushed(SendShippingGuideEmail::class);
    }

    public function test_agregar_guia_actualiza_estado_a_shipped(): void
    {
        Queue::fake();
        $order = Order::factory()->create(['status' => 'paid']);

        $this->asAdmin()->postJson("/api/v1/orders/{$order->id}/shipping-guide", [
            'tracking_number' => 'TCC-999',
        ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'shipped',
            'tracking_number' => 'TCC-999',
        ]);
    }

    public function test_eliminar_orden_como_admin(): void
    {
        $order = Order::factory()->create();

        $response = $this->asAdmin()->deleteJson("/api/v1/orders/{$order->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
    }

    public function test_validacion_email_requerido(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/v1/orders', [
            'customer_name' => 'Test',
            'phone' => '3001234567',
            'shipping_city' => 'Bogotá',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
}
