<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    protected $table = 'pack';

    protected $fillable = [
        'name',
        'image_url',
        'product_quantity',
        'price',
        'discount',
        'state',
        'description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'state' => 'boolean',
        'discount' => 'integer',
        'product_quantity' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('state', true);
    }
}
