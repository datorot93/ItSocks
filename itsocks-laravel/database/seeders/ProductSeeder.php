<?php

namespace Database\Seeders;

use App\Models\Color;
use App\Models\Design;
use App\Models\Image;
use App\Models\Product;
use App\Models\Size;
use App\Models\Subcategory;
use App\Models\Tag;
use App\Models\Type;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $subcatEstampadas = Subcategory::where('code', 'EST')->first();
        $subcatTejidas = Subcategory::where('code', 'TEJ')->first();
        $subcatPersonalizadas = Subcategory::where('code', 'PER')->first();
        $subcatPines = Subcategory::where('code', 'PIN')->first();
        $subcatNavidad = Subcategory::where('code', 'NAV')->first();

        $typeLargas = Type::where('code', 'LAR')->first();
        $typePantorrilleras = Type::where('code', 'PAN')->first();
        $typeCortas = Type::where('code', 'COR')->first();

        $designs = Design::all()->keyBy('code');

        $colorNegro = Color::where('name', 'Negro')->first();
        $colorBlanco = Color::where('name', 'Blanco')->first();
        $colorGris = Color::where('name', 'Gris')->first();
        $colorRojo = Color::where('name', 'Rojo')->first();
        $colorAzul = Color::where('name', 'Azul')->first();
        $colorVerde = Color::where('name', 'Verde')->first();

        $sizeUnica = Size::where('size', 'Única')->first();
        $sizeDama = Size::where('size', 'like', '%35-38%')->first();
        $sizeCaballero = Size::where('size', 'like', '%39-42%')->first();
        $sizeJunior = Size::where('size', 'like', '%27-33%')->first();

        $tagCiclismo = Tag::where('name', 'ciclismo')->first();
        $tagRunning = Tag::where('name', 'running')->first();
        $tagTrabajo = Tag::where('name', 'trabajo')->first();
        $tagCasual = Tag::where('name', 'casual')->first();
        $tagFitness = Tag::where('name', 'fitness')->first();

        $productsData = [
            // 15 medias estampadas
            [
                'name' => 'Media Flash Larga',
                'subcategory' => $subcatEstampadas,
                'type' => $typeLargas,
                'design' => $designs['FLA'] ?? null,
                'price' => 18000,
                'colors' => [$colorNegro, $colorRojo],
                'sizes' => [$sizeDama, $sizeCaballero],
                'tags' => [$tagCasual],
                'description' => 'Media larga con diseño Flash, perfecta para el día a día.',
            ],
            [
                'name' => 'Media Venom Pantorrillera',
                'subcategory' => $subcatEstampadas,
                'type' => $typePantorrilleras,
                'design' => $designs['VEN'] ?? null,
                'price' => 16000,
                'colors' => [$colorNegro, $colorBlanco],
                'sizes' => [$sizeDama, $sizeCaballero],
                'tags' => [$tagCasual, $tagRunning],
                'description' => 'Media pantorrillera con estampado Venom.',
            ],
            [
                'name' => 'Media One Piece Corta',
                'subcategory' => $subcatEstampadas,
                'type' => $typeCortas,
                'design' => $designs['ONE'] ?? null,
                'price' => 14000,
                'colors' => [$colorNegro, $colorAzul],
                'sizes' => [$sizeUnica],
                'tags' => [$tagCasual],
                'description' => 'Media corta con estampado One Piece.',
            ],
            [
                'name' => 'Media Ansiedad Larga',
                'subcategory' => $subcatEstampadas,
                'type' => $typeLargas,
                'design' => $designs['ANS'] ?? null,
                'price' => 18000,
                'colors' => [$colorGris, $colorNegro],
                'sizes' => [$sizeDama, $sizeCaballero],
                'tags' => [$tagTrabajo],
                'description' => 'Media larga con diseño Ansiedad.',
            ],
            [
                'name' => 'Media Minion Pantorrillera',
                'subcategory' => $subcatEstampadas,
                'type' => $typePantorrilleras,
                'design' => $designs['MIN'] ?? null,
                'price' => 16000,
                'colors' => [$colorAzul, $colorVerde],
                'sizes' => [$sizeDama, $sizeCaballero],
                'tags' => [$tagCasual],
                'description' => 'Media pantorrillera con estampado Minion.',
            ],
            [
                'name' => 'Media Flash Corta',
                'subcategory' => $subcatEstampadas,
                'type' => $typeCortas,
                'design' => $designs['FLA'] ?? null,
                'price' => 14000,
                'colors' => [$colorRojo, $colorNegro],
                'sizes' => [$sizeUnica],
                'tags' => [$tagRunning, $tagFitness],
                'description' => 'Media corta con diseño Flash, ideal para deporte.',
            ],
            [
                'name' => 'Media Venom Larga',
                'subcategory' => $subcatEstampadas,
                'type' => $typeLargas,
                'design' => $designs['VEN'] ?? null,
                'price' => 18000,
                'colors' => [$colorNegro],
                'sizes' => [$sizeDama, $sizeCaballero],
                'tags' => [$tagCasual],
                'description' => 'Media larga con estampado Venom.',
            ],
            [
                'name' => 'Media One Piece Larga',
                'subcategory' => $subcatEstampadas,
                'type' => $typeLargas,
                'design' => $designs['ONE'] ?? null,
                'price' => 18000,
                'colors' => [$colorNegro, $colorBlanco],
                'sizes' => [$sizeDama, $sizeCaballero],
                'tags' => [$tagCasual],
                'description' => 'Media larga con estampado One Piece.',
            ],
            [
                'name' => 'Media Ciclismo Pantorrillera',
                'subcategory' => $subcatEstampadas,
                'type' => $typePantorrilleras,
                'design' => $designs['ANS'] ?? null,
                'price' => 22000,
                'colors' => [$colorNegro, $colorAzul],
                'sizes' => [$sizeUnica],
                'tags' => [$tagCiclismo],
                'description' => 'Media pantorrillera para ciclismo.',
            ],
            [
                'name' => 'Media Running Flash',
                'subcategory' => $subcatEstampadas,
                'type' => $typeCortas,
                'design' => $designs['FLA'] ?? null,
                'price' => 16000,
                'compresion' => true,
                'colors' => [$colorNegro, $colorVerde],
                'sizes' => [$sizeDama, $sizeCaballero],
                'tags' => [$tagRunning, $tagFitness],
                'description' => 'Media de compresión para running con diseño Flash.',
            ],
            [
                'name' => 'Media Tejida Colorida',
                'subcategory' => $subcatTejidas,
                'type' => $typeLargas,
                'design' => null,
                'price' => 20000,
                'colors' => [$colorRojo, $colorAzul, $colorVerde],
                'sizes' => [$sizeUnica],
                'tags' => [$tagCasual],
                'description' => 'Media tejida con patrón colorido artesanal.',
            ],
            [
                'name' => 'Media Tejida Navidad',
                'subcategory' => $subcatTejidas,
                'type' => $typeLargas,
                'design' => null,
                'price' => 22000,
                'colors' => [$colorRojo, $colorBlanco],
                'sizes' => [$sizeUnica, $sizeDama, $sizeCaballero],
                'tags' => [$tagCasual],
                'description' => 'Media tejida con diseño navideño.',
            ],
            [
                'name' => 'Media Personalizada Logo',
                'subcategory' => $subcatPersonalizadas,
                'type' => $typeLargas,
                'design' => null,
                'price' => 35000,
                'colors' => [$colorNegro, $colorBlanco, $colorGris],
                'sizes' => [$sizeDama, $sizeCaballero],
                'tags' => [$tagTrabajo, $tagCasual],
                'description' => 'Media personalizada con logo empresarial.',
            ],
            [
                'name' => 'Media Minion Corta Junior',
                'subcategory' => $subcatEstampadas,
                'type' => $typeCortas,
                'design' => $designs['MIN'] ?? null,
                'price' => 12000,
                'colors' => [$colorAzul, $colorAmarilloPlaceholder ?? $colorVerde],
                'sizes' => [$sizeJunior],
                'tags' => [$tagCasual],
                'description' => 'Media corta junior con estampado Minion.',
            ],
            [
                'name' => 'Media Venom Corta',
                'subcategory' => $subcatEstampadas,
                'type' => $typeCortas,
                'design' => $designs['VEN'] ?? null,
                'price' => 14000,
                'colors' => [$colorNegro],
                'sizes' => [$sizeUnica],
                'tags' => [$tagCasual],
                'description' => 'Media corta con estampado Venom.',
            ],
            // 3 accesorios
            [
                'name' => 'Pin ItSocks Clásico',
                'subcategory' => $subcatPines,
                'type' => null,
                'design' => null,
                'price' => 8000,
                'colors' => [$colorNegro, $colorBlanco],
                'sizes' => [$sizeUnica],
                'tags' => [$tagCasual],
                'description' => 'Pin metálico con logo ItSocks.',
            ],
            [
                'name' => 'Pin Flash',
                'subcategory' => $subcatPines,
                'type' => null,
                'design' => $designs['FLA'] ?? null,
                'price' => 8000,
                'colors' => [$colorRojo],
                'sizes' => [$sizeUnica],
                'tags' => [$tagCasual],
                'description' => 'Pin metálico con diseño Flash.',
            ],
            [
                'name' => 'Pin Venom',
                'subcategory' => $subcatPines,
                'type' => null,
                'design' => $designs['VEN'] ?? null,
                'price' => 8000,
                'colors' => [$colorNegro],
                'sizes' => [$sizeUnica],
                'tags' => [$tagCasual],
                'description' => 'Pin metálico con diseño Venom.',
            ],
            // 2 temporada
            [
                'name' => 'Media Navidad Santa',
                'subcategory' => $subcatNavidad,
                'type' => $typeLargas,
                'design' => null,
                'price' => 20000,
                'season' => true,
                'colors' => [$colorRojo, $colorBlanco],
                'sizes' => [$sizeUnica, $sizeDama, $sizeCaballero],
                'tags' => [$tagCasual],
                'description' => 'Media navideña con diseño de Santa Claus.',
            ],
            [
                'name' => 'Media Navidad Renos',
                'subcategory' => $subcatNavidad,
                'type' => $typeLargas,
                'design' => null,
                'price' => 20000,
                'season' => true,
                'colors' => [$colorRojo, $colorVerde],
                'sizes' => [$sizeUnica, $sizeDama, $sizeCaballero],
                'tags' => [$tagCasual],
                'description' => 'Media navideña con diseño de renos.',
            ],
        ];

        foreach ($productsData as $data) {
            $product = Product::create([
                'id_subcategory' => $data['subcategory']?->id,
                'id_type' => $data['type']?->id,
                'id_design' => $data['design']?->id,
                'name' => $data['name'],
                'price' => $data['price'],
                'state' => true,
                'compresion' => $data['compresion'] ?? false,
                'season' => $data['season'] ?? false,
                'quantity' => 100,
                'talla' => 'Única',
                'description' => $data['description'],
                'discount' => 0,
            ]);

            // Imágenes placeholder (no depende de S3)
            $imageUrl = 'https://placehold.co/400x400/1a1a2e/ffffff.webp?text=' . urlencode($product->name);
            Image::create(['id_product' => $product->id, 'url' => $imageUrl]);

            // Relaciones many-to-many
            if (!empty($data['colors'])) {
                $colorIds = array_filter(array_map(fn($c) => $c?->id, $data['colors']));
                $product->colors()->sync($colorIds);
            }

            if (!empty($data['sizes'])) {
                $sizeIds = array_filter(array_map(fn($s) => $s?->id, $data['sizes']));
                $product->sizes()->sync($sizeIds);
            }

            if (!empty($data['tags'])) {
                $tagIds = array_filter(array_map(fn($t) => $t?->id, $data['tags']));
                $product->tags()->sync($tagIds);
            }
        }
    }
}
