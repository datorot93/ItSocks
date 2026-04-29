<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShippingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'municipio_ciudad' => $this->municipio_ciudad,
            'departamento' => $this->departamento,
            'tarifa' => (int) $this->tarifa,
        ];
    }
}
