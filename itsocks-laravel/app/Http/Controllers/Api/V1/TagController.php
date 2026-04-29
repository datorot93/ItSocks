<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Services\ProductCatalogService;
use Illuminate\Http\JsonResponse;

class TagController extends Controller
{
    public function __construct(private ProductCatalogService $catalogService) {}

    public function index(): JsonResponse
    {
        $tags = $this->catalogService->getTags();
        return response()->json(['data' => TagResource::collection($tags)]);
    }
}
