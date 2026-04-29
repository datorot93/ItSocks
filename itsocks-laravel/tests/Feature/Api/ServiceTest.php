<?php

namespace Tests\Feature\Api;

use App\Models\DiscountCode;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shipping;
use App\Services\DiscountService;
use App\Services\OrderService;
use App\Services\ProductCatalogService;
use App\Services\ShippingCalculatorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    // ── DiscountService ────────────────────────────────────────────────────

    public function test_discount_service_valida_codigo_activo(): void
    {
        DiscountCode::factory()->create(['code' => 'VERANO10', 'discount' => 10, 'state' => true]);

        $service = app(DiscountService::class);
        $result = $service->validate('VERANO10');

        $this->assertTrue($result['valid']);
        $this->assertEquals(10, $result['discount']);
    }

    public function test_discount_service_rechaza_codigo_inexistente(): void
    {
        $service = app(DiscountService::class);
        $result = $service->validate('GHOST');

        $this->assertFalse($result['valid']);
    }

    public function test_discount_service_rechaza_codigo_inactivo(): void
    {
        DiscountCode::factory()->create(['code' => 'DEAD', 'state' => false]);

        $service = app(DiscountService::class);
        $result = $service->validate('DEAD');

        $this->assertFalse($result['valid']);
    }

    // ── ShippingCalculatorService ──────────────────────────────────────────

    public function test_shipping_service_retorna_tarifa_correcta(): void
    {
        Shipping::factory()->create([
            'municipio_ciudad' => 'Bucaramanga',
            'departamento' => 'Santander',
            'tarifa' => 12000,
        ]);

        $service = app(ShippingCalculatorService::class);
        $rate = $service->getRate('Bucaramanga');

        $this->assertEquals(12000.0, $rate);
    }

    public function test_shipping_service_retorna_null_para_ciudad_inexistente(): void
    {
        $service = app(ShippingCalculatorService::class);
        $rate = $service->getRate('Ciudad Inexistente XYZ');

        $this->assertNull($rate);
    }

    // ── OrderService ──────────────────────────────────────────────────────

    public function test_order_service_crea_orden_correctamente(): void
    {
        Mail::fake();

        $service = app(OrderService::class);
        $order = $service->create([
            'customer_name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '3000000000',
            'shipping_city' => 'Bogotá',
            'subtotal' => 50000,
            'shipping_cost' => 0,
            'total' => 50000,
        ]);

        $this->assertInstanceOf(Order::class, $order);
        $this->assertEquals('test@example.com', $order->email);
        $this->assertEquals('pending', $order->status);
    }

    public function test_order_service_actualiza_estado(): void
    {
        $order = Order::factory()->create(['status' => 'pending']);

        $service = app(OrderService::class);
        $updated = $service->updateStatus($order, 'paid');

        $this->assertEquals('paid', $updated->status);
    }

    // ── ProductCatalogService ─────────────────────────────────────────────

    public function test_catalog_service_retorna_categorias_cacheadas(): void
    {
        \App\Models\Category::factory()->count(3)->create();

        $service = app(ProductCatalogService::class);
        $cats1 = $service->getCategories();
        $cats2 = $service->getCategories(); // debe venir de caché

        $this->assertCount(3, $cats1);
        $this->assertCount(3, $cats2);
    }
}
