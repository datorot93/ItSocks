<?php

namespace Tests\Feature\Api;

use App\Models\Shipping;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ShippingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_listar_envios(): void
    {
        Shipping::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/shippings');

        $response->assertStatus(200);
    }

    public function test_obtener_envio_por_id(): void
    {
        $shipping = Shipping::factory()->create();

        $response = $this->getJson("/api/v1/shippings/{$shipping->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $shipping->id);
    }

    public function test_listar_municipios(): void
    {
        Shipping::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/shippings/municipios');

        $response->assertStatus(200);
    }

    public function test_listar_departamentos(): void
    {
        Shipping::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/shippings/departamentos');

        $response->assertStatus(200);
    }

    public function test_costo_envio_por_departamento_municipio(): void
    {
        Shipping::factory()->create([
            'municipio_ciudad' => 'Bogotá',
            'departamento' => 'Bogotá D.C.',
            'tarifa' => 0,
        ]);

        $response = $this->getJson('/api/v1/shippings/cost?departamento=Bogotá D.C.&municipio=Bogotá');

        $response->assertStatus(200)
            ->assertJsonPath('tarifa', 0);
    }

    public function test_costo_envio_sin_parametros_retorna_422(): void
    {
        $response = $this->getJson('/api/v1/shippings/cost');
        $response->assertStatus(422);
    }

    public function test_crear_envio_como_admin(): void
    {
        $response = $this->asAdmin()->postJson('/api/v1/shippings', [
            'municipio_ciudad' => 'Cali',
            'departamento' => 'Valle del Cauca',
            'tarifa' => 8000,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.municipio_ciudad', 'Cali');
    }

    public function test_crear_envio_duplicado_retorna_400(): void
    {
        Shipping::factory()->create(['municipio_ciudad' => 'Cali']);

        $response = $this->asAdmin()->postJson('/api/v1/shippings', [
            'municipio_ciudad' => 'Cali',
            'departamento' => 'Valle del Cauca',
            'tarifa' => 8000,
        ]);

        $response->assertStatus(400);
    }

    public function test_actualizar_envio_como_admin(): void
    {
        $shipping = Shipping::factory()->create(['tarifa' => 5000]);

        $response = $this->asAdmin()->putJson("/api/v1/shippings/{$shipping->id}", [
            'tarifa' => 10000,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.tarifa', 10000);
    }

    public function test_eliminar_envio_como_admin(): void
    {
        $shipping = Shipping::factory()->create();

        $response = $this->asAdmin()->deleteJson("/api/v1/shippings/{$shipping->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('shipping', ['id' => $shipping->id]);
    }
}
