<?php

namespace App\Services;

use App\Models\DiscountCode;
use App\Models\Order;

class DiscountService
{
    /**
     * Valida un código de descuento.
     *
     * @return array{valid: bool, discount: int, discount_type: string|null, message: string}
     */
    public function validate(string $code, float $subtotal = 0): array
    {
        $discountCode = DiscountCode::where('code', $code)->first();

        if (! $discountCode) {
            return [
                'valid' => false,
                'discount' => 0,
                'discount_type' => null,
                'message' => 'El código de descuento no existe.',
            ];
        }

        if (! $discountCode->state) {
            return [
                'valid' => false,
                'discount' => 0,
                'discount_type' => $discountCode->discount_type,
                'message' => 'El código de descuento está inactivo.',
            ];
        }

        if ($discountCode->expiration_date && $discountCode->expiration_date->isPast()) {
            return [
                'valid' => false,
                'discount' => 0,
                'discount_type' => $discountCode->discount_type,
                'message' => 'El código de descuento ha expirado.',
            ];
        }

        return [
            'valid' => true,
            'discount' => $discountCode->discount,
            'discount_type' => $discountCode->discount_type ?? 'percentage',
            'message' => 'Código válido.',
            'code' => $discountCode->code,
        ];
    }

    public function apply(Order $order, string $code): Order
    {
        $result = $this->validate($code, $order->subtotal);

        if (! $result['valid']) {
            return $order;
        }

        $discountType = $result['discount_type'] ?? 'percentage';
        $discountValue = $result['discount'];

        $discountAmount = $discountType === 'fixed'
            ? $discountValue
            : round($order->subtotal * ($discountValue / 100), 2);

        $order->update([
            'discount_amount' => $discountAmount,
            'total' => $order->subtotal + $order->shipping_cost - $discountAmount,
        ]);

        return $order->fresh();
    }
}
