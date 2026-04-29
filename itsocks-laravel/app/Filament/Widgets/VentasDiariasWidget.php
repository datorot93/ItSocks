<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

class VentasDiariasWidget extends ChartWidget
{
    protected static ?string $heading = 'Ventas diarias (últimos 30 días)';
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $ventas = Order::selectRaw('DATE(created_at) as fecha, SUM(total) as total, COUNT(*) as ordenes')
            ->where('created_at', '>=', now()->subDays(30))
            ->where('status', '!=', 'cancelled')
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Ventas ($)',
                    'data' => $ventas->pluck('total')->map(fn ($v) => (float) $v),
                    'borderColor' => '#3b82f6',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
            ],
            'labels' => $ventas->pluck('fecha'),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
