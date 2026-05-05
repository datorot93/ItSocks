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
            Forms\Components\Section::make('Información básica')->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nombre')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('code')
                    ->label('Código')
                    ->maxLength(100),
                Forms\Components\TextInput::make('price')
                    ->label('Precio')
                    ->numeric()
                    ->prefix('$')
                    ->required(),
                Forms\Components\TextInput::make('quantity')
                    ->label('Cantidad')
                    ->numeric()
                    ->default(0),
                Forms\Components\TextInput::make('talla')
                    ->label('Talla')
                    ->default('Única'),
                Forms\Components\TextInput::make('discount')
                    ->label('Descuento (%)')
                    ->numeric()
                    ->default(0)
                    ->minValue(0)
                    ->maxValue(100),
            ])->columns(3),
            Forms\Components\Section::make('Clasificación')->schema([
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
            ])->columns(3),
            Forms\Components\Section::make('Opciones')->schema([
                Forms\Components\Toggle::make('state')
                    ->label('Activo')
                    ->default(true),
                Forms\Components\Toggle::make('compresion')
                    ->label('Con compresión')
                    ->default(false),
                Forms\Components\Toggle::make('season')
                    ->label('Temporada')
                    ->default(false),
            ])->columns(3),
            Forms\Components\Section::make('Colores y Tallas')->schema([
                Forms\Components\CheckboxList::make('colors')
                    ->label('Colores disponibles')
                    ->relationship('colors', 'name')
                    ->columns(4),
                Forms\Components\CheckboxList::make('sizes')
                    ->label('Tallas disponibles')
                    ->relationship('sizes', 'name')
                    ->columns(4),
            ]),
            Forms\Components\Section::make('Imágenes')->schema([
                Forms\Components\Repeater::make('images')
                    ->label('Imágenes del producto')
                    ->relationship('images')
                    ->schema([
                        Forms\Components\TextInput::make('url')
                            ->label('URL de imagen')
                            ->url()
                            ->required(),
                        Forms\Components\TextInput::make('alt')
                            ->label('Texto alternativo'),
                    ])
                    ->columns(2)
                    ->collapsible(),
            ]),
            Forms\Components\Section::make('Descripción')->schema([
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
                Tables\Columns\TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('code')
                    ->label('Código')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('subcategory.name')
                    ->label('Subcategoría')
                    ->sortable(),
                Tables\Columns\TextColumn::make('type.name')
                    ->label('Tipo')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
                Tables\Filters\SelectFilter::make('id_subcategory')
                    ->label('Subcategoría')
                    ->relationship('subcategory', 'name'),
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
