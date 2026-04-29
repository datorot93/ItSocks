<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image_url' => $this->image_url,
            'product_quantity' => (int) $this->product_quantity,
            'price' => (float) $this->price,
            'discount' => (int) $this->discount,
            'state' => (bool) $this->state,
            'description' => $this->description,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
