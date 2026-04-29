<?php

namespace Database\Factories;

use App\Models\Shipping;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShippingFactory extends Factory
{
    protected $model = Shipping::class;

    public function definition(): array
    {
        $cities = [
            ['municipio' => 'Bogotá', 'departamento' => 'Bogotá D.C.', 'tarifa' => 0],
            ['municipio' => 'Medellín', 'departamento' => 'Antioquia', 'tarifa' => 8000],
            ['municipio' => 'Cali', 'departamento' => 'Valle del Cauca', 'tarifa' => 8000],
            ['municipio' => 'Barranquilla', 'departamento' => 'Atlántico', 'tarifa' => 10000],
            ['municipio' => 'Bucaramanga', 'departamento' => 'Santander', 'tarifa' => 12000],
        ];

        $city = fake()->randomElement($cities);

        return [
            'municipio_ciudad' => $city['municipio'] . '_' . fake()->unique()->numberBetween(1, 9999),
            'departamento' => $city['departamento'],
            'tarifa' => $city['tarifa'],
        ];
    }
}
