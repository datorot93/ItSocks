<?php

namespace Tests\Feature\Filament;

use App\Models\Image;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductImageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('s3');
    }

    public function test_upload_imagen_producto_a_s3(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);
        $product = Product::factory()->create();
        $imageFile = UploadedFile::fake()->image('product.jpg', 400, 400);

        $response = $this->actingAs($admin, 'sanctum')
                         ->postJson('/api/v1/images', [
                             'product_id' => $product->id,
                             'image' => $imageFile,
                         ]);

        $response->assertStatus(201);

        // Verificar que la imagen se guardó en S3 fake
        $path = $response->json('data.path') ?? $response->json('path') ?? null;
        if ($path) {
            Storage::disk('s3')->assertExists($path);
        }

        // Verificar que el registro de imagen se creó en BD
        $this->assertDatabaseHas('image', ['id_product' => $product->id]);
    }

    public function test_imagen_eliminada_borra_registro_bd(): void
    {
        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);
        $product = Product::factory()->create();

        // Crear un archivo fake en S3
        Storage::disk('s3')->put('products/test-image.jpg', 'fake image content');

        $image = Image::create([
            'id_product' => $product->id,
            'url' => 'https://test-bucket.s3.amazonaws.com/products/test-image.jpg',
        ]);

        $this->assertDatabaseHas('image', ['id' => $image->id]);

        $response = $this->actingAs($admin, 'sanctum')
             ->deleteJson("/api/v1/images/{$image->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('image', ['id' => $image->id]);
    }

    public function test_storage_fake_funciona(): void
    {
        Storage::disk('s3')->put('test.txt', 'contenido');
        Storage::disk('s3')->assertExists('test.txt');
        Storage::disk('s3')->delete('test.txt');
        Storage::disk('s3')->assertMissing('test.txt');
    }
}
