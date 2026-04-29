<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;
    protected $table = 'category';

    protected $fillable = [
        'name',
        'slug',
        'discount',
    ];

    protected $casts = [
        'discount' => 'integer',
    ];

    public function subcategories(): HasMany
    {
        return $this->hasMany(Subcategory::class, 'id_category');
    }
}
