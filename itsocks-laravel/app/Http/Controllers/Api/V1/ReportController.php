<?php

namespace App\Http\Controllers\Api\V1;

use App\Exports\SellsReportExport;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    /**
     * Reporte de ventas con filtros de fecha.
     * Equivalente a sells_reports.py de FastAPI.
     */
    public function sells(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'limit' => 'nullable|integer|min:1|max:1000',
            'skip' => 'nullable|integer|min:0',
        ]);

        $query = ProductOrder::with(['order', 'product'])
            ->whereHas('order', function ($q) use ($request) {
                $q->where('status', 'paid');
                if ($request->start_date) {
                    $q->whereDate('created_at', '>=', $request->start_date);
                }
                if ($request->end_date) {
                    $q->whereDate('created_at', '<=', $request->end_date);
                }
            })
            ->orderBy('created_at', 'desc');

        $limit = $request->integer('limit', 100);
        $skip = $request->integer('skip', 0);

        $total = (clone $query)->count();
        $rows = $query->skip($skip)->take($limit)->get();

        // Agrupar por producto (similar a lo que hace FastAPI en sells_reports)
        $grouped = $rows->groupBy('product_id')->map(function ($productOrders) {
            $first = $productOrders->first();
            return [
                'product_id' => $first->product_id,
                'product_name' => $first->product?->name,
                'total_quantity' => $productOrders->sum('quantity'),
                'total_revenue' => $productOrders->sum(fn ($po) => $po->price_paid * $po->quantity),
                'orders_count' => $productOrders->pluck('order_id')->unique()->count(),
            ];
        })->values();

        return response()->json([
            'data' => $grouped,
            'meta' => [
                'total' => $total,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
        ]);
    }

    /**
     * Exportar reporte de ventas como Excel.
     */
    public function exportSells(Request $request): BinaryFileResponse
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $filename = 'reporte_ventas_' . now()->format('Y-m-d') . '.xlsx';

        return Excel::download(
            new SellsReportExport($startDate, $endDate),
            $filename
        );
    }
}
