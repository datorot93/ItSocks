<?php

namespace Database\Factories;

use App\Models\Type;
use Illuminate\Database\Eloquent\Factories\Factory;

class TypeFactory extends Factory
{
    protected $model = Type::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Largas', 'Cortas', 'Pantorrilleras']),
            'code' => strtoupper(fake()->lexify('???')),
            'discount' => 0,
            'priority' => fake()->numberBetween(1, 10),
        ];
    }
}
