<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountCode extends Model
{
    protected $table = 'discount_code';

    protected $fillable = [
        'code',
        'discount_type',
        'discount',
        'state',
        'expiration_date',
    ];

    protected $casts = [
        'discount' => 'integer',
        'state' => 'boolean',
        'expiration_date' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where('state', true)
            ->where(function ($q) {
                $q->whereNull('expiration_date')
                    ->orWhere('expiration_date', '>', now());
            });
    }
}
