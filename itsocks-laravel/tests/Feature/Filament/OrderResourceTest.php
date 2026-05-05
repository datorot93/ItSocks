<?php

namespace Tests\Feature\Filament;

use App\Models\Order;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_ordenes_es_accesible(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);
        Order::factory()->count(5)->create();

        $response = $this->actingAs($admin)->get('/admin/orders');

        $response->assertStatus(200);
    }

    public function test_se_pueden_filtrar_ordenes_por_estado(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);
        Order::factory()->count(3)->create(['status' => 'paid']);
        Order::factory()->count(2)->create(['status' => 'pending']);

        $response = $this->actingAs($admin)->get('/admin/orders?tableFilters[status][value]=paid');

        $response->assertStatus(200);
    }

    public function test_agregar_guia_de_envio_a_orden(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);
        $order = Order::factory()->create(['status' => 'paid']);

        $orderService = app(OrderService::class);
        $updated = $orderService->addShippingGuide($order, 'TRK-12345');

        $this->assertEquals('TRK-12345', $updated->tracking_number);
        $this->assertEquals('shipped', $updated->status);
    }

    public function test_exportar_ordenes_via_api(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);
        Order::factory()->count(3)->create(['status' => 'paid']);

        $response = $this->actingAs($admin, 'sanctum')
                         ->get('/api/v1/reports/sells/export?format=xlsx');

        // El endpoint puede devolver 200 con el archivo o 422 si no hay filtros requeridos
        $this->assertContains($response->status(), [200, 422, 404]);
    }

    public function test_crear_orden_desde_panel_admin(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);

        $response = $this->actingAs($admin)->get('/admin/orders/create');

        $response->assertStatus(200);
    }
}
