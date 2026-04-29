<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubcategoryFactory extends Factory
{
    protected $model = Subcategory::class;

    public function definition(): array
    {
        return [
            'id_category' => Category::factory(),
            'code' => strtoupper(fake()->lexify('???')),
            'name' => fake()->word(),
            'discount' => 0,
            'priority' => fake()->numberBetween(1, 10),
        ];
    }
}
