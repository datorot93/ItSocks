<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ImageResource;
use App\Models\Image;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|image|max:10240',
            'product_id' => 'required|integer|exists:product,id',
        ]);

        $file = $request->file('file');
        $path = $file->store('products', 's3');
        $url = Storage::disk('s3')->url($path);

        $image = Image::create([
            'id_product' => $request->integer('product_id'),
            'url' => $url,
        ]);

        return response()->json(['data' => new ImageResource($image)], 201);
    }

    public function destroy(Image $image): JsonResponse
    {
        // Intentar borrar del storage si la URL es de S3
        if ($image->url && str_contains($image->url, 'amazonaws.com')) {
            $path = parse_url($image->url, PHP_URL_PATH);
            Storage::disk('s3')->delete(ltrim($path, '/'));
        }

        $image->delete();

        return response()->json(['message' => 'Imagen eliminada.']);
    }
}
