<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SizeResource\Pages;
use App\Models\Size;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SizeResource extends Resource
{
    protected static ?string $model = Size::class;
    protected static ?string $navigationIcon = 'heroicon-o-arrows-up-down';
    protected static ?string $navigationGroup = 'Catálogo';
    protected static ?int $navigationSort = 10;
    protected static ?string $modelLabel = 'Talla';
    protected static ?string $pluralModelLabel = 'Tallas';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('size')->label('Talla')->required(),
            Forms\Components\TextInput::make('description')->label('Descripción'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('size')->label('Talla')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('description')->label('Descripción'),
        ])->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSizes::route('/'),
            'create' => Pages\CreateSize::route('/create'),
            'edit' => Pages\EditSize::route('/{record}/edit'),
        ];
    }
}
