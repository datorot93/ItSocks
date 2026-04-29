<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\FacebookPixelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PixelController extends Controller
{
    public function __construct(private FacebookPixelService $pixelService) {}

    /**
     * Enviar evento de compra via Facebook Conversions API.
     * Equivalente a pixels.py de FastAPI.
     */
    public function purchase(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'value' => 'nullable|numeric|min:0',
            'order_id' => 'nullable|integer',
            'product_ids' => 'nullable|array',
            'source_url' => 'nullable|string',
        ]);

        $success = $this->pixelService->sendPurchaseEvent($data);

        return response()->json([
            'success' => $success,
            'message' => $success ? 'Evento enviado.' : 'No se pudo enviar el evento.',
        ]);
    }
}
