<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeImage extends Model
{
    protected $table = 'type_image';

    protected $fillable = [
        'name',
        'category',
        'subcategory',
        'priority',
        'description',
        'alt',
        'image_url',
    ];

    protected $casts = [
        'priority' => 'integer',
    ];
}
