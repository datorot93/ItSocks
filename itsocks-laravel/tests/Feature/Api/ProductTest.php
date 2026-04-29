<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Design;
use App\Models\Product;
use App\Models\Subcategory;
use App\Models\Tag;
use App\Models\Type;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_lista_productos_paginada(): void
    {
        Product::factory()->count(25)->create();

        $response = $this->getJson('/api/v1/products?per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [['id', 'name', 'price', 'compresion']],
                'links' => ['first', 'last', 'next', 'prev'],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJsonCount(10, 'data');
    }

    public function test_lista_productos_paginacion_por_defecto_20(): void
    {
        Product::factory()->count(25)->create();

        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200)
            ->assertJsonCount(20, 'data');
    }

    public function test_filtrar_por_compresion(): void
    {
        Product::factory()->count(3)->create(['compresion' => true]);
        Product::factory()->count(2)->create(['compresion' => false]);

        $response = $this->getJson('/api/v1/products?filter[compresion]=1');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_filtrar_por_subcategoria(): void
    {
        $category = Category::factory()->create();
        $subcategory = Subcategory::factory()->create([
            'name' => 'pantorrilleras',
            'id_category' => $category->id,
        ]);
        Product::factory()->count(3)->create(['id_subcategory' => $subcategory->id]);
        Product::factory()->count(2)->create();

        $response = $this->getJson('/api/v1/products?filter[subcategory]=pantorrilleras');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_filtrar_por_busqueda(): void
    {
        Product::factory()->create(['name' => 'Media Flash Larga Especial']);
        Product::factory()->count(3)->create(['name' => 'Calcetín Normal']);

        $response = $this->getJson('/api/v1/products?filter[search]=Flash');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_obtener_producto_por_id(): void
    {
        $product = Product::factory()->create();

        $response = $this->getJson("/api/v1/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $product->id)
            ->assertJsonPath('data.name', $product->name);
    }

    public function test_producto_no_existente_retorna_404(): void
    {
        $response = $this->getJson('/api/v1/products/99999');
        $response->assertStatus(404);
    }

    public function test_crear_producto_requiere_autenticacion(): void
    {
        $response = $this->postJson('/api/v1/products', ['name' => 'Test']);
        $response->assertStatus(401);
    }

    public function test_crear_producto_como_admin(): void
    {
        $design = Design::factory()->create();
        $type = Type::factory()->create();
        $category = Category::factory()->create();
        $subcategory = Subcategory::factory()->create(['id_category' => $category->id]);

        $response = $this->asAdmin()->postJson('/api/v1/products', [
            'name' => 'Media Test Flash Larga',
            'price' => 45000,
            'compresion' => false,
            'design_id' => $design->id,
            'type_id' => $type->id,
            'subcategory_id' => $subcategory->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Media Test Flash Larga');
    }

    public function test_actualizar_producto_como_admin(): void
    {
        $product = Product::factory()->create(['price' => 40000]);

        $response = $this->asAdmin()->putJson("/api/v1/products/{$product->id}", [
            'price' => 50000,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(50000, (int) $response->json('data.price'));
    }

    public function test_eliminar_producto_como_admin(): void
    {
        $product = Product::factory()->create();

        $response = $this->asAdmin()->deleteJson("/api/v1/products/{$product->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('product', ['id' => $product->id]);
    }

    public function test_includes_funcionan(): void
    {
        $product = Product::factory()->create();

        $response = $this->getJson("/api/v1/products/{$product->id}?include=design,type,subcategory");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'design', 'type', 'subcategory'],
            ]);
    }
}
