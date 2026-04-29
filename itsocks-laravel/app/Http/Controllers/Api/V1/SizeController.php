<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SizeResource;
use App\Services\ProductCatalogService;
use Illuminate\Http\JsonResponse;

class SizeController extends Controller
{
    public function __construct(private ProductCatalogService $catalogService) {}

    public function index(): JsonResponse
    {
        $sizes = $this->catalogService->getSizes();
        return response()->json(['data' => SizeResource::collection($sizes)]);
    }
}
