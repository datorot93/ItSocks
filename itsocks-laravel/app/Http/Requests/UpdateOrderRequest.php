<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'nullable|string|in:pending,paid,shipped,cancelled,Preparado',
            'paid_status' => 'nullable|string',
            'shipping_guide' => 'nullable|string',
            'shipping_guide_url' => 'nullable|string',
            'shipping_guide_number' => 'nullable|string',
            'tracking_number' => 'nullable|string',
            'payment_id' => 'nullable|string',
            'preference_id' => 'nullable|string',
            'shipping_city' => 'nullable|string|max:255',
            'shipping_department' => 'nullable|string|max:255',
            'shipping_address' => 'nullable|string|max:500',
        ];
    }
}
