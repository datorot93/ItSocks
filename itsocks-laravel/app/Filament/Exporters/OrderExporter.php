<?php

namespace App\Filament\Exporters;

use App\Models\Order;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;

class OrderExporter extends Exporter
{
    protected static ?string $model = Order::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('id')->label('# Orden'),
            ExportColumn::make('customer_name')->label('Cliente'),
            ExportColumn::make('email')->label('Email'),
            ExportColumn::make('phone')->label('Teléfono'),
            ExportColumn::make('document_type')->label('Tipo Doc'),
            ExportColumn::make('document')->label('Documento'),
            ExportColumn::make('shipping_city')->label('Ciudad'),
            ExportColumn::make('shipping_department')->label('Departamento'),
            ExportColumn::make('shipping_address')->label('Dirección envío'),
            ExportColumn::make('billing_address')->label('Dirección facturación'),
            ExportColumn::make('subtotal')->label('Subtotal'),
            ExportColumn::make('discount_amount')->label('Descuento'),
            ExportColumn::make('shipping_cost')->label('Costo envío'),
            ExportColumn::make('total')->label('Total'),
            ExportColumn::make('payment_id')->label('ID Pago'),
            ExportColumn::make('preference_id')->label('ID Preferencia'),
            ExportColumn::make('status')->label('Estado'),
            ExportColumn::make('tracking_number')->label('Guía de envío'),
            ExportColumn::make('is_gift')->label('Es regalo'),
            ExportColumn::make('gift_from')->label('Remitente regalo'),
            ExportColumn::make('gift_to')->label('Destinatario regalo'),
            ExportColumn::make('gift_message')->label('Mensaje regalo'),
            ExportColumn::make('quantity')->label('Cantidad productos'),
            ExportColumn::make('created_at')->label('Fecha')
                ->formatStateUsing(fn ($state) => $state?->format('d/m/Y H:i')),
        ];
    }

    public static function getLabel(): string
    {
        return 'Exportar órdenes';
    }

    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Se exportaron ' . number_format($export->successful_rows) . ' ' . str('orden')->plural($export->successful_rows) . '.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' Fallaron ' . number_format($failedRowsCount) . ' ' . str('fila')->plural($failedRowsCount) . '.';
        }

        return $body;
    }
}
