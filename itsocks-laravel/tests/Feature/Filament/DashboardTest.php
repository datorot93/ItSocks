<?php

namespace Tests\Feature\Filament;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_panel_admin_accesible_por_usuario_itsocks(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertStatus(200);
    }

    public function test_dashboard_muestra_ventas_del_mes(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);

        Order::factory()->count(5)->create([
            'total' => 80000,
            'status' => 'paid',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertStatus(200)
                 ->assertSee('Ventas del mes');
    }

    public function test_dashboard_muestra_ordenes_pendientes(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);

        Order::factory()->count(3)->create([
            'status' => 'pending',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertStatus(200)
                 ->assertSee('Órdenes pendientes');
    }

    public function test_usuario_sin_acceso_no_puede_entrar_al_panel(): void
    {
        $user = User::factory()->create(['email' => 'cliente@gmail.com']);

        $response = $this->actingAs($user)->get('/admin');

        // Debe redirigir al login o mostrar 403
        $response->assertStatus(403);
    }

    public function test_usuarios_no_autenticados_son_redirigidos_al_login(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/admin/login');
    }

    public function test_reporte_ventas_page_accesible(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);

        $response = $this->actingAs($admin)->get('/admin/reporte-ventas');

        $response->assertStatus(200);
    }

    public function test_importar_productos_page_accesible(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);

        $response = $this->actingAs($admin)->get('/admin/importar-productos');

        $response->assertStatus(200);
    }

    public function test_recursos_principales_accesibles(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);

        $resources = [
            '/admin/orders',
            '/admin/products',
            '/admin/categories',
            '/admin/shippings',
            '/admin/discount-codes',
        ];

        foreach ($resources as $resource) {
            $response = $this->actingAs($admin)->get($resource);
            $response->assertStatus(200, "Recurso {$resource} no es accesible");
        }
    }
}
