<?php

namespace Database\Seeders;

use App\Models\Slider;
use Illuminate\Database\Seeder;

class SliderSeeder extends Seeder
{
    public function run(): void
    {
        Slider::create([
            'url' => 'https://placehold.co/1200x400/1a1a2e/ffffff.webp?text=ItSocks+Banner+1',
            'link' => '/medias',
            'description' => 'Nuevas colecciones de medias estampadas',
            'alt' => 'Banner colección medias',
            'state' => true,
            'priority' => 1,
        ]);

        Slider::create([
            'url' => 'https://placehold.co/1200x400/2d1b69/ffffff.webp?text=ItSocks+Banner+2',
            'link' => '/packs',
            'description' => 'Packs con hasta 20% de descuento',
            'alt' => 'Banner packs descuento',
            'state' => true,
            'priority' => 2,
        ]);

        Slider::create([
            'url' => 'https://placehold.co/1200x400/1a1a2e/ffcc00.webp?text=ItSocks+Banner+3',
            'link' => '/personalizadas',
            'description' => 'Medias personalizadas con tu logo',
            'alt' => 'Banner medias personalizadas',
            'state' => true,
            'priority' => 3,
        ]);
    }
}
