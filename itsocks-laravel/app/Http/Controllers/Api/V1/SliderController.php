<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SliderResource;
use App\Models\Slider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    public function index(): JsonResponse
    {
        $sliders = Slider::active()->get();
        return response()->json(SliderResource::collection($sliders));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'url' => 'required|string|max:500',
            'link' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'alt' => 'nullable|string|max:255',
            'state' => 'nullable|boolean',
            'priority' => 'nullable|integer|min:0',
        ]);

        $slider = Slider::create($data);

        return response()->json(new SliderResource($slider), 201);
    }

    public function update(Request $request, Slider $slider): JsonResponse
    {
        $data = $request->validate([
            'url' => 'nullable|string|max:500',
            'link' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'alt' => 'nullable|string|max:255',
            'state' => 'nullable|boolean',
            'priority' => 'nullable|integer|min:0',
        ]);

        $slider->update($data);

        return response()->json(new SliderResource($slider->fresh()));
    }

    public function destroy(Slider $slider): JsonResponse
    {
        $slider->delete();
        return response()->json(['message' => 'Slider eliminado.']);
    }
}
