<x-filament-panels::page>
    <x-filament::section>
        <x-slot name="heading">
            Importar productos masivamente desde Excel
        </x-slot>

        <x-slot name="description">
            Sube un archivo .xlsx con los datos de los productos. Los registros serán procesados en segundo plano.
        </x-slot>

        <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Formato del archivo Excel</h3>
            <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                <li><strong>nombre</strong> o <strong>name</strong> — Nombre del producto (requerido)</li>
                <li><strong>precio</strong> o <strong>price</strong> — Precio en COP (requerido)</li>
                <li><strong>categoria</strong> — Nombre de la categoría</li>
                <li><strong>subcategoria</strong> — Nombre de la subcategoría</li>
                <li><strong>tipo</strong> — Nombre del tipo</li>
                <li><strong>disenio</strong> o <strong>diseño</strong> — Nombre del diseño</li>
                <li><strong>compresion</strong> — 1/0 o true/false</li>
                <li><strong>activo</strong> o <strong>state</strong> — 1/0 (por defecto: 1)</li>
                <li><strong>codigo</strong> o <strong>code</strong> — Código del producto (opcional)</li>
            </ul>
        </div>

        <form wire:submit.prevent="importar">
            {{ $this->form }}

            <div class="mt-4">
                <x-filament::button type="submit" icon="heroicon-o-arrow-up-tray">
                    Iniciar importación
                </x-filament::button>
            </div>
        </form>
    </x-filament::section>
</x-filament-panels::page>
