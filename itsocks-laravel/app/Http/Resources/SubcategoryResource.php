<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubcategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'discount' => (int) $this->discount,
            'image_url' => $this->image_url,
            'priority' => (int) $this->priority,
            'category_id' => $this->id_category,
            'category' => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}
