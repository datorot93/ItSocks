<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'price' => (float) $this->price,
            'talla' => $this->talla,
            'compresion' => (bool) $this->compresion,
            'state' => (bool) $this->state,
            'season' => (bool) $this->season,
            'discount' => (int) $this->discount,
            'description' => $this->description,
            'quantity' => (int) $this->quantity,
            'color' => $this->color,
            'design_id' => $this->id_design,
            'type_id' => $this->id_type,
            'subcategory_id' => $this->id_subcategory,
            'images' => ImageResource::collection($this->whenLoaded('images')),
            'sizes' => SizeResource::collection($this->whenLoaded('sizes')),
            'colors' => ColorResource::collection($this->whenLoaded('colors')),
            'design' => new DesignResource($this->whenLoaded('design')),
            'type' => new TypeResource($this->whenLoaded('type')),
            'subcategory' => new SubcategoryResource($this->whenLoaded('subcategory')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
