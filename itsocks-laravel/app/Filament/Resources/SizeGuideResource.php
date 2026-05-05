<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SizeGuideResource\Pages;
use App\Models\SizeGuide;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SizeGuideResource extends Resource
{
    protected static ?string $model = SizeGuide::class;
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';
    protected static ?string $navigationGroup = 'Marketing';
    protected static ?int $navigationSort = 2;
    protected static ?string $modelLabel = 'Guía de tallas';
    protected static ?string $pluralModelLabel = 'Guías de tallas';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('size_guide')
                ->label('Categoría/Nombre de guía')
                ->required()
                ->maxLength(100),
            Forms\Components\TextInput::make('image_url')
                ->label('URL imagen S3')
                ->url()
                ->required()
                ->placeholder('https://itsocks-bucket.s3.amazonaws.com/guides/...'),
            Forms\Components\TextInput::make('alt')
                ->label('Texto alternativo (SEO)')
                ->maxLength(255),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('size_guide')
                    ->label('Guía')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\ImageColumn::make('image_url')
                    ->label('Imagen')
                    ->square()
                    ->size(60),
                Tables\Columns\TextColumn::make('alt')
                    ->label('Alt')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
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
            'index' => Pages\ListSizeGuides::route('/'),
            'create' => Pages\CreateSizeGuide::route('/create'),
            'edit' => Pages\EditSizeGuide::route('/{record}/edit'),
        ];
    }
}
