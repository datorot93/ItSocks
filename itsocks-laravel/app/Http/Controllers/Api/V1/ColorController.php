<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ColorResource;
use App\Services\ProductCatalogService;
use Illuminate\Http\JsonResponse;

class ColorController extends Controller
{
    public function __construct(private ProductCatalogService $catalogService) {}

    public function index(): JsonResponse
    {
        $colors = $this->catalogService->getColors();
        return response()->json(['data' => ColorResource::collection($colors)]);
    }
}
