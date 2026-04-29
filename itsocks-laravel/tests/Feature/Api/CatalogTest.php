<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Color;
use App\Models\Design;
use App\Models\Size;
use App\Models\Subcategory;
use App\Models\Tag;
use App\Models\Type;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_listar_categorias(): void
    {
        Category::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => [['id', 'name']]]);
    }

    public function test_listar_subcategorias(): void
    {
        $category = Category::factory()->create();
        Subcategory::factory()->count(3)->create(['id_category' => $category->id]);

        $response = $this->getJson('/api/v1/subcategories');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_filtrar_subcategorias_por_categoria(): void
    {
        $cat1 = Category::factory()->create();
        $cat2 = Category::factory()->create();
        Subcategory::factory()->count(2)->create(['id_category' => $cat1->id]);
        Subcategory::factory()->count(3)->create(['id_category' => $cat2->id]);

        $response = $this->getJson("/api/v1/subcategories?category_id={$cat1->id}");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_listar_tipos(): void
    {
        Type::factory()->count(4)->create();

        $response = $this->getJson('/api/v1/types');

        $response->assertStatus(200)
            ->assertJsonCount(4, 'data');
    }

    public function test_listar_designs(): void
    {
        Design::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/designs');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_listar_tags(): void
    {
        Tag::factory()->count(4)->create();

        $response = $this->getJson('/api/v1/tags');

        $response->assertStatus(200)
            ->assertJsonCount(4, 'data');
    }

    public function test_listar_colores(): void
    {
        Color::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/colors');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_listar_tallas(): void
    {
        Size::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/sizes');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_crear_categoria_como_admin(): void
    {
        $response = $this->asAdmin()->postJson('/api/v1/categories', [
            'name' => 'Medias Largas',
            'slug' => 'medias-largas',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Medias Largas');
    }

    public function test_crear_categoria_requiere_autenticacion(): void
    {
        $response = $this->postJson('/api/v1/categories', ['name' => 'Test']);
        $response->assertStatus(401);
    }

    public function test_eliminar_categoria_como_admin(): void
    {
        $category = Category::factory()->create();

        $response = $this->asAdmin()->deleteJson("/api/v1/categories/{$category->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('category', ['id' => $category->id]);
    }
}
