<?php

namespace Tests\Feature\Api;

use App\Models\Product;
use App\Models\WishList;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class WishListTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_crear_wishlist(): void
    {
        $response = $this->postJson('/api/v1/wishlists');

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'id_list', 'url_list'],
            ]);
    }

    public function test_obtener_wishlist_por_token(): void
    {
        $wishList = WishList::factory()->create(['id_list' => 'mi-token-unico']);

        $response = $this->getJson('/api/v1/wishlists/mi-token-unico');

        $response->assertStatus(200)
            ->assertJsonPath('data.id_list', 'mi-token-unico');
    }

    public function test_token_no_existente_retorna_404(): void
    {
        $response = $this->getJson('/api/v1/wishlists/token-inexistente');
        $response->assertStatus(404);
    }

    public function test_agregar_producto_a_wishlist(): void
    {
        $wishList = WishList::factory()->create();
        $product = Product::factory()->create();

        $response = $this->postJson("/api/v1/wishlists/{$wishList->id}/products", [
            'product_id' => $product->id,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('wish_list_product', [
            'wish_list_id' => $wishList->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_eliminar_producto_de_wishlist(): void
    {
        $wishList = WishList::factory()->create();
        $product = Product::factory()->create();
        $wishList->products()->attach($product->id);

        $response = $this->deleteJson("/api/v1/wishlists/{$wishList->id}/products/{$product->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('wish_list_product', [
            'wish_list_id' => $wishList->id,
            'product_id' => $product->id,
        ]);
    }
}
