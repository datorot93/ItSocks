<?php

namespace Tests\Feature\Api;

use App\Models\DiscountCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DiscountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_validar_codigo_descuento_valido(): void
    {
        DiscountCode::factory()->create([
            'code' => 'TEST10',
            'discount' => 10,
            'state' => true,
        ]);

        $response = $this->postJson('/api/v1/discount-codes/validate', ['code' => 'TEST10']);

        $response->assertStatus(200)
            ->assertJsonPath('valid', true)
            ->assertJsonPath('discount', 10);
    }

    public function test_codigo_inexistente_retorna_invalido(): void
    {
        $response = $this->postJson('/api/v1/discount-codes/validate', ['code' => 'NOEXISTE']);

        $response->assertStatus(200)
            ->assertJsonPath('valid', false);
    }

    public function test_codigo_inactivo_retorna_invalido(): void
    {
        DiscountCode::factory()->create([
            'code' => 'INACTIVO',
            'discount' => 10,
            'state' => false,
        ]);

        $response = $this->postJson('/api/v1/discount-codes/validate', ['code' => 'INACTIVO']);

        $response->assertStatus(200)
            ->assertJsonPath('valid', false);
    }

    public function test_codigo_expirado_retorna_invalido(): void
    {
        DiscountCode::factory()->create([
            'code' => 'EXPIRADO',
            'discount' => 10,
            'state' => true,
            'expiration_date' => now()->subDay(),
        ]);

        $response = $this->postJson('/api/v1/discount-codes/validate', ['code' => 'EXPIRADO']);

        $response->assertStatus(200)
            ->assertJsonPath('valid', false);
    }

    public function test_listar_codigos_es_publico(): void
    {
        DiscountCode::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/discount-codes');

        $response->assertStatus(200);
    }

    public function test_crear_codigo_requiere_autenticacion(): void
    {
        $response = $this->postJson('/api/v1/discount-codes', [
            'code' => 'TEST',
            'discount' => 10,
        ]);

        $response->assertStatus(401);
    }

    public function test_crear_codigo_como_admin(): void
    {
        $response = $this->asAdmin()->postJson('/api/v1/discount-codes', [
            'code' => 'NUEVO20',
            'discount' => 20,
            'state' => true,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.code', 'NUEVO20');
    }

    public function test_validacion_code_requerido(): void
    {
        $response = $this->postJson('/api/v1/discount-codes/validate', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_eliminar_codigo_como_admin(): void
    {
        $code = DiscountCode::factory()->create(['code' => 'BORRAR']);

        $response = $this->asAdmin()->deleteJson("/api/v1/discount-codes/{$code->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('discount_code', ['id' => $code->id]);
    }
}
