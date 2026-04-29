<?php

namespace App\Services;

use App\Events\OrderCreated;
use App\Events\ShippingGuideAdded;
use App\Models\Order;
use App\Models\ProductOrder;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function create(array $validated): Order
    {
        return DB::transaction(function () use ($validated) {
            $items = $validated['items'] ?? [];
            unset($validated['items']);

            // Calcular totales si no vienen calculados
            $subtotal = $validated['subtotal'] ?? 0;
            if (! $subtotal && ! empty($items)) {
                foreach ($items as $item) {
                    $product = \App\Models\Product::find($item['product_id']);
                    if ($product) {
                        $subtotal += $product->price * ($item['quantity'] ?? 1);
                    }
                }
                $validated['subtotal'] = $subtotal;
            }

            $shippingCost = $validated['shipping_cost'] ?? 0;
            $discountAmount = $validated['discount_amount'] ?? 0;
            $validated['total'] = ($validated['subtotal'] ?? 0) + $shippingCost - $discountAmount;
            $validated['status'] = $validated['status'] ?? 'pending';
            $validated['paid_status'] = $validated['paid_status'] ?? 'Pendiente';
            $validated['quantity'] = array_sum(array_column($items, 'quantity')) ?: 1;

            $order = Order::create($validated);

            // Crear los product_orders
            foreach ($items as $index => $item) {
                $product = \App\Models\Product::find($item['product_id']);
                ProductOrder::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'] ?? 1,
                    'num_in_order' => $index + 1,
                    'price_paid' => $product ? $product->price : 0,
                    'discount' => $item['discount'] ?? 0,
                    'discount_code' => $item['discount_code'] ?? null,
                    'pack' => $item['pack'] ?? null,
                    'size' => $item['size'] ?? null,
                ]);
            }

            event(new OrderCreated($order));

            return $order->fresh();
        });
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);
        return $order->fresh();
    }

    public function addShippingGuide(Order $order, string $trackingNumber, ?string $url = null): Order
    {
        $order->update([
            'tracking_number' => $trackingNumber,
            'shipping_guide_number' => $trackingNumber,
            'shipping_guide' => 'Asignada',
            'shipping_guide_url' => $url ?? $trackingNumber,
            'status' => 'shipped',
        ]);

        event(new ShippingGuideAdded($order));

        return $order->fresh();
    }
}
