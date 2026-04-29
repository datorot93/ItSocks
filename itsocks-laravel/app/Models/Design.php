<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Design extends Model
{
    use HasFactory;
    protected $table = 'design';

    protected $fillable = [
        'name',
        'code',
        'discount',
    ];

    protected $casts = [
        'discount' => 'integer',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'id_design');
    }
}
