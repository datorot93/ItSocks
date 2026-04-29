<?php

namespace Tests\Feature\Api;

use App\Models\Pack;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PackTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_listar_packs_es_publico(): void
    {
        Pack::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/packs');

        $response->assertStatus(200);
    }

    public function test_obtener_pack_por_id(): void
    {
        $pack = Pack::factory()->create();

        $response = $this->getJson("/api/v1/packs/{$pack->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $pack->id);
    }

    public function test_pack_no_existente_retorna_404(): void
    {
        $response = $this->getJson('/api/v1/packs/99999');
        $response->assertStatus(404);
    }

    public function test_crear_pack_requiere_autenticacion(): void
    {
        $response = $this->postJson('/api/v1/packs', ['name' => 'Test']);
        $response->assertStatus(401);
    }

    public function test_actualizar_pack_como_admin(): void
    {
        $pack = Pack::factory()->create(['price' => 100000]);

        $response = $this->asAdmin()->putJson("/api/v1/packs/{$pack->id}", [
            'price' => 120000,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(120000, (int) $response->json('data.price'));
    }

    public function test_eliminar_pack_como_admin(): void
    {
        $pack = Pack::factory()->create();

        $response = $this->asAdmin()->deleteJson("/api/v1/packs/{$pack->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('pack', ['id' => $pack->id]);
    }
}
