<?php

namespace Database\Factories;

use App\Models\Slider;
use Illuminate\Database\Eloquent\Factories\Factory;

class SliderFactory extends Factory
{
    protected $model = Slider::class;

    public function definition(): array
    {
        return [
            'url' => 'https://via.placeholder.com/1200x400',
            'link' => fake()->url(),
            'description' => fake()->sentence(),
            'alt' => fake()->words(3, true),
            'state' => true,
            'priority' => fake()->numberBetween(1, 10),
        ];
    }
}
