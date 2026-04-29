<?php

namespace Tests\Feature\Api;

use App\Models\Product;
use App\Models\Shipping;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class BulkTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_actualizar_precios_masivo(): void
    {
        $products = Product::factory()->count(3)->create(['price' => 40000]);

        $updates = $products->map(fn ($p) => ['id' => $p->id, 'price' => 50000])->toArray();

        $response = $this->asAdmin()->postJson('/api/v1/bulk/prices', [
            'updates' => $updates,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('updated_count', 3);

        foreach ($products as $product) {
            $this->assertDatabaseHas('product', ['id' => $product->id, 'price' => 50000]);
        }
    }

    public function test_actualizar_precios_requiere_autenticacion(): void
    {
        $response = $this->postJson('/api/v1/bulk/prices', ['updates' => []]);
        $response->assertStatus(401);
    }

    public function test_actualizar_tarifas_masivo(): void
    {
        $shippings = Shipping::factory()->count(2)->create(['tarifa' => 5000]);

        $updates = $shippings->map(fn ($s) => ['id' => $s->id, 'tarifa' => 10000])->toArray();

        $response = $this->asAdmin()->postJson('/api/v1/bulk/shipping-rates', [
            'updates' => $updates,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('updated_count', 2);

        foreach ($shippings as $shipping) {
            $this->assertDatabaseHas('shipping', ['id' => $shipping->id, 'tarifa' => 10000]);
        }
    }

    public function test_validacion_updates_requerido(): void
    {
        $response = $this->asAdmin()->postJson('/api/v1/bulk/prices', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['updates']);
    }
}
