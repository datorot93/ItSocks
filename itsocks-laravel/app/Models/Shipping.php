<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipping extends Model
{
    protected $table = 'shipping';

    protected $fillable = [
        'municipio_ciudad',
        'departamento',
        'tarifa',
    ];

    protected $casts = [
        'tarifa' => 'integer',
    ];

    public function scopeByCity($query, string $city)
    {
        return $query->where('municipio_ciudad', 'ilike', "%{$city}%");
    }

    public function scopeByDepartamento($query, string $departamento)
    {
        return $query->where('departamento', 'ilike', "%{$departamento}%");
    }
}
