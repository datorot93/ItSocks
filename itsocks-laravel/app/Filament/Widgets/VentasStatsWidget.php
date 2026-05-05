<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class VentasStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $mesActual = Order::whereMonth('created_at', now()->month)
                          ->whereYear('created_at', now()->year);
        $mesAnterior = Order::whereMonth('created_at', now()->subMonth()->month)
                            ->whereYear('created_at', now()->subMonth()->year);

        $ventasActual = (float) $mesActual->sum('total');
        $ventasAnterior = (float) ($mesAnterior->sum('total') ?: 1);
        $crecimiento = round((($ventasActual - $ventasAnterior) / $ventasAnterior) * 100, 1);

        $promedioOrden = $mesActual->count() > 0
            ? number_format((float) $mesActual->avg('total'), 0, ',', '.')
            : '0';

        return [
            Stat::make('Ventas del mes', '$' . number_format($ventasActual, 0, ',', '.'))
                ->description($crecimiento . '% vs mes anterior')
                ->descriptionIcon($crecimiento >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($crecimiento >= 0 ? 'success' : 'danger'),

            Stat::make('Órdenes del mes', $mesActual->count())
                ->description('Promedio $' . $promedioOrden . ' por orden')
                ->color('info'),

            Stat::make('Órdenes pendientes', Order::where('status', 'pending')->count())
                ->color('warning'),

            Stat::make('Productos activos', Product::where('state', true)->count())
                ->color('gray'),
        ];
    }
}
