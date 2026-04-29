<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;
    protected $table = 'tag';

    protected $fillable = [
        'name',
        'image_url',
        'discount',
    ];

    protected $casts = [
        'discount' => 'integer',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'tag_product', 'tag_id', 'product_id');
    }
}
