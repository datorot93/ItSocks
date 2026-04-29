<?php

namespace Database\Factories;

use App\Models\Design;
use App\Models\Product;
use App\Models\Subcategory;
use App\Models\Type;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'price' => fake()->numberBetween(12000, 80000),
            'compresion' => fake()->boolean(20),
            'state' => true,
            'season' => false,
            'discount' => fake()->randomElement([0, 0, 0, 5, 10]),
            'quantity' => fake()->numberBetween(0, 200),
            'talla' => 'Única',
            'description' => fake()->paragraph(),
            'id_design' => Design::factory(),
            'id_type' => Type::factory(),
            'id_subcategory' => Subcategory::factory(),
        ];
    }
}
