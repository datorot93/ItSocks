<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
            'quantity' => (int) $this->quantity,
            'num_in_order' => (int) $this->num_in_order,
            'price_paid' => (float) $this->price_paid,
            'discount' => (int) ($this->discount ?? 0),
            'discount_code' => $this->discount_code,
            'pack' => $this->pack,
            'size' => $this->size,
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}
