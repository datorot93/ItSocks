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
            Forms\Components\Section::make('Imagen')->schema([
                Forms\Components\TextInput::make('url')
                    ->label('URL de imagen S3')
                    ->url()
                    ->required()
                    ->placeholder('https://itsocks-bucket.s3.amazonaws.com/sliders/...')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('link')
                    ->label('URL de destino (link al hacer click)')
                    ->url()
                    ->columnSpanFull(),
            ]),
            Forms\Components\Section::make('Configuración')->schema([
                Forms\Components\TextInput::make('description')
                    ->label('Descripción')
                    ->maxLength(255),
                Forms\Components\TextInput::make('alt')
                    ->label('Texto alternativo (SEO)')
                    ->maxLength(255),
                Forms\Components\TextInput::make('priority')
                    ->label('Prioridad (orden)')
                    ->numeric()
                    ->default(0),
                Forms\Components\Toggle::make('state')
                    ->label('Activo')
                    ->default(true),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('url')
                    ->label('Imagen')
                    ->square()
                    ->size(60),
                Tables\Columns\TextColumn::make('description')
                    ->label('Descripción')
                    ->searchable()
                    ->limit(40),
                Tables\Columns\TextColumn::make('priority')
                    ->label('Prioridad')
                    ->sortable(),
                Tables\Columns\IconColumn::make('state')
                    ->label('Activo')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('priority')
            ->reorderable('priority')
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
            'index' => Pages\ListSliders::route('/'),
            'create' => Pages\CreateSlider::route('/create'),
            'edit' => Pages\EditSlider::route('/{record}/edit'),
        ];
    }
}
