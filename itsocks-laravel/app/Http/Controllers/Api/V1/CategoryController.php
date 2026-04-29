<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\ProductCatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private ProductCatalogService $catalogService) {}

    public function index(): JsonResponse
    {
        $categories = $this->catalogService->getCategories();
        return response()->json(['data' => CategoryResource::collection($categories)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'discount' => 'nullable|integer|min:0|max:100',
        ]);

        $category = Category::create($data);
        $this->catalogService->clearCache();

        return response()->json(['data' => new CategoryResource($category)], 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'discount' => 'nullable|integer|min:0|max:100',
        ]);

        $category->update($data);
        $this->catalogService->clearCache();

        return response()->json(['data' => new CategoryResource($category->fresh())]);
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();
        $this->catalogService->clearCache();

        return response()->json(['message' => 'Categoría eliminada.']);
    }
}
