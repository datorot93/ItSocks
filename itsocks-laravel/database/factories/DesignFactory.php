<?php

namespace Database\Factories;

use App\Models\Design;
use Illuminate\Database\Eloquent\Factories\Factory;

class DesignFactory extends Factory
{
    protected $model = Design::class;

    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'code' => strtoupper(fake()->lexify('???')),
            'discount' => 0,
        ];
    }
}
