<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;
    // Nota: tabla 'orders' (plural — es la tabla de Laravel, no la singular de FastAPI)
    // FastAPI usaba '__tablename__ = order' (singular)
    protected $table = 'orders';

    protected $fillable = [
        'customer_name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'document',
        'document_type',
        'shipping_city',
        'shipping_department',
        'shipping_address',
        'billing_address',   // CORREGIDO: era billing_addess en FastAPI
        'payment_id',        // CORREGIDO: era pyment_id en FastAPI
        'preference_id',
        'paid_status',
        'gift_from',         // CORREGIDO: era 'de' en FastAPI
        'gift_to',           // CORREGIDO: era 'para' en FastAPI
        'is_gift',
        'gift_message',
        'shipping_guide',
        'shipping_guide_url',
        'shipping_guide_number',
        'tracking_number',
        'subtotal',
        'shipping_cost',
        'discount_amount',
        'total',
        'status',
        'country',
        'extra_info',
        'special_instructions',
        'quantity',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'is_gift' => 'boolean',
        'quantity' => 'integer',
    ];

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeShipped($query)
    {
        return $query->where('status', 'shipped');
    }

    public function productOrders(): HasMany
    {
        return $this->hasMany(ProductOrder::class, 'order_id');
    }
}
