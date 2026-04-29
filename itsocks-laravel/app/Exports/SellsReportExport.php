<?php

namespace App\Exports;

use App\Models\Order;
use App\Models\ProductOrder;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SellsReportExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        private ?string $startDate = null,
        private ?string $endDate = null,
    ) {}

    public function collection(): Collection
    {
        $query = ProductOrder::with(['order', 'product'])
            ->whereHas('order', function ($q) {
                $q->where('status', 'paid');
                if ($this->startDate) {
                    $q->whereDate('created_at', '>=', $this->startDate);
                }
                if ($this->endDate) {
                    $q->whereDate('created_at', '<=', $this->endDate);
                }
            })
            ->orderBy('created_at', 'desc');

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID Orden',
            'Fecha',
            'Cliente',
            'Email',
            'Ciudad',
            'Producto',
            'Cantidad',
            'Precio Pagado',
            'Descuento',
            'Total Orden',
            'Estado',
        ];
    }

    public function map($productOrder): array
    {
        return [
            $productOrder->order->id ?? '',
            $productOrder->order->created_at?->format('Y-m-d') ?? '',
            $productOrder->order->customer_name ?? '',
            $productOrder->order->email ?? '',
            $productOrder->order->shipping_city ?? '',
            $productOrder->product->name ?? '',
            $productOrder->quantity ?? 0,
            $productOrder->price_paid ?? 0,
            $productOrder->discount ?? 0,
            $productOrder->order->total ?? 0,
            $productOrder->order->status ?? '',
        ];
    }
}
