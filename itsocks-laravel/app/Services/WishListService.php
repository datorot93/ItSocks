<?php

namespace App\Services;

use App\Models\Product;
use App\Models\WishList;
use Illuminate\Support\Str;

class WishListService
{
    public function create(array $data = []): WishList
    {
        $token = Str::uuid()->toString();

        return WishList::create([
            'id_list' => $token,
            'url_list' => $token,
            'json_list' => json_encode([]),
        ]);
    }

    public function findByToken(string $token): ?WishList
    {
        return WishList::where('id_list', $token)
            ->orWhere('url_list', $token)
            ->first();
    }

    public function addProduct(WishList $wishList, int $productId): WishList
    {
        $product = Product::findOrFail($productId);

        if (! $wishList->products()->where('product.id', $productId)->exists()) {
            $wishList->products()->attach($productId);
        }

        return $wishList->load('products');
    }

    public function removeProduct(WishList $wishList, int $productId): WishList
    {
        $wishList->products()->detach($productId);
        return $wishList->load('products');
    }
}
