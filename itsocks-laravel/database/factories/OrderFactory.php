<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $subtotal = fake()->numberBetween(15000, 300000);
        $shippingCost = fake()->randomElement([0, 8000, 12000]);
        $discountAmount = 0;

        return [
            'customer_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => '3' . fake()->numerify('########'),
            'shipping_city' => fake()->randomElement(['Bogotá', 'Medellín', 'Cali', 'Barranquilla']),
            'shipping_department' => fake()->randomElement(['Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Atlántico']),
            'shipping_address' => fake()->streetAddress(),
            'billing_address' => fake()->streetAddress(),   // CORREGIDO: era billing_addess
            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'discount_amount' => $discountAmount,
            'total' => $subtotal + $shippingCost - $discountAmount,
            'status' => fake()->randomElement(['pending', 'paid', 'shipped']),
            'paid_status' => 'Pendiente',
            'quantity' => fake()->numberBetween(1, 10),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn(array $attrs) => ['status' => 'pending']);
    }

    public function paid(): static
    {
        return $this->state(fn(array $attrs) => [
            'status' => 'paid',
            'payment_id' => 'MP-' . fake()->numerify('########'),  // CORREGIDO: era pyment_id
        ]);
    }

    public function shipped(): static
    {
        return $this->state(fn(array $attrs) => [
            'status' => 'shipped',
            'payment_id' => 'MP-' . fake()->numerify('########'),  // CORREGIDO: era pyment_id
            'tracking_number' => 'TRACK-' . fake()->numerify('########'),
        ]);
    }

    public function asGift(): static
    {
        return $this->state(fn(array $attrs) => [
            'is_gift' => true,
            'gift_from' => fake()->firstName(),   // CORREGIDO: era 'de'
            'gift_to' => fake()->firstName(),     // CORREGIDO: era 'para'
            'gift_message' => fake()->sentence(),
        ]);
    }
}
