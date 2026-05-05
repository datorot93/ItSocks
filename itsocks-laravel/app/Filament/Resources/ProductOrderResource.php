<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductOrderResource\Pages;
use App\Models\ProductOrder;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProductOrderResource extends Resource
{
    protected static ?string $model = ProductOrder::class;
    protected static ?string $navigationIcon = 'heroicon-o-list-bullet';
    protected static ?string $navigationGroup = 'Comercio';
    protected static ?int $navigationSort = 5;
    protected static ?string $modelLabel = 'Línea de orden';
    protected static ?string $pluralModelLabel = 'Líneas de órdenes';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('order_id')
                ->label('Orden')
                ->relationship('order', 'id')
                ->searchable()
                ->required(),
            Forms\Components\Select::make('product_id')
                ->label('Producto')
                ->relationship('product', 'name')
                ->searchable()
                ->required(),
            Forms\Components\TextInput::make('quantity')
                ->label('Cantidad')
                ->numeric()
                ->required()
                ->default(1),
            Forms\Components\TextInput::make('price_paid')
                ->label('Precio pagado')
                ->numeric()
                ->prefix('$'),
            Forms\Components\TextInput::make('size')
                ->label('Talla'),
            Forms\Components\TextInput::make('color')
                ->label('Color'),
            Forms\Components\TextInput::make('discount')
                ->label('Descuento (%)')
                ->numeric()
                ->default(0),
            Forms\Components\TextInput::make('discount_code')
                ->label('Código de descuento'),
            Forms\Components\TextInput::make('pack')
                ->label('Pack'),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_id')
                    ->label('# Orden')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Producto')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Cantidad')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price_paid')
                    ->label('Precio')
                    ->money('COP')
                    ->sortable(),
                Tables\Columns\TextColumn::make('size')
                    ->label('Talla'),
                Tables\Columns\TextColumn::make('color')
                    ->label('Color'),
                Tables\Columns\TextColumn::make('discount')
                    ->label('Descuento')
                    ->suffix('%'),
                Tables\Columns\TextColumn::make('discount_code')
                    ->label('Cupón')
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('pack')
                    ->label('Pack')
                    ->placeholder('—'),
            ])
            ->defaultSort('order_id', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('product_id')
                    ->label('Producto')
                    ->relationship('product', 'name'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListProductOrders::route('/'),
            'create' => Pages\CreateProductOrder::route('/create'),
            'edit' => Pages\EditProductOrder::route('/{record}/edit'),
        ];
    }
}
