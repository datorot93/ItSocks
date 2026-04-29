<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductOrderFactory extends Factory
{
    protected $model = ProductOrder::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'order_id' => Order::factory(),
            'quantity' => fake()->numberBetween(1, 5),
            'size' => fake()->randomElement(['Única', 'Dama (35-38)', 'Caballero (39-42)']),
            'price_paid' => fake()->numberBetween(12000, 50000),
            'discount' => 0,
            'num_in_order' => 1,
        ];
    }
}
