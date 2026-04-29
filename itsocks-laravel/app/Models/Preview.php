<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Preview extends Model
{
    protected $table = 'preview';

    protected $fillable = [
        'category',
        'subcategory',
        'type',
        'image_url',
    ];
}
