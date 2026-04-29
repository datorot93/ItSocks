<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SliderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => $this->url,
            'link' => $this->link,
            'description' => $this->description,
            'alt' => $this->alt,
            'state' => (bool) $this->state,
            'priority' => (int) $this->priority,
        ];
    }
}
