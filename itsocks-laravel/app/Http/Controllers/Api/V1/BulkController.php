<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shipping;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BulkController extends Controller
{
    /**
     * Actualización masiva de precios.
     * Equivalente a bulk_prices.py de FastAPI.
     */
    public function updatePrices(Request $request): JsonResponse
    {
        $request->validate([
            'updates' => 'required|array|min:1',
            'updates.*.id' => 'required|integer|exists:product,id',
            'updates.*.price' => 'required|numeric|min:0',
            'updates.*.discount' => 'nullable|integer|min:0|max:100',
        ]);

        $updated = 0;

        DB::transaction(function () use ($request, &$updated) {
            foreach ($request->input('updates') as $update) {
                $data = ['price' => $update['price']];
                if (isset($update['discount'])) {
                    $data['discount'] = $update['discount'];
                }

                Product::where('id', $update['id'])->update($data);
                $updated++;
            }
        });

        return response()->json([
            'message' => "Se actualizaron {$updated} productos.",
            'updated_count' => $updated,
        ]);
    }

    /**
     * Actualización masiva de tarifas de envío.
     * Equivalente a bulk_shipping.py de FastAPI.
     */
    public function updateShippingRates(Request $request): JsonResponse
    {
        $request->validate([
            'updates' => 'required|array|min:1',
            'updates.*.id' => 'required|integer|exists:shipping,id',
            'updates.*.tarifa' => 'required|integer|min:0',
        ]);

        $updated = 0;

        DB::transaction(function () use ($request, &$updated) {
            foreach ($request->input('updates') as $update) {
                Shipping::where('id', $update['id'])->update(['tarifa' => $update['tarifa']]);
                $updated++;
            }
        });

        return response()->json([
            'message' => "Se actualizaron {$updated} tarifas.",
            'updated_count' => $updated,
        ]);
    }
}
