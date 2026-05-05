<?php

namespace App\Filament\Pages;

use App\Exports\SellsReportExport;
use App\Models\Order;
use App\Models\ProductOrder;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReporteVentas extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';
    protected static ?string $navigationLabel = 'Reporte de ventas';
    protected static ?string $navigationGroup = 'Reportes';
    protected static ?int $navigationSort = 1;
    protected static ?string $title = 'Reporte de Ventas';

    protected static string $view = 'filament.pages.reporte-ventas';

    public ?array $data = [];
    public ?Collection $resultados = null;
    public array $resumen = [];

    public function mount(): void
    {
        $this->form->fill([
            'desde' => now()->startOfMonth()->format('Y-m-d'),
            'hasta' => now()->format('Y-m-d'),
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                DatePicker::make('desde')
                    ->label('Desde')
                    ->required()
                    ->maxDate(now()),
                DatePicker::make('hasta')
                    ->label('Hasta')
                    ->required()
                    ->maxDate(now()),
            ])
            ->columns(2)
            ->statePath('data');
    }

    public function buscar(): void
    {
        $this->validate([
            'data.desde' => 'required|date',
            'data.hasta' => 'required|date|after_or_equal:data.desde',
        ]);

        $desde = $this->data['desde'];
        $hasta = $this->data['hasta'];

        $this->resultados = ProductOrder::with(['order', 'product'])
            ->whereHas('order', function ($q) use ($desde, $hasta) {
                $q->where('status', 'paid')
                  ->whereDate('created_at', '>=', $desde)
                  ->whereDate('created_at', '<=', $hasta);
            })
            ->orderBy('order_id', 'desc')
            ->get();

        $this->resumen = [
            'total_ordenes' => Order::where('status', 'paid')
                ->whereDate('created_at', '>=', $desde)
                ->whereDate('created_at', '<=', $hasta)
                ->count(),
            'total_ventas' => Order::where('status', 'paid')
                ->whereDate('created_at', '>=', $desde)
                ->whereDate('created_at', '<=', $hasta)
                ->sum('total'),
            'total_productos' => $this->resultados->sum('quantity'),
        ];
    }

    public function exportar(): BinaryFileResponse
    {
        $desde = $this->data['desde'] ?? now()->startOfMonth()->format('Y-m-d');
        $hasta = $this->data['hasta'] ?? now()->format('Y-m-d');

        Notification::make()
            ->title('Exportando reporte...')
            ->info()
            ->send();

        return Excel::download(
            new SellsReportExport($desde, $hasta),
            'reporte-ventas-' . $desde . '-a-' . $hasta . '.xlsx'
        );
    }
}
