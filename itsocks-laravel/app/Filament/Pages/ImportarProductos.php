<?php

namespace App\Filament\Pages;

use App\Jobs\ProductImportJob;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Str;

class ImportarProductos extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-arrow-up-tray';
    protected static ?string $navigationLabel = 'Importar productos';
    protected static ?string $navigationGroup = 'Catálogo';
    protected static ?int $navigationSort = 10;
    protected static ?string $title = 'Importar productos desde Excel';

    protected static string $view = 'filament.pages.importar-productos';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                FileUpload::make('archivo')
                    ->label('Archivo Excel (.xlsx)')
                    ->acceptedFileTypes([
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'application/vnd.ms-excel',
                    ])
                    ->required()
                    ->disk('local')
                    ->directory('imports/products')
                    ->maxSize(10240) // 10MB
                    ->helperText('Columnas requeridas: nombre/name, precio/price. Opcionales: categoria, subcategoria, tipo, disenio, compresion, activo.'),
            ])
            ->statePath('data');
    }

    public function importar(): void
    {
        $this->validate();

        $archivo = $this->data['archivo'];

        if (! $archivo) {
            Notification::make()
                ->title('Error')
                ->body('Debes seleccionar un archivo Excel.')
                ->danger()
                ->send();
            return;
        }

        $jobId = Str::uuid()->toString();
        $filePath = storage_path('app/' . $archivo);

        ProductImportJob::dispatch($filePath, $jobId);

        Notification::make()
            ->title('Importación iniciada')
            ->body("Los productos serán procesados en segundo plano. Job ID: {$jobId}")
            ->success()
            ->send();

        $this->form->fill();
    }
}
