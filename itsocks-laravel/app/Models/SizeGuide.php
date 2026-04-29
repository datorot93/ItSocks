<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SizeGuide extends Model
{
    protected $table = 'size_guide';

    protected $fillable = [
        'size_guide',
        'image_url',
        'alt',
    ];
}
