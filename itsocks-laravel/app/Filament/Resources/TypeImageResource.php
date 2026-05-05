<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TypeImageResource\Pages;
use App\Models\TypeImage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TypeImageResource extends Resource
{
    protected static ?string $model = TypeImage::class;
    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationGroup = 'Catálogo';
    protected static ?int $navigationSort = 8;
    protected static ?string $modelLabel = 'Imagen de tipo';
    protected static ?string $pluralModelLabel = 'Imágenes de tipos';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Información')->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nombre')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('category')
                    ->label('Categoría')
                    ->maxLength(100),
                Forms\Components\TextInput::make('subcategory')
                    ->label('Subcategoría')
                    ->maxLength(100),
                Forms\Components\TextInput::make('priority')
                    ->label('Prioridad')
                    ->numeric()
                    ->default(0),
                Forms\Components\Textarea::make('description')
                    ->label('Descripción')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('alt')
                    ->label('Texto alternativo')
                    ->columnSpanFull(),
            ])->columns(2),
            Forms\Components\Section::make('Imagen')->schema([
                Forms\Components\TextInput::make('image_url')
                    ->label('URL de imagen')
                    ->url()
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
                    ->square(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category')
                    ->label('Categoría')
                    ->searchable(),
                Tables\Columns\TextColumn::make('subcategory')
                    ->label('Subcategoría')
                    ->searchable(),
                Tables\Columns\TextColumn::make('priority')
                    ->label('Prioridad')
                    ->sortable(),
            ])
            ->defaultSort('priority')
            ->filters([])
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
            'index' => Pages\ListTypeImages::route('/'),
            'create' => Pages\CreateTypeImage::route('/create'),
            'edit' => Pages\EditTypeImage::route('/{record}/edit'),
        ];
    }
}
