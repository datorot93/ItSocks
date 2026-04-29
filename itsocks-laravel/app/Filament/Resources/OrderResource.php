<?php

namespace App\Filament\Resources;

use App\Filament\Exporters\OrderExporter;
use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use App\Services\OrderService;
use Filament\Actions\Exports\Enums\ExportFormat;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\ExportBulkAction;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;
    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationGroup = 'Comercio';
    protected static ?int $navigationSort = 1;
    protected static ?string $modelLabel = 'Orden';
    protected static ?string $pluralModelLabel = 'Órdenes';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Datos del cliente')->schema([
                Forms\Components\TextInput::make('customer_name')->label('Nombre')->required(),
                Forms\Components\TextInput::make('first_name')->label('Nombre(s)'),
                Forms\Components\TextInput::make('last_name')->label('Apellido(s)'),
                Forms\Components\TextInput::make('email')->label('Email')->email()->required(),
                Forms\Components\TextInput::make('phone')->label('Teléfono'),
                Forms\Components\Select::make('document_type')->label('Tipo doc')
                    ->options([
                        'CC' => 'Cédula de ciudadanía',
                        'CE' => 'Cédula extranjería',
                        'NIT' => 'NIT',
                        'PP' => 'Pasaporte',
                    ]),
                Forms\Components\TextInput::make('document')->label('Documento'),
            ])->columns(3),
            Forms\Components\Section::make('Envío')->schema([
                Forms\Components\TextInput::make('shipping_city')->label('Ciudad'),
                Forms\Components\TextInput::make('shipping_department')->label('Departamento'),
                Forms\Components\TextInput::make('shipping_address')->label('Dirección de envío'),
                Forms\Components\TextInput::make('billing_address')->label('Dirección de facturación'),
                Forms\Components\TextInput::make('country')->label('País')->default('Colombia'),
            ])->columns(2),
            Forms\Components\Section::make('Pago y envío')->schema([
                Forms\Components\Select::make('status')->label('Estado')
                    ->options([
                        'pending' => 'Pendiente',
                        'paid' => 'Pagada',
                        'shipped' => 'Enviada',
                        'delivered' => 'Entregada',
                        'cancelled' => 'Cancelada',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('payment_id')->label('ID de pago'),
                Forms\Components\TextInput::make('preference_id')->label('ID preferencia MP'),
                Forms\Components\TextInput::make('tracking_number')->label('Número de guía'),
                Forms\Components\TextInput::make('shipping_guide_url')->label('URL guía'),
            ])->columns(3),
            Forms\Components\Section::make('Montos')->schema([
                Forms\Components\TextInput::make('subtotal')->label('Subtotal')->numeric()->prefix('$'),
                Forms\Components\TextInput::make('shipping_cost')->label('Costo envío')->numeric()->prefix('$'),
                Forms\Components\TextInput::make('discount_amount')->label('Descuento')->numeric()->prefix('$'),
                Forms\Components\TextInput::make('total')->label('Total')->numeric()->prefix('$'),
            ])->columns(4),
            Forms\Components\Section::make('Regalo')->schema([
                Forms\Components\Toggle::make('is_gift')->label('Es regalo'),
                Forms\Components\TextInput::make('gift_from')->label('De'),
                Forms\Components\TextInput::make('gift_to')->label('Para'),
                Forms\Components\Textarea::make('gift_message')->label('Mensaje')->columnSpanFull(),
            ])->columns(3)->collapsible()->collapsed(),
            Forms\Components\Section::make('Información adicional')->schema([
                Forms\Components\Textarea::make('extra_info')->label('Información extra')->columnSpanFull(),
                Forms\Components\Textarea::make('special_instructions')->label('Instrucciones especiales')->columnSpanFull(),
            ])->collapsible()->collapsed(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('# Orden')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('customer_name')
                    ->label('Cliente')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('shipping_city')
                    ->label('Ciudad')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'paid' => 'success',
                        'shipped' => 'info',
                        'delivered' => 'gray',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'Pendiente',
                        'paid' => 'Pagada',
                        'shipped' => 'Enviada',
                        'delivered' => 'Entregada',
                        'cancelled' => 'Cancelada',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('tracking_number')
                    ->label('Guía')
                    ->searchable()
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('total')
                    ->label('Total')
                    ->money('COP')
                    ->sortable(),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Cantidad')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options([
                        'pending' => 'Pendiente',
                        'paid' => 'Pagada',
                        'shipped' => 'Enviada',
                        'delivered' => 'Entregada',
                        'cancelled' => 'Cancelada',
                    ]),
                Filter::make('created_at')
                    ->label('Rango de fechas')
                    ->form([
                        Forms\Components\DatePicker::make('desde')->label('Desde'),
                        Forms\Components\DatePicker::make('hasta')->label('Hasta'),
                    ])
                    ->query(fn (Builder $query, array $data) =>
                        $query
                            ->when($data['desde'], fn ($q, $d) => $q->whereDate('created_at', '>=', $d))
                            ->when($data['hasta'], fn ($q, $d) => $q->whereDate('created_at', '<=', $d))
                    )
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['desde'] ?? null) {
                            $indicators[] = 'Desde: ' . $data['desde'];
                        }
                        if ($data['hasta'] ?? null) {
                            $indicators[] = 'Hasta: ' . $data['hasta'];
                        }
                        return $indicators;
                    }),
                Tables\Filters\Filter::make('is_gift')
                    ->label('Solo regalos')
                    ->query(fn (Builder $query) => $query->where('is_gift', true)),
            ])
            ->actions([
                Action::make('agregar_guia')
                    ->label('Agregar guía')
                    ->icon('heroicon-o-truck')
                    ->color('info')
                    ->form([
                        Forms\Components\TextInput::make('tracking_number')
                            ->label('Número de guía')
                            ->required(),
                        Forms\Components\TextInput::make('tracking_url')
                            ->label('URL de seguimiento')
                            ->url(),
                    ])
                    ->action(function (Order $record, array $data): void {
                        app(OrderService::class)->addShippingGuide(
                            $record,
                            $data['tracking_number'],
                            $data['tracking_url'] ?? null
                        );
                        Notification::make()
                            ->title('Guía agregada')
                            ->body("Guía {$data['tracking_number']} asignada. Email de notificación enviado al cliente.")
                            ->success()
                            ->send();
                    })
                    ->visible(fn (Order $record) => $record->status === 'paid'),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    ExportBulkAction::make()
                        ->exporter(OrderExporter::class)
                        ->formats([ExportFormat::Xlsx])
                        ->label('Exportar Excel'),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'view' => Pages\ViewOrder::route('/{record}'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
