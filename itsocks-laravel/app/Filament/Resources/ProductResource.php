<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';
    protected static ?string $navigationGroup = 'Catálogo';
    protected static ?int $navigationSort = 1;
    protected static ?string $modelLabel = 'Producto';
    protected static ?string $pluralModelLabel = 'Productos';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')
                ->label('Nombre')
                ->required()
                ->maxLength(255),
            Forms\Components\Select::make('id_subcategory')
                ->label('Subcategoría')
                ->relationship('subcategory', 'name')
                ->searchable()
                ->preload(),
            Forms\Components\Select::make('id_type')
                ->label('Tipo')
                ->relationship('type', 'name')
                ->searchable()
                ->preload(),
            Forms\Components\Select::make('id_design')
                ->label('Diseño')
                ->relationship('design', 'name')
                ->searchable()
                ->preload(),
            Forms\Components\TextInput::make('price')
                ->label('Precio')
                ->numeric()
                ->prefix('$')
                ->required(),
            Forms\Components\TextInput::make('quantity')
                ->label('Cantidad')
                ->numeric()
                ->default(0),
            Forms\Components\Toggle::make('state')
                ->label('Activo')
                ->default(true),
            Forms\Components\Toggle::make('compresion')
                ->label('Compresión')
                ->default(false),
            Forms\Components\Toggle::make('season')
                ->label('Temporada')
                ->default(false),
            Forms\Components\Textarea::make('description')
                ->label('Descripción')
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('subcategory.name')
                    ->label('Subcategoría')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Precio')
                    ->money('COP')
                    ->sortable(),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Stock')
                    ->sortable(),
                Tables\Columns\IconColumn::make('state')
                    ->label('Activo')
                    ->boolean(),
                Tables\Columns\IconColumn::make('compresion')
                    ->label('Compresión')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('state')->label('Activo'),
                Tables\Filters\TernaryFilter::make('compresion')->label('Compresión'),
                Tables\Filters\TernaryFilter::make('season')->label('Temporada'),
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

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
