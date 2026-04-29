<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubcategoryResource;
use App\Models\Subcategory;
use App\Services\ProductCatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    public function __construct(private ProductCatalogService $catalogService) {}

    public function index(Request $request): JsonResponse
    {
        $categoryId = $request->integer('category_id') ?: null;
        $subcategories = $this->catalogService->getSubcategories($categoryId);

        return response()->json(['data' => SubcategoryResource::collection($subcategories)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'discount' => 'nullable|integer|min:0|max:100',
            'image_url' => 'nullable|string|max:500',
            'priority' => 'nullable|integer|min:0',
            'category_id' => 'required|integer|exists:category,id',
        ]);

        if (isset($data['category_id'])) {
            $data['id_category'] = $data['category_id'];
            unset($data['category_id']);
        }

        $subcategory = Subcategory::create($data);
        $this->catalogService->clearCache();

        return response()->json(['data' => new SubcategoryResource($subcategory)], 201);
    }

    public function update(Request $request, Subcategory $subcategory): JsonResponse
    {
        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'discount' => 'nullable|integer|min:0|max:100',
            'image_url' => 'nullable|string|max:500',
            'priority' => 'nullable|integer|min:0',
        ]);

        $subcategory->update($data);
        $this->catalogService->clearCache();

        return response()->json(['data' => new SubcategoryResource($subcategory->fresh())]);
    }

    public function destroy(Subcategory $subcategory): JsonResponse
    {
        $subcategory->delete();
        $this->catalogService->clearCache();

        return response()->json(['message' => 'Subcategoría eliminada.']);
    }
}
