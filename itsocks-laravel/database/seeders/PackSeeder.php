<?php

namespace Database\Seeders;

use App\Models\Pack;
use Illuminate\Database\Seeder;

class PackSeeder extends Seeder
{
    public function run(): void
    {
        Pack::create([
            'name' => 'Pack 3 Medias',
            'image_url' => 'https://placehold.co/400x400/1a1a2e/ffffff.webp?text=Pack+3',
            'product_quantity' => 3,
            'price' => 45000,
            'discount' => 10,
            'state' => true,
            'description' => 'Lleva 3 medias de tu elección con un 10% de descuento.',
        ]);

        Pack::create([
            'name' => 'Pack 6 Medias',
            'image_url' => 'https://placehold.co/400x400/1a1a2e/ffffff.webp?text=Pack+6',
            'product_quantity' => 6,
            'price' => 84000,
            'discount' => 20,
            'state' => true,
            'description' => 'Lleva 6 medias de tu elección con un 20% de descuento.',
        ]);

        Pack::create([
            'name' => 'Pack Especial Surtido',
            'image_url' => 'https://placehold.co/400x400/1a1a2e/ffffff.webp?text=Pack+Especial',
            'product_quantity' => 4,
            'price' => 60000,
            'discount' => 15,
            'state' => true,
            'description' => 'Pack especial surtido con 4 medias seleccionadas por nuestros expertos.',
        ]);
    }
}
