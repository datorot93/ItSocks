<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    protected $table = 'slider';

    protected $fillable = [
        'url',
        'link',
        'description',
        'alt',
        'state',
        'priority',
    ];

    protected $casts = [
        'state' => 'boolean',
        'priority' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('state', true)->orderBy('priority');
    }
}
