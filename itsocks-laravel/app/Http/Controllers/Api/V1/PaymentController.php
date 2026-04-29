<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\MercadoPagoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private MercadoPagoService $mpService) {}

    /**
     * Crear preferencia de pago en MercadoPago.
     * Equivalente a FastAPI: POST /api/v1/payments/create_payment_preference
     */
    public function createPreference(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_id' => 'nullable|integer|exists:orders,id',
            'items' => 'nullable|array',
            'items.*.title' => 'required_with:items|string',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.unit_price' => 'required_with:items|numeric|min:0',
            'items.*.currency_id' => 'nullable|string',
        ]);

        $order = isset($data['order_id']) ? Order::find($data['order_id']) : null;

        // Si se pasan items directamente (formato FastAPI legacy), usarlos
        $items = $data['items'] ?? [];

        // Si viene un order_id sin items, construir los items desde la orden
        if ($order && empty($items)) {
            $items = [
                [
                    'title' => "Orden #{$order->id} — IT Socks",
                    'quantity' => 1,
                    'unit_price' => (float) $order->total,
                    'currency_id' => 'COP',
                ],
            ];
        }

        // Pasar el payload original al servicio para compatibilidad con FastAPI
        $extra = array_diff_key($data, array_flip(['order_id', 'items']));

        $preferenceId = $this->mpService->createPreference($items, $order, $extra);

        return response()->json([
            'preference_id' => $preferenceId,
            'id' => $preferenceId,
        ]);
    }

    /**
     * Webhook de MercadoPago — actualiza estado de orden.
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();

        try {
            $this->mpService->handleWebhook($payload);
        } catch (\Exception $e) {
            // Webhook siempre retorna 200 para evitar reintentos de MP
            report($e);
        }

        return response()->json(['status' => 'ok']);
    }
}
