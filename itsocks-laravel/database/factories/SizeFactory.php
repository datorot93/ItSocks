<?php

namespace Database\Factories;

use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\Factory;

class SizeFactory extends Factory
{
    protected $model = Size::class;

    public function definition(): array
    {
        return [
            'size' => fake()->unique()->randomElement(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única', '36-40', '38-42']),
            'description' => null,
        ];
    }
}
