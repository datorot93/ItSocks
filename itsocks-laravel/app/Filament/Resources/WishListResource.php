<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WishListResource\Pages;
use App\Models\WishList;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WishListResource extends Resource
{
    protected static ?string $model = WishList::class;
    protected static ?string $navigationIcon = 'heroicon-o-heart';
    protected static ?string $navigationGroup = 'Marketing';
    protected static ?int $navigationSort = 4;
    protected static ?string $modelLabel = 'Lista de deseos';
    protected static ?string $pluralModelLabel = 'Listas de deseos';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('id_list')
                ->label('ID de lista')
                ->required(),
            Forms\Components\TextInput::make('url_list')
                ->label('URL de lista')
                ->url(),
            Forms\Components\Textarea::make('json_list')
                ->label('JSON de lista')
                ->columnSpanFull(),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id_list')
                    ->label('ID Lista')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('url_list')
                    ->label('URL')
                    ->limit(50)
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('products_count')
                    ->label('Productos')
                    ->counts('products')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creada')
                    ->dateTime('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([])
            ->actions([
                Tables\Actions\ViewAction::make(),
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
            'index' => Pages\ListWishLists::route('/'),
            'view' => Pages\ViewWishList::route('/{record}'),
        ];
    }
}
