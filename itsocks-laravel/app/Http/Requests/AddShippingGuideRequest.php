<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddShippingGuideRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tracking_number' => 'required|string|max:100',
            'shipping_guide_url' => 'nullable|string|max:500',
        ];
    }
}
