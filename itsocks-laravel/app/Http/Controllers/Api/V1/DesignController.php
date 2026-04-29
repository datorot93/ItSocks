<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DesignResource;
use App\Services\ProductCatalogService;
use Illuminate\Http\JsonResponse;

class DesignController extends Controller
{
    public function __construct(private ProductCatalogService $catalogService) {}

    public function index(): JsonResponse
    {
        $designs = $this->catalogService->getDesigns();
        return response()->json(['data' => DesignResource::collection($designs)]);
    }
}
