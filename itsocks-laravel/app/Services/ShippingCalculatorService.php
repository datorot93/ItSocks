<?php

namespace App\Services;

use App\Models\Shipping;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class ShippingCalculatorService
{
    private function likeOperator(): string
    {
        return config('database.default') === 'pgsql' ? 'ilike' : 'like';
    }

    public function getRate(string $municipio): ?float
    {
        $like = $this->likeOperator();
        $shipping = Shipping::where('municipio_ciudad', $like, "%{$municipio}%")->first();

        return $shipping ? (float) $shipping->tarifa : null;
    }

    public function getByDepartamento(string $departamento): Collection
    {
        $like = $this->likeOperator();
        return Shipping::where('departamento', $like, "%{$departamento}%")->get();
    }

    public function getShippingCost(string $departamento, string $municipio): ?float
    {
        $like = $this->likeOperator();
        $shipping = Shipping::where('municipio_ciudad', $like, "%{$municipio}%")
            ->where('departamento', $like, "%{$departamento}%")
            ->first();

        return $shipping ? (float) $shipping->tarifa : null;
    }

    public function getAllMunicipios(): Collection
    {
        return Cache::remember('shipping_municipios', 600, function () {
            return Shipping::orderBy('municipio_ciudad')->pluck('municipio_ciudad');
        });
    }

    public function getAllDepartamentos(): Collection
    {
        return Cache::remember('shipping_departamentos', 600, function () {
            return Shipping::orderBy('departamento')->distinct()->pluck('departamento');
        });
    }
}
