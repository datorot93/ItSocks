<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TypeResource;
use App\Models\Type;
use App\Services\ProductCatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TypeController extends Controller
{
    public function __construct(private ProductCatalogService $catalogService) {}

    public function index(Request $request): JsonResponse
    {
        $subcategoryId = $request->integer('subcategory_id') ?: null;
        $types = $this->catalogService->getTypes($subcategoryId);

        return response()->json(['data' => TypeResource::collection($types)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'discount' => 'nullable|integer|min:0|max:100',
            'image_url' => 'nullable|string|max:500',
            'priority' => 'nullable|integer|min:0',
        ]);

        $type = Type::create($data);
        $this->catalogService->clearCache();

        return response()->json(['data' => new TypeResource($type)], 201);
    }

    public function update(Request $request, Type $type): JsonResponse
    {
        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'discount' => 'nullable|integer|min:0|max:100',
            'image_url' => 'nullable|string|max:500',
            'priority' => 'nullable|integer|min:0',
        ]);

        $type->update($data);
        $this->catalogService->clearCache();

        return response()->json(['data' => new TypeResource($type->fresh())]);
    }

    public function destroy(Type $type): JsonResponse
    {
        $type->delete();
        $this->catalogService->clearCache();

        return response()->json(['message' => 'Tipo eliminado.']);
    }
}
