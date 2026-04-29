<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PackResource;
use App\Models\Pack;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PackController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('limit', 100);
        $skip = $request->integer('skip', 0);

        $packs = Pack::skip($skip)->take($perPage)->get();
        $total = Pack::count();

        return response()->json(PackResource::collection($packs))
            ->header('Content-Range', "0-9/{$total}");
    }

    public function show(Pack $pack): PackResource
    {
        return new PackResource($pack);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'product_quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'file' => 'nullable|file|image|max:10240',
        ]);

        $imageUrl = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('packs', 's3');
            $imageUrl = Storage::disk('s3')->url($path);
        }

        // Verificar nombre duplicado
        if (Pack::where('name', $request->name)->exists()) {
            return response()->json(['message' => 'El pack que está intentando crear ya existe'], 400);
        }

        $pack = Pack::create([
            'name' => $request->name,
            'image_url' => $imageUrl,
            'product_quantity' => $request->integer('product_quantity'),
            'price' => $request->float('price'),
            'description' => $request->input('description'),
            'state' => true,
            'discount' => 0,
        ]);

        return response()->json(new PackResource($pack), 201);
    }

    public function update(Request $request, Pack $pack): PackResource
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'product_quantity' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'state' => 'nullable|boolean',
            'discount' => 'nullable|integer|min:0|max:100',
            'file' => 'nullable|file|image|max:10240',
        ]);

        $imageUrl = $pack->image_url;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('packs', 's3');
            $imageUrl = Storage::disk('s3')->url($path);
        }

        $pack->update(array_merge(
            $request->only(['name', 'product_quantity', 'price', 'description', 'state', 'discount']),
            ['image_url' => $imageUrl]
        ));

        return new PackResource($pack->fresh());
    }

    public function destroy(Pack $pack): PackResource
    {
        $pack->delete();
        return new PackResource($pack);
    }
}
