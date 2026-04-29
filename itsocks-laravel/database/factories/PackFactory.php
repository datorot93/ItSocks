<?php

namespace Database\Factories;

use App\Models\Pack;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackFactory extends Factory
{
    protected $model = Pack::class;

    public function definition(): array
    {
        return [
            'name' => 'Pack ' . fake()->words(2, true),
            'image_url' => 'https://via.placeholder.com/400',
            'product_quantity' => fake()->randomElement([2, 3, 4, 5]),
            'price' => fake()->numberBetween(80000, 250000),
            'discount' => 0,
            'state' => true,
            'description' => fake()->sentence(),
        ];
    }
}
