<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Storage;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Usar disco local en todos los tests — nunca S3 real
        config(['filesystems.default' => 'local']);
        Storage::fake('local');
        Storage::fake('s3'); // intercepta llamadas a S3 sin hacer requests reales
    }

    /**
     * Autentica como usuario administrador para tests de endpoints admin.
     */
    protected function asAdmin(): static
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        return $this->actingAs($admin, 'sanctum');
    }

    /**
     * Autentica como usuario regular (sin rol admin).
     */
    protected function asUser(): static
    {
        $user = User::factory()->create();
        return $this->actingAs($user, 'sanctum');
    }
}
