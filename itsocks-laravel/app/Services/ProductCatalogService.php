<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Color;
use App\Models\Design;
use App\Models\Size;
use App\Models\Subcategory;
use App\Models\Tag;
use App\Models\Type;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class ProductCatalogService
{
    public function getCategories(): Collection
    {
        return Cache::remember('categories', 600, fn () => Category::orderBy('name')->get());
    }

    public function getSubcategories(?int $categoryId = null): Collection
    {
        $cacheKey = 'subcategories' . ($categoryId ? "_cat_{$categoryId}" : '');

        return Cache::remember($cacheKey, 600, function () use ($categoryId) {
            $query = Subcategory::with('category')->orderBy('name');
            if ($categoryId) {
                $query->where('id_category', $categoryId);
            }
            return $query->get();
        });
    }

    public function getTypes(?int $subcategoryId = null): Collection
    {
        $cacheKey = 'types' . ($subcategoryId ? "_sub_{$subcategoryId}" : '');

        return Cache::remember($cacheKey, 600, function () use ($subcategoryId) {
            $query = Type::orderBy('name');
            if ($subcategoryId) {
                $query->where('id_subcategory', $subcategoryId);
            }
            return $query->get();
        });
    }

    public function getDesigns(): Collection
    {
        return Cache::remember('designs', 600, fn () => Design::orderBy('name')->get());
    }

    public function getTags(): Collection
    {
        return Cache::remember('tags', 600, fn () => Tag::orderBy('name')->get());
    }

    public function getColors(): Collection
    {
        return Cache::remember('colors', 600, fn () => Color::orderBy('name')->get());
    }

    public function getSizes(): Collection
    {
        return Cache::remember('sizes', 600, fn () => Size::orderBy('size')->get());
    }

    public function clearCache(): void
    {
        foreach (['categories', 'subcategories', 'types', 'designs', 'tags', 'colors', 'sizes'] as $key) {
            Cache::forget($key);
        }
    }
}
