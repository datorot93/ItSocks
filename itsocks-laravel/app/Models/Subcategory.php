<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subcategory extends Model
{
    use HasFactory;
    protected $table = 'subcategory';

    protected $fillable = [
        'id_category',
        'code',
        'name',
        'discount',
        'image_url',
        'priority',
    ];

    protected $casts = [
        'discount' => 'integer',
        'priority' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'id_category');
    }

    public function types(): HasMany
    {
        return $this->hasMany(Type::class, 'id_subcategory');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'id_subcategory');
    }
}
