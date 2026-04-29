<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductOrder extends Model
{
    protected $table = 'product_order';

    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'order_id',
        'quantity',
        'pack',
        'pack_cost',
        'num_in_order',
        'size',
        'discount',
        'discount_code',
        'price_paid',
        'color',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'num_in_order' => 'integer',
        'pack_cost' => 'decimal:2',
        'price_paid' => 'decimal:2',
        'discount' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
