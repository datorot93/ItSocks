<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class WishList extends Model
{
    use HasFactory;
    protected $table = 'wish_list';

    protected $fillable = [
        'id_list',
        'url_list',
        'json_list',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'wish_list_product', 'wish_list_id', 'product_id');
    }
}
