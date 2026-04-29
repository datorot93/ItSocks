<x-filament-panels::page>
    <x-filament::section>
        <x-slot name="heading">Filtros de reporte</x-slot>

        <form wire:submit.prevent="buscar">
            {{ $this->form }}

            <div class="mt-4 flex gap-3">
                <x-filament::button type="submit" icon="heroicon-o-magnifying-glass">
                    Buscar
                </x-filament::button>

                @if($this->resultados !== null)
                    <x-filament::button
                        wire:click="exportar"
                        color="success"
                        icon="heroicon-o-arrow-down-tray"
                    >
                        Exportar Excel
                    </x-filament::button>
                @endif
            </div>
        </form>
    </x-filament::section>

    @if($this->resultados !== null)
        <div class="grid grid-cols-3 gap-4 mt-4">
            <x-filament::section>
                <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Total órdenes pagadas</p>
                    <p class="text-3xl font-bold text-success-600">{{ $this->resumen['total_ordenes'] }}</p>
                </div>
            </x-filament::section>

            <x-filament::section>
                <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Total ventas</p>
                    <p class="text-3xl font-bold text-primary-600">${{ number_format($this->resumen['total_ventas'], 0, ',', '.') }}</p>
                </div>
            </x-filament::section>

            <x-filament::section>
                <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Total productos vendidos</p>
                    <p class="text-3xl font-bold text-info-600">{{ $this->resumen['total_productos'] }}</p>
                </div>
            </x-filament::section>
        </div>

        <x-filament::section class="mt-4">
            <x-slot name="heading">
                Detalle ({{ $this->resultados->count() }} registros)
            </x-slot>

            @if($this->resultados->isEmpty())
                <p class="text-gray-500 text-center py-8">No hay ventas en el período seleccionado.</p>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b dark:border-gray-700">
                                <th class="text-left py-2 px-3 font-semibold">Orden</th>
                                <th class="text-left py-2 px-3 font-semibold">Fecha</th>
                                <th class="text-left py-2 px-3 font-semibold">Cliente</th>
                                <th class="text-left py-2 px-3 font-semibold">Ciudad</th>
                                <th class="text-left py-2 px-3 font-semibold">Producto</th>
                                <th class="text-right py-2 px-3 font-semibold">Cant.</th>
                                <th class="text-right py-2 px-3 font-semibold">Precio</th>
                                <th class="text-right py-2 px-3 font-semibold">Total Orden</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($this->resultados as $item)
                                <tr class="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <td class="py-2 px-3">#{{ $item->order_id }}</td>
                                    <td class="py-2 px-3">{{ $item->order?->created_at?->format('d/m/Y') }}</td>
                                    <td class="py-2 px-3">{{ $item->order?->customer_name }}</td>
                                    <td class="py-2 px-3">{{ $item->order?->shipping_city }}</td>
                                    <td class="py-2 px-3">{{ $item->product?->name }}</td>
                                    <td class="py-2 px-3 text-right">{{ $item->quantity }}</td>
                                    <td class="py-2 px-3 text-right">${{ number_format($item->price_paid, 0, ',', '.') }}</td>
                                    <td class="py-2 px-3 text-right font-semibold">${{ number_format($item->order?->total ?? 0, 0, ',', '.') }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </x-filament::section>
    @endif
</x-filament-panels::page>
