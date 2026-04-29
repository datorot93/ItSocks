<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ShippingResource\Pages;
use App\Models\Shipping;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ShippingResource extends Resource
{
    protected static ?string $model = Shipping::class;
    protected static ?string $navigationIcon = 'heroicon-o-truck';
    protected static ?string $navigationGroup = 'Logística';
    protected static ?int $navigationSort = 1;
    protected static ?string $modelLabel = 'Tarifa de envío';
    protected static ?string $pluralModelLabel = 'Tarifas de envío';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('municipio_ciudad')
                ->label('Municipio/Ciudad')
                ->required()
                ->maxLength(100),
            Forms\Components\TextInput::make('departamento')
                ->label('Departamento')
                ->required()
                ->maxLength(100),
            Forms\Components\TextInput::make('tarifa')
                ->label('Tarifa (COP)')
                ->numeric()
                ->required()
                ->minValue(0),
        ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('municipio_ciudad')
                    ->label('Municipio')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('departamento')
                    ->label('Departamento')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('tarifa')
                    ->label('Tarifa (COP)')
                    ->money('COP')
                    ->sortable(),
            ])
            ->defaultSort('departamento')
            ->filters([
                Tables\Filters\SelectFilter::make('departamento')
                    ->label('Departamento')
                    ->options(fn () => Shipping::distinct()->pluck('departamento', 'departamento')->sort()->toArray()),
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
            'index' => Pages\ListShippings::route('/'),
            'create' => Pages\CreateShipping::route('/create'),
            'edit' => Pages\EditShipping::route('/{record}/edit'),
        ];
    }
}
