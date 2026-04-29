<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Color;
use App\Models\Design;
use App\Models\Order;
use App\Models\Product;
use App\Models\Size;
use App\Models\Subcategory;
use App\Models\Tag;
use App\Models\Type;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelsRelationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_belongs_to_subcategory(): void
    {
        $category = Category::factory()->create();
        $subcategory = Subcategory::factory()->create(['id_category' => $category->id]);
        $design = Design::factory()->create();
        $type = Type::factory()->create();

        $product = Product::create([
            'id_subcategory' => $subcategory->id,
            'id_design' => $design->id,
            'id_type' => $type->id,
            'name' => 'Test Product',
            'price' => 18000,
            'state' => true,
            'compresion' => false,
            'quantity' => 50,
            'talla' => 'Única',
            'description' => 'Descripción de prueba',
        ]);

        $this->assertInstanceOf(Subcategory::class, $product->subcategory);
        $this->assertEquals($subcategory->id, $product->subcategory->id);
    }

    public function test_product_has_many_to_many_colors(): void
    {
        $category = Category::factory()->create();
        $subcategory = Subcategory::factory()->create(['id_category' => $category->id]);
        $design = Design::factory()->create();
        $type = Type::factory()->create();

        $product = Product::create([
            'id_subcategory' => $subcategory->id,
            'id_design' => $design->id,
            'id_type' => $type->id,
            'name' => 'Test Product Colors',
            'price' => 18000,
            'state' => true,
            'compresion' => false,
            'quantity' => 50,
            'talla' => 'Única',
            'description' => 'Test',
        ]);

        $color1 = Color::create(['name' => 'Negro', 'code' => '#000000']);
        $color2 = Color::create(['name' => 'Blanco', 'code' => '#FFFFFF']);

        $product->colors()->sync([$color1->id, $color2->id]);

        $this->assertCount(2, $product->colors);
    }

    public function test_order_has_corrected_column_names(): void
    {
        // Verificar que los typos están corregidos en la migración
        $order = Order::create([
            'customer_name' => 'Test Cliente',
            'email' => 'test@test.com',
            'phone' => '3001234567',
            'shipping_city' => 'Bogotá',
            'shipping_department' => 'Bogotá D.C.',
            'shipping_address' => 'Calle 1 #2-3',
            'billing_address' => 'Calle 1 #2-3',     // CORREGIDO: era billing_addess
            'payment_id' => 'MP-TEST-123',             // CORREGIDO: era pyment_id
            'gift_from' => 'Juan',                     // CORREGIDO: era 'de'
            'gift_to' => 'María',                      // CORREGIDO: era 'para'
            'is_gift' => true,
            'subtotal' => 18000,
            'shipping_cost' => 0,
            'discount_amount' => 0,
            'total' => 18000,
            'status' => 'pending',
            'quantity' => 1,
        ]);

        $this->assertEquals('Calle 1 #2-3', $order->billing_address);
        $this->assertEquals('MP-TEST-123', $order->payment_id);
        $this->assertEquals('Juan', $order->gift_from);
        $this->assertEquals('María', $order->gift_to);
        $this->assertTrue($order->is_gift);
    }

    public function test_category_has_subcategories(): void
    {
        $category = Category::factory()->create();
        Subcategory::factory()->count(3)->create(['id_category' => $category->id]);

        $this->assertCount(3, $category->subcategories);
    }

    public function test_product_has_many_to_many_sizes(): void
    {
        $category = Category::factory()->create();
        $subcategory = Subcategory::factory()->create(['id_category' => $category->id]);
        $design = Design::factory()->create();
        $type = Type::factory()->create();

        $product = Product::create([
            'id_subcategory' => $subcategory->id,
            'id_design' => $design->id,
            'id_type' => $type->id,
            'name' => 'Test Product Sizes',
            'price' => 18000,
            'state' => true,
            'compresion' => false,
            'quantity' => 50,
            'talla' => 'Única',
            'description' => 'Test',
        ]);

        $size1 = Size::create(['size' => 'Dama (35-38)', 'description' => 'Talla dama']);
        $size2 = Size::create(['size' => 'Caballero (39-42)', 'description' => 'Talla caballero']);

        $product->sizes()->sync([$size1->id, $size2->id]);

        $this->assertCount(2, $product->sizes);
    }

    public function test_product_scopes(): void
    {
        $category = Category::factory()->create();
        $subcategory = Subcategory::factory()->create(['id_category' => $category->id]);
        $design = Design::factory()->create();
        $type = Type::factory()->create();

        Product::create([
            'id_subcategory' => $subcategory->id,
            'id_design' => $design->id,
            'id_type' => $type->id,
            'name' => 'Producto Activo',
            'price' => 18000,
            'state' => true,
            'compresion' => false,
            'quantity' => 50,
            'talla' => 'Única',
            'description' => 'Test',
        ]);

        Product::create([
            'id_subcategory' => $subcategory->id,
            'id_design' => $design->id,
            'id_type' => $type->id,
            'name' => 'Producto Inactivo',
            'price' => 18000,
            'state' => false,
            'compresion' => false,
            'quantity' => 50,
            'talla' => 'Única',
            'description' => 'Test',
        ]);

        $this->assertEquals(1, Product::active()->count());
    }
}
