<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Este seeder es la única fuente de datos de prueba para F1, F2, F4 y F6.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,          // Admin user (admin@itsocks.co)
            CatalogSeeder::class,       // Categorías, subcategorías, tipos, diseños, colores, tallas, tags
            ProductSeeder::class,       // 20 productos con relaciones e imágenes placeholder
            ShippingSeeder::class,      // Municipios colombianos con tarifas
            PackSeeder::class,          // 3 packs de prueba
            DiscountCodeSeeder::class,  // 2 códigos de descuento
            SliderSeeder::class,        // 3 banners del homepage
            OrderSeeder::class,         // 3 órdenes en distintos estados
        ]);
    }
}
