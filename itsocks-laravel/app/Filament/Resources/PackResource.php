<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PackResource\Pages;
use App\Models\Pack;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PackResource extends Resource
{
    protected static ?string $model = Pack::class;
    protected static ?string $navigationIcon = 'heroicon-o-gift';
    protected static ?string $navigationGroup = 'Comercio';
    protected static ?int $navigationSort = 3;
    protected static ?string $modelLabel = 'Pack';
    protected static ?string $pluralModelLabel = 'Packs';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Información del pack')->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nombre')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('product_quantity')
                    ->label('Cantidad de productos en el pack')
                    ->numeric()
                    ->required()
                    ->minValue(1),
                Forms\Components\TextInput::make('price')
                    ->label('Precio del pack')
                    ->numeric()
                    ->prefix('$')
                    ->required(),
                Forms\Components\TextInput::make('discount')
                    ->label('Descuento (%)')
                    ->numeric()
                    ->default(0)
                    ->minValue(0)
                    ->maxValue(100),
                Forms\Components\Toggle::make('state')
                    ->label('Activo')
                    ->default(true),
            ])->columns(2),
            Forms\Components\Section::make('Imagen y descripción')->schema([
                Forms\Components\TextInput::make('image_url')
                    ->label('URL de imagen S3')
                    ->url()
                    ->placeholder('https://itsocks-bucket.s3.amazonaws.com/packs/...'),
                Forms\Components\Textarea::make('description')
                    ->label('Descripción')
                    ->columnSpanFull(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_url')
                    ->label('Imagen')
                    ->square()
                    ->size(50),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('product_quantity')
                    ->label('Cantidad prods')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Precio')
                    ->money('COP')
                    ->sortable(),
                Tables\Columns\TextColumn::make('discount')
                    ->label('Descuento')
                    ->suffix('%'),
                Tables\Columns\IconColumn::make('state')
                    ->label('Activo')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('state')->label('Activo'),
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
            'index' => Pages\ListPacks::route('/'),
            'create' => Pages\CreatePack::route('/create'),
            'edit' => Pages\EditPack::route('/{record}/edit'),
        ];
    }
}
