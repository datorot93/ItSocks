<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DiscountCodeResource\Pages;
use App\Models\DiscountCode;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DiscountCodeResource extends Resource
{
    protected static ?string $model = DiscountCode::class;
    protected static ?string $navigationIcon = 'heroicon-o-ticket';
    protected static ?string $navigationGroup = 'Comercio';
    protected static ?int $navigationSort = 4;
    protected static ?string $modelLabel = 'Código de descuento';
    protected static ?string $pluralModelLabel = 'Códigos de descuento';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('code')->label('Código')->required()->unique(ignoreRecord: true),
            Forms\Components\Select::make('discount_type')->label('Tipo')->options(['percentage' => 'Porcentaje', 'fixed' => 'Valor fijo'])->required(),
            Forms\Components\TextInput::make('discount')->label('Valor')->numeric()->required(),
            Forms\Components\Toggle::make('state')->label('Activo')->default(true),
            Forms\Components\DateTimePicker::make('expiration_date')->label('Fecha de expiración'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('code')->label('Código')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('discount_type')->label('Tipo'),
            Tables\Columns\TextColumn::make('discount')->label('Valor'),
            Tables\Columns\IconColumn::make('state')->label('Activo')->boolean(),
            Tables\Columns\TextColumn::make('expiration_date')->label('Expira')->dateTime('d/m/Y'),
        ])->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDiscountCodes::route('/'),
            'create' => Pages\CreateDiscountCode::route('/create'),
            'edit' => Pages\EditDiscountCode::route('/{record}/edit'),
        ];
    }
}
