<?php

namespace Database\Seeders;

use App\Models\Shipping;
use Illuminate\Database\Seeder;

class ShippingSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('data/shipping.json');

        if (file_exists($jsonPath)) {
            $data = json_decode(file_get_contents($jsonPath), true);
        } else {
            // Fallback hardcodeado para tests cuando no existe el archivo JSON
            $data = [
                ['municipio_ciudad' => 'Bogotá', 'departamento' => 'Bogotá D.C.', 'tarifa' => 0],
                ['municipio_ciudad' => 'Soacha', 'departamento' => 'Cundinamarca', 'tarifa' => 8000],
                ['municipio_ciudad' => 'Medellín', 'departamento' => 'Antioquia', 'tarifa' => 12000],
                ['municipio_ciudad' => 'Bello', 'departamento' => 'Antioquia', 'tarifa' => 12000],
                ['municipio_ciudad' => 'Envigado', 'departamento' => 'Antioquia', 'tarifa' => 12000],
                ['municipio_ciudad' => 'Cali', 'departamento' => 'Valle del Cauca', 'tarifa' => 12000],
                ['municipio_ciudad' => 'Palmira', 'departamento' => 'Valle del Cauca', 'tarifa' => 12000],
                ['municipio_ciudad' => 'Barranquilla', 'departamento' => 'Atlántico', 'tarifa' => 12000],
                ['municipio_ciudad' => 'Bucaramanga', 'departamento' => 'Santander', 'tarifa' => 12000],
            ];
        }

        foreach ($data as $row) {
            Shipping::updateOrCreate(
                [
                    'municipio_ciudad' => $row['municipio_ciudad'],
                    'departamento' => $row['departamento'],
                ],
                ['tarifa' => $row['tarifa']]
            );
        }
    }
}
