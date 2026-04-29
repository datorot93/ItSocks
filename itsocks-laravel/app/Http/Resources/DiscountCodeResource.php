<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiscountCodeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'discount' => (int) $this->discount,
            'discount_type' => $this->discount_type,
            'state' => (bool) $this->state,
            'expiration_date' => $this->expiration_date?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
