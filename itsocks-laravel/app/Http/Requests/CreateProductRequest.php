<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'compresion' => 'nullable|boolean',
            'state' => 'nullable|boolean',
            'season' => 'nullable|boolean',
            'discount' => 'nullable|integer|min:0|max:100',
            'quantity' => 'nullable|integer|min:0',
            'talla' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'code' => 'nullable|string|max:100|unique:product,code',
            'color' => 'nullable|string|max:100',
            'design_id' => 'nullable|integer|exists:design,id',
            'type_id' => 'nullable|integer|exists:type,id',
            'subcategory_id' => 'nullable|integer|exists:subcategory,id',
        ];
    }
}
