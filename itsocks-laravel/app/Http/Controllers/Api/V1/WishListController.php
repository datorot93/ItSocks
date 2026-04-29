<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WishListResource;
use App\Models\WishList;
use App\Services\WishListService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishListController extends Controller
{
    public function __construct(private WishListService $wishListService) {}

    public function show(string $token): WishListResource|JsonResponse
    {
        $wishList = $this->wishListService->findByToken($token);

        if (! $wishList) {
            return response()->json(['message' => 'Lista no encontrada.'], 404);
        }

        $wishList->load('products.images');

        return new WishListResource($wishList);
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $wishList = $this->wishListService->create($request->all());
        $wishList->load('products');

        return (new WishListResource($wishList))->response()->setStatusCode(201);
    }

    public function addProduct(Request $request, WishList $wishList): WishListResource
    {
        $data = $request->validate([
            'product_id' => 'required|integer|exists:product,id',
        ]);

        $wishList = $this->wishListService->addProduct($wishList, $data['product_id']);

        return new WishListResource($wishList);
    }

    public function removeProduct(WishList $wishList, int $product): WishListResource
    {
        $wishList = $this->wishListService->removeProduct($wishList, $product);

        return new WishListResource($wishList);
    }
}
