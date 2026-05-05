<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DiscountCodeResource\Pages;
use App\Models\DiscountCode;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

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
            Forms\Components\Section::make('Datos del código')->schema([
                Forms\Components\TextInput::make('code')
                    ->label('Código')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->suffixAction(
                        Forms\Components\Actions\Action::make('generate_code')
                            ->icon('heroicon-m-arrow-path')
                            ->action(function (Forms\Set $set) {
                                $set('code', strtoupper(Str::random(8)));
                            })
                    ),
                Forms\Components\Select::make('discount_type')
                    ->label('Tipo de descuento')
                    ->options([
                        'percentage' => 'Porcentaje (%)',
                        'fixed' => 'Valor fijo ($)',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('discount')
                    ->label('Valor del descuento')
                    ->numeric()
                    ->required()
                    ->minValue(0),
                Forms\Components\Toggle::make('state')
                    ->label('Activo')
                    ->default(true),
                Forms\Components\DateTimePicker::make('expiration_date')
                    ->label('Fecha de expiración')
                    ->nullable(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Código')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('discount_type')
                    ->label('Tipo')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'percentage' => 'Porcentaje',
                        'fixed' => 'Valor fijo',
                        default => $state,
                    })
                    ->color(fn (string $state) => match ($state) {
                        'percentage' => 'info',
                        'fixed' => 'success',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('discount')
                    ->label('Valor')
                    ->sortable(),
                Tables\Columns\IconColumn::make('state')
                    ->label('Activo')
                    ->boolean(),
                Tables\Columns\TextColumn::make('expiration_date')
                    ->label('Expira')
                    ->dateTime('d/m/Y')
                    ->placeholder('Sin expiración')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('state')->label('Activo'),
                Tables\Filters\SelectFilter::make('discount_type')
                    ->label('Tipo')
                    ->options([
                        'percentage' => 'Porcentaje',
                        'fixed' => 'Valor fijo',
                    ]),
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
            'index' => Pages\ListDiscountCodes::route('/'),
            'create' => Pages\CreateDiscountCode::route('/create'),
            'edit' => Pages\EditDiscountCode::route('/{record}/edit'),
        ];
    }
}
