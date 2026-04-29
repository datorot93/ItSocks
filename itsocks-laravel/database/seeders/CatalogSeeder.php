<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Color;
use App\Models\Design;
use App\Models\Size;
use App\Models\Subcategory;
use App\Models\Tag;
use App\Models\Type;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        // Categorías principales
        $medias = Category::create(['name' => 'Medias', 'slug' => 'medias', 'discount' => 0]);
        $accesorios = Category::create(['name' => 'Accesorios', 'slug' => 'accesorios', 'discount' => 0]);
        $temporada = Category::create(['name' => 'Temporada', 'slug' => 'temporada', 'discount' => 0]);

        // Subcategorías de Medias
        $estampadas = Subcategory::create([
            'id_category' => $medias->id,
            'code' => 'EST',
            'name' => 'Estampadas',
            'priority' => 1,
        ]);
        $tejidas = Subcategory::create([
            'id_category' => $medias->id,
            'code' => 'TEJ',
            'name' => 'Tejidas',
            'priority' => 2,
        ]);
        $personalizadas = Subcategory::create([
            'id_category' => $medias->id,
            'code' => 'PER',
            'name' => 'Personalizadas',
            'priority' => 3,
        ]);

        // Subcategorías de Accesorios
        $termos = Subcategory::create([
            'id_category' => $accesorios->id,
            'code' => 'TER',
            'name' => 'Termos',
            'priority' => 1,
        ]);
        $pines = Subcategory::create([
            'id_category' => $accesorios->id,
            'code' => 'PIN',
            'name' => 'Pines',
            'priority' => 2,
        ]);

        // Subcategorías de Temporada
        $navidad = Subcategory::create([
            'id_category' => $temporada->id,
            'code' => 'NAV',
            'name' => 'Navidad',
            'priority' => 1,
        ]);

        // Tipos de media
        Type::create(['name' => 'Largas', 'code' => 'LAR', 'priority' => 1]);
        Type::create(['name' => 'Pantorrilleras', 'code' => 'PAN', 'priority' => 2]);
        Type::create(['name' => 'Cortas', 'code' => 'COR', 'priority' => 3]);

        // Diseños
        Design::create(['name' => 'Flash', 'code' => 'FLA']);
        Design::create(['name' => 'Venom', 'code' => 'VEN']);
        Design::create(['name' => 'One Piece', 'code' => 'ONE']);
        Design::create(['name' => 'Ansiedad', 'code' => 'ANS']);
        Design::create(['name' => 'Minion', 'code' => 'MIN']);

        // Colores
        Color::create(['name' => 'Negro', 'code' => '#000000']);
        Color::create(['name' => 'Blanco', 'code' => '#FFFFFF']);
        Color::create(['name' => 'Gris', 'code' => '#808080']);
        Color::create(['name' => 'Rojo', 'code' => '#FF0000']);
        Color::create(['name' => 'Azul', 'code' => '#0000FF']);
        Color::create(['name' => 'Verde', 'code' => '#008000']);
        Color::create(['name' => 'Morado', 'code' => '#800080']);
        Color::create(['name' => 'Naranja', 'code' => '#FFA500']);

        // Tallas
        Size::create(['size' => 'Única', 'description' => 'Talla única']);
        Size::create(['size' => 'Dama (35-38)', 'description' => 'Talla para dama, numeración 35 a 38']);
        Size::create(['size' => 'Caballero (39-42)', 'description' => 'Talla para caballero, numeración 39 a 42']);
        Size::create(['size' => 'Junior (27-33)', 'description' => 'Talla junior, numeración 27 a 33']);
        Size::create(['size' => 'Infantil (21-27)', 'description' => 'Talla infantil, numeración 21 a 27']);

        // Tags
        Tag::create(['name' => 'ciclismo', 'image_url' => 'https://placehold.co/100x100.webp?text=Ciclismo']);
        Tag::create(['name' => 'running', 'image_url' => 'https://placehold.co/100x100.webp?text=Running']);
        Tag::create(['name' => 'trabajo', 'image_url' => 'https://placehold.co/100x100.webp?text=Trabajo']);
        Tag::create(['name' => 'casual', 'image_url' => 'https://placehold.co/100x100.webp?text=Casual']);
        Tag::create(['name' => 'fitness', 'image_url' => 'https://placehold.co/100x100.webp?text=Fitness']);
    }
}
