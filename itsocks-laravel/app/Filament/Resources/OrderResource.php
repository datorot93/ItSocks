<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

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
                Forms\Components\TextInput::make('email')->label('Email')->email()->required(),
                Forms\Components\TextInput::make('phone')->label('Teléfono'),
            ])->columns(3),
            Forms\Components\Section::make('Envío')->schema([
                Forms\Components\TextInput::make('shipping_city')->label('Ciudad'),
                Forms\Components\TextInput::make('shipping_department')->label('Departamento'),
                Forms\Components\TextInput::make('shipping_address')->label('Dirección de envío'),
                Forms\Components\TextInput::make('billing_address')->label('Dirección de facturación'),
            ])->columns(2),
            Forms\Components\Section::make('Pago')->schema([
                Forms\Components\Select::make('status')->label('Estado')
                    ->options([
                        'pending' => 'Pendiente',
                        'paid' => 'Pagada',
                        'shipped' => 'Enviada',
                        'cancelled' => 'Cancelada',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('payment_id')->label('ID de pago'),
                Forms\Components\TextInput::make('tracking_number')->label('Número de seguimiento'),
            ])->columns(3),
            Forms\Components\Section::make('Montos')->schema([
                Forms\Components\TextInput::make('subtotal')->label('Subtotal')->numeric()->prefix('$'),
                Forms\Components\TextInput::make('shipping_cost')->label('Costo envío')->numeric()->prefix('$'),
                Forms\Components\TextInput::make('discount_amount')->label('Descuento')->numeric()->prefix('$'),
                Forms\Components\TextInput::make('total')->label('Total')->numeric()->prefix('$'),
            ])->columns(4),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->label('# Orden')->sortable(),
                Tables\Columns\TextColumn::make('customer_name')->label('Cliente')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('email')->label('Email')->searchable()->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('shipping_city')->label('Ciudad')->sortable(),
                Tables\Columns\BadgeColumn::make('status')->label('Estado')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'paid',
                        'info' => 'shipped',
                        'danger' => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('total')->label('Total')->money('COP')->sortable(),
                Tables\Columns\TextColumn::make('created_at')->label('Fecha')->dateTime('d/m/Y H:i')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')->label('Estado')
                    ->options([
                        'pending' => 'Pendiente',
                        'paid' => 'Pagada',
                        'shipped' => 'Enviada',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
