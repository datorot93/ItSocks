<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WishListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'id_list' => $this->id_list,
            'url_list' => $this->url_list,
            'products' => ProductResource::collection($this->whenLoaded('products')),
        ];
    }
}
