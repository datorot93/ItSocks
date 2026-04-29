<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WishListProduct extends Model
{
    protected $table = 'wish_list_product';

    public $timestamps = false;

    protected $fillable = [
        'wish_list_id',
        'product_id',
    ];

    public function wishList(): BelongsTo
    {
        return $this->belongsTo(WishList::class, 'wish_list_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
