<?php

namespace Database\Factories;

use App\Models\DiscountCode;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiscountCodeFactory extends Factory
{
    protected $model = DiscountCode::class;

    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('??##??')),
            'discount' => fake()->randomElement([5, 10, 15, 20, 25]),
            'discount_type' => 'percentage',
            'state' => true,
            'expiration_date' => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attrs) => ['state' => false]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attrs) => [
            'expiration_date' => now()->subDay(),
        ]);
    }
}
