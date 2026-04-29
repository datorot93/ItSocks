<?php

namespace Tests\Feature\Api;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_crear_preferencia_mercadopago(): void
    {
        Http::fake([
            'api.mercadopago.com/*' => Http::response([
                'id' => 'TEST-PREFERENCE-123456',
                'init_point' => 'https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=TEST-123',
            ], 200),
        ]);

        $order = Order::factory()->create(['total' => 80000]);

        $response = $this->postJson('/api/v1/payments/preference', [
            'order_id' => $order->id,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('preference_id', 'TEST-PREFERENCE-123456');
    }

    public function test_crear_preferencia_con_items_directos(): void
    {
        Http::fake([
            'api.mercadopago.com/*' => Http::response([
                'id' => 'TEST-PREF-456',
                'init_point' => 'https://mercadopago.com',
            ], 200),
        ]);

        $response = $this->postJson('/api/v1/payments/preference', [
            'items' => [
                ['title' => 'Media Test', 'quantity' => 2, 'unit_price' => 45000],
            ],
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('preference_id', 'TEST-PREF-456');
    }

    public function test_webhook_mercadopago_actualiza_estado_a_paid(): void
    {
        $order = Order::factory()->create(['status' => 'pending']);

        Http::fake([
            'api.mercadopago.com/v1/payments/*' => Http::response([
                'id' => 123456789,
                'status' => 'approved',
                'external_reference' => (string) $order->id,
            ], 200),
        ]);

        $response = $this->postJson('/api/v1/payments/webhook', [
            'type' => 'payment',
            'data' => ['id' => '123456789'],
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'paid']);
    }

    public function test_webhook_tipo_desconocido_retorna_ok(): void
    {
        $response = $this->postJson('/api/v1/payments/webhook', [
            'type' => 'merchant_order',
            'data' => ['id' => '999'],
        ]);

        $response->assertStatus(200);
    }

    public function test_webhook_sin_external_reference_no_falla(): void
    {
        // No creamos orden — el webhook no debe fallar aunque external_reference sea null
        Http::fake([
            'api.mercadopago.com/v1/payments/*' => Http::response([
                'id' => 999,
                'status' => 'approved',
                'external_reference' => null,
            ], 200),
        ]);

        $response = $this->postJson('/api/v1/payments/webhook', [
            'type' => 'payment',
            'data' => ['id' => '999'],
        ]);

        $response->assertStatus(200);
    }

    public function test_webhook_rechazado_actualiza_estado_a_cancelled(): void
    {
        $order = Order::factory()->create(['status' => 'pending']);

        Http::fake([
            'api.mercadopago.com/v1/payments/*' => Http::response([
                'id' => 777,
                'status' => 'rejected',
                'external_reference' => (string) $order->id,
            ], 200),
        ]);

        $this->postJson('/api/v1/payments/webhook', [
            'type' => 'payment',
            'data' => ['id' => '777'],
        ]);

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'cancelled']);
    }
}
