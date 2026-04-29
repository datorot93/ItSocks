<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_login_correcto_retorna_token(): void
    {
        $user = User::factory()->create(['password' => Hash::make('secret123')]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_login_incorrecto_retorna_401(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'noexiste@itsocks.co',
            'password' => 'wrong',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_con_contrasena_incorrecta_retorna_401(): void
    {
        $user = User::factory()->create(['password' => Hash::make('correcta')]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'incorrecta',
        ]);

        $response->assertStatus(401);
    }

    public function test_logout_invalida_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200);
    }

    public function test_me_retorna_usuario_autenticado(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('email', $user->email);
    }

    public function test_me_sin_token_retorna_401(): void
    {
        $response = $this->getJson('/api/v1/auth/me');
        $response->assertStatus(401);
    }

    public function test_endpoint_admin_sin_token_retorna_401(): void
    {
        $response = $this->getJson('/api/v1/orders');
        $response->assertStatus(401);
    }

    public function test_endpoint_admin_con_token_invalido_retorna_401(): void
    {
        $response = $this->withHeaders(['Authorization' => 'Bearer token_invalido'])
            ->getJson('/api/v1/orders');

        $response->assertStatus(401);
    }

    public function test_usuario_sin_rol_admin_no_puede_crear_productos(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/products', ['name' => 'Test']);

        $response->assertStatus(403);
    }

    public function test_usuario_admin_puede_acceder_a_orders(): void
    {
        $response = $this->asAdmin()
            ->getJson('/api/v1/orders');

        $response->assertStatus(200);
    }
}
