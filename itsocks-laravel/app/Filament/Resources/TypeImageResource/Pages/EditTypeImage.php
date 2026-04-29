<?php

namespace App\Filament\Resources\TypeImageResource\Pages;

use App\Filament\Resources\TypeImageResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTypeImage extends EditRecord
{
    protected static string $resource = TypeImageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
