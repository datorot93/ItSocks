<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    /**
     * Lista paginada de productos con filtros dinámicos.
     * Consolida los 25+ endpoints de FastAPI en uno solo.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::exact('compresion'),
                AllowedFilter::exact('state'),
                AllowedFilter::exact('season'),
                AllowedFilter::exact('id_type', 'type_id'),
                AllowedFilter::exact('id_design', 'design_id'),
                AllowedFilter::exact('id_subcategory', 'subcategory_id'),
                AllowedFilter::scope('category'),
                AllowedFilter::scope('subcategory'),
                AllowedFilter::scope('tag'),
                AllowedFilter::scope('byCategory', 'by_category'),
                AllowedFilter::scope('bySubcategory', 'by_subcategory'),
                AllowedFilter::scope('byTag', 'by_tag'),
                AllowedFilter::callback('search', function ($query, $value) {
                    $op = config('database.default') === 'pgsql' ? 'ilike' : 'like';
                    $query->where(function ($q) use ($value, $op) {
                        $q->where('name', $op, "%{$value}%")
                            ->orWhere('description', $op, "%{$value}%")
                            ->orWhere('code', $op, "%{$value}%");
                    });
                }),
            ])
            ->allowedIncludes(['images', 'sizes', 'colors', 'design', 'type', 'subcategory', 'tags'])
            ->allowedSorts(['price', 'name', 'created_at', '-price', '-name', '-created_at'])
            ->defaultSort('-created_at')
            ->paginate($request->integer('per_page', 20));

        return ProductResource::collection($products);
    }

    public function show(Product $product): ProductResource
    {
        $product->load(['images', 'sizes', 'colors', 'design', 'type', 'subcategory', 'tags']);
        return new ProductResource($product);
    }

    public function showBySlug(string $slug): ProductResource
    {
        $product = Product::where('slug', $slug)
            ->with(['images', 'sizes', 'colors', 'design', 'type', 'subcategory', 'tags'])
            ->firstOrFail();
        return new ProductResource($product);
    }

    public function store(CreateProductRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Mapear nombres de campo del request al modelo
        if (isset($data['design_id'])) {
            $data['id_design'] = $data['design_id'];
            unset($data['design_id']);
        }
        if (isset($data['type_id'])) {
            $data['id_type'] = $data['type_id'];
            unset($data['type_id']);
        }
        if (isset($data['subcategory_id'])) {
            $data['id_subcategory'] = $data['subcategory_id'];
            unset($data['subcategory_id']);
        }

        $product = Product::create($data);

        return response()->json(['data' => new ProductResource($product)], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'compresion' => 'nullable|boolean',
            'state' => 'nullable|boolean',
            'season' => 'nullable|boolean',
            'discount' => 'nullable|integer|min:0|max:100',
            'quantity' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'design_id' => 'nullable|integer|exists:design,id',
            'type_id' => 'nullable|integer|exists:type,id',
            'subcategory_id' => 'nullable|integer|exists:subcategory,id',
        ]);

        if (isset($data['design_id'])) {
            $data['id_design'] = $data['design_id'];
            unset($data['design_id']);
        }
        if (isset($data['type_id'])) {
            $data['id_type'] = $data['type_id'];
            unset($data['type_id']);
        }
        if (isset($data['subcategory_id'])) {
            $data['id_subcategory'] = $data['subcategory_id'];
            unset($data['subcategory_id']);
        }

        $product->update($data);

        return response()->json(['data' => new ProductResource($product->fresh())]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();
        return response()->json(['message' => 'Producto eliminado.']);
    }
}
