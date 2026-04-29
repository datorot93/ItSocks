<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Type extends Model
{
    use HasFactory;
    protected $table = 'type';

    protected $fillable = [
        'name',
        'code',
        'discount',
        'image_url',
        'priority',
    ];

    protected $casts = [
        'discount' => 'integer',
        'priority' => 'integer',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'id_type');
    }

    public function typeImages(): HasMany
    {
        return $this->hasMany(TypeImage::class);
    }
}
