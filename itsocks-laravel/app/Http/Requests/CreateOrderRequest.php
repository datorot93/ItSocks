<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'shipping_city' => 'required|string|max:255',
            'shipping_department' => 'nullable|string|max:255',
            'shipping_address' => 'nullable|string|max:500',
            'billing_address' => 'nullable|string|max:500',
            'document' => 'nullable|string|max:50',
            'document_type' => 'nullable|string|max:50',
            'subtotal' => 'nullable|numeric|min:0',
            'shipping_cost' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'total' => 'nullable|numeric|min:0',
            'is_gift' => 'nullable|boolean',
            'gift_from' => 'nullable|string|max:255',
            'gift_to' => 'nullable|string|max:255',
            'gift_message' => 'nullable|string|max:1000',
            'extra_info' => 'nullable|string',
            'special_instructions' => 'nullable|string',
            'items' => 'nullable|array',
            'items.*.product_id' => 'required_with:items|integer|exists:product,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.size' => 'nullable|string',
            'items.*.discount' => 'nullable|integer|min:0|max:100',
            'items.*.discount_code' => 'nullable|string',
            'items.*.pack' => 'nullable|string',
        ];
    }
}
