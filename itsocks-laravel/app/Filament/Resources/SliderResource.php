<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SliderResource\Pages;
use App\Models\Slider;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SliderResource extends Resource
{
    protected static ?string $model = Slider::class;
    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationGroup = 'Marketing';
    protected static ?int $navigationSort = 1;
    protected static ?string $modelLabel = 'Slider';
    protected static ?string $pluralModelLabel = 'Sliders';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('url')->label('URL de imagen')->required(),
            Forms\Components\TextInput::make('link')->label('URL de destino'),
            Forms\Components\TextInput::make('description')->label('Descripción'),
            Forms\Components\TextInput::make('alt')->label('Alt text'),
            Forms\Components\Toggle::make('state')->label('Activo')->default(true),
            Forms\Components\TextInput::make('priority')->label('Prioridad')->numeric()->default(0),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\ImageColumn::make('url')->label('Imagen'),
            Tables\Columns\TextColumn::make('description')->label('Descripción'),
            Tables\Columns\TextColumn::make('priority')->label('Prioridad')->sortable(),
            Tables\Columns\IconColumn::make('state')->label('Activo')->boolean(),
        ])->defaultSort('priority')->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSliders::route('/'),
            'create' => Pages\CreateSlider::route('/create'),
            'edit' => Pages\EditSlider::route('/{record}/edit'),
        ];
    }
}
