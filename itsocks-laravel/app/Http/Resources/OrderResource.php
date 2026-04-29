<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'document' => $this->document,
            'document_type' => $this->document_type,
            'shipping_city' => $this->shipping_city,
            'shipping_department' => $this->shipping_department,
            'shipping_address' => $this->shipping_address,
            'billing_address' => $this->billing_address,
            'payment_id' => $this->payment_id,
            'preference_id' => $this->preference_id,
            'paid_status' => $this->paid_status,
            'is_gift' => (bool) $this->is_gift,
            'gift_from' => $this->gift_from,
            'gift_to' => $this->gift_to,
            'gift_message' => $this->gift_message,
            'shipping_guide' => $this->shipping_guide,
            'shipping_guide_url' => $this->shipping_guide_url,
            'shipping_guide_number' => $this->shipping_guide_number,
            'tracking_number' => $this->tracking_number,
            'subtotal' => (float) $this->subtotal,
            'shipping_cost' => (float) $this->shipping_cost,
            'discount_amount' => (float) $this->discount_amount,
            'total' => (float) $this->total,
            'status' => $this->status,
            'quantity' => (int) $this->quantity,
            'extra_info' => $this->extra_info,
            'special_instructions' => $this->special_instructions,
            'products' => ProductOrderResource::collection($this->whenLoaded('productOrders')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
