---
nombre: "Fase 6 — Admin Panel Filament 3 (Implementación Completa)"
version: "1.0"
fecha: "2026-04-23"
propietario: "daaltoto@gmail.com"
estado: "aprobado"
tipo: "spec-implementacion"
alcance: "itsocks-laravel/app/Filament — paridad funcional completa con admin-itsocks/ de React Admin 5"
agente: "agente-filament-admin-fase6"
rama: "feature/fase-6-filament-admin"
---

# Spec Fase 6: Admin Panel Filament 3 — Implementación Completa

## 1. Objetivo

Completar el panel de administración en Filament 3 con todas las funcionalidades del panel React Admin 5 actual (`admin-itsocks/`). Esta fase corre en paralelo con F4. Al finalizar, el panel Filament reemplaza completamente `admin-itsocks/` como herramienta de gestión del negocio.

**Tiempo estimado:** 4 semanas (paralelo con F4, semanas 33-36)  
**Prerrequisito:** F2 completada (API Laravel con todos los Services disponibles)

---

## 2. Funcionalidades a Implementar

### 2.1 Dashboard de Ventas

El React Admin actual tiene un dashboard con recharts. Reemplazar con Filament Widgets:

#### StatsOverviewWidget
```php
// app/Filament/Widgets/VentasStatsWidget.php
class VentasStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $mesActual = Order::whereMonth('created_at', now()->month)
                          ->whereYear('created_at', now()->year);
        $mesAnterior = Order::whereMonth('created_at', now()->subMonth()->month)
                            ->whereYear('created_at', now()->subMonth()->year);

        $ventasActual = $mesActual->sum('total');
        $ventasAnterior = $mesAnterior->sum('total') ?: 1;
        $crecimiento = round((($ventasActual - $ventasAnterior) / $ventasAnterior) * 100, 1);

        return [
            Stat::make('Ventas del mes', '$' . number_format($ventasActual, 0, ',', '.'))
                ->description($crecimiento . '% vs mes anterior')
                ->color($crecimiento >= 0 ? 'success' : 'danger'),

            Stat::make('Órdenes del mes', $mesActual->count())
                ->description('Promedio $' . number_format($mesActual->avg('total'), 0, ',', '.') . ' por orden')
                ->color('info'),

            Stat::make('Órdenes pendientes', Order::where('status', 'pending')->count())
                ->color('warning'),

            Stat::make('Productos activos', Product::where('is_active', true)->count())
                ->color('gray'),
        ];
    }

    protected static ?int $sort = 1;
}
```

#### ChartWidget de Ventas por Día
```php
// app/Filament/Widgets/VentasDiariasWidget.php
class VentasDiariasWidget extends ChartWidget
{
    protected static ?string $heading = 'Ventas diarias (últimos 30 días)';
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $ventas = Order::selectRaw('DATE(created_at) as fecha, SUM(total) as total, COUNT(*) as ordenes')
            ->where('created_at', '>=', now()->subDays(30))
            ->where('status', '!=', 'cancelled')
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        return [
            'datasets' => [
                ['label' => 'Ventas ($)', 'data' => $ventas->pluck('total'), 'borderColor' => '#3b82f6'],
            ],
            'labels' => $ventas->pluck('fecha'),
        ];
    }

    protected function getType(): string { return 'line'; }
}
```

---

### 2.2 OrderResource — Funcionalidades Completas

El módulo de órdenes es el más importante del admin:

```php
// app/Filament/Resources/OrderResource.php
class OrderResource extends Resource
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable()->searchable(),
                TextColumn::make('customer_name')->searchable(),
                TextColumn::make('email')->searchable(),
                TextColumn::make('total')->money('COP')->sortable(),
                BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'paid',
                        'info' => 'shipped',
                        'gray' => 'delivered',
                        'danger' => 'cancelled',
                    ]),
                TextColumn::make('tracking_number')->searchable()->default('—'),
                TextColumn::make('created_at')->dateTime('d/m/Y H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pendiente',
                        'paid' => 'Pagada',
                        'shipped' => 'Enviada',
                        'delivered' => 'Entregada',
                        'cancelled' => 'Cancelada',
                    ]),
                Filter::make('created_at')
                    ->form([
                        DatePicker::make('desde'),
                        DatePicker::make('hasta'),
                    ])
                    ->query(fn(Builder $query, array $data) =>
                        $query
                            ->when($data['desde'], fn($q, $d) => $q->whereDate('created_at', '>=', $d))
                            ->when($data['hasta'], fn($q, $d) => $q->whereDate('created_at', '<=', $d))
                    ),
            ])
            ->actions([
                Action::make('agregar_guia')
                    ->label('Agregar guía')
                    ->icon('heroicon-o-truck')
                    ->form([
                        TextInput::make('tracking_number')
                            ->label('Número de guía')
                            ->required(),
                    ])
                    ->action(function (Order $record, array $data, OrderNotificationService $service): void {
                        app(OrderService::class)->addShippingGuide($record, $data['tracking_number']);
                        // El Service dispara el email via Queue
                        Notification::make()->title('Guía agregada y email enviado')->success()->send();
                    }),
                ViewAction::make(),
                EditAction::make(),
            ])
            ->bulkActions([
                ExportBulkAction::make()->exporter(OrderExporter::class),
                DeleteBulkAction::make(),
            ]);
    }
}
```

### Exportador de Órdenes
```php
// app/Filament/Exporters/OrderExporter.php
class OrderExporter extends Exporter
{
    public static function getColumns(): array
    {
        return [
            ExportColumn::make('id')->label('# Orden'),
            ExportColumn::make('customer_name')->label('Cliente'),
            ExportColumn::make('email')->label('Email'),
            ExportColumn::make('phone')->label('Teléfono'),
            ExportColumn::make('shipping_city')->label('Ciudad'),
            ExportColumn::make('billing_address')->label('Dirección facturación'),
            ExportColumn::make('subtotal')->label('Subtotal'),
            ExportColumn::make('discount_amount')->label('Descuento'),
            ExportColumn::make('shipping_cost')->label('Envío'),
            ExportColumn::make('total')->label('Total'),
            ExportColumn::make('payment_id')->label('ID Pago'),
            ExportColumn::make('status')->label('Estado'),
            ExportColumn::make('tracking_number')->label('Guía'),
            ExportColumn::make('is_gift')->label('Es regalo'),
            ExportColumn::make('gift_from')->label('Remitente regalo'),
            ExportColumn::make('gift_to')->label('Destinatario regalo'),
            ExportColumn::make('created_at')->label('Fecha')->formatStateUsing(
                fn($state) => $state?->format('d/m/Y H:i')
            ),
        ];
    }

    public static function getModel(): string { return Order::class; }
    public static function getLabel(): string { return 'Exportar órdenes'; }
}
```

---

### 2.3 ProductResource — Gestión de Imágenes con S3

```php
public static function form(Form $form): Form
{
    return $form->schema([
        Section::make('Información básica')->schema([
            TextInput::make('name')->required(),
            TextInput::make('price')->numeric()->required(),
            Toggle::make('compresion')->label('Con compresión'),
            Toggle::make('is_active')->label('Activo')->default(true),
            Select::make('design_id')->relationship('design', 'name')->searchable(),
            Select::make('type_id')->relationship('type', 'name')->searchable(),
            Select::make('subcategory_id')->relationship('subcategory', 'name')->searchable(),
        ]),
        Section::make('Imágenes')->schema([
            SpatieMediaLibraryFileUpload::make('images')
                ->collection('product-images')
                ->multiple()
                ->reorderable()
                ->image()
                ->imageResizeMode('cover')
                ->imageCropAspectRatio('1:1')
                ->disk('s3')
                ->visibility('public')
                ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                ->maxSize(5120), // 5MB
        ]),
        Section::make('Colores y Tallas')->schema([
            CheckboxList::make('colors')
                ->relationship('colors', 'name')
                ->columns(4),
            CheckboxList::make('sizes')
                ->relationship('sizes', 'name')
                ->columns(4),
        ]),
    ]);
}
```

---

### 2.4 Importación Masiva de Productos (Excel → Job)

```php
// app/Filament/Pages/ImportarProductos.php
class ImportarProductos extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-arrow-up-tray';
    protected static ?string $navigationLabel = 'Importar productos';
    protected static ?string $navigationGroup = 'Catálogo';

    public ?array $data = [];

    public function form(Form $form): Form
    {
        return $form->schema([
            FileUpload::make('archivo')
                ->label('Archivo Excel (.xlsx)')
                ->acceptedFileTypes(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
                ->required()
                ->storeFiles(false), // Procesar en memoria
        ])->statePath('data');
    }

    public function importar(): void
    {
        $this->validate();
        $archivo = $this->data['archivo'];

        ImportarProductosJob::dispatch($archivo->getRealPath());

        Notification::make()
            ->title('Importación iniciada')
            ->body('Los productos serán procesados en segundo plano. Revisa los logs en unos minutos.')
            ->success()
            ->send();
    }
}
```

### Mapeo de columnas del Excel actual
Basado en el módulo `files.py` de FastAPI:

| Columna Excel | Campo en BD | Notas |
|---------------|-------------|-------|
| `nombre` / `name` | `product.name` | Buscar ambas variantes |
| `precio` / `price` | `product.price` | Convertir a decimal |
| `categoria` | `category.name` | Buscar o crear |
| `subcategoria` | `subcategory.name` | Buscar o crear |
| `tipo` | `type.name` | Buscar o crear |
| `disenio` / `diseño` | `design.name` | Buscar o crear |
| `compresion` | `product.compresion` | `1`/`0` o `true`/`false` |
| `activo` | `product.is_active` | |

---

### 2.5 SellsReportResource — Equivalente a `sells_reports.py`

```php
// app/Filament/Pages/ReporteVentas.php
class ReporteVentas extends Page
{
    // Filtros de fecha (desde/hasta)
    // Tabla de órdenes con totales agrupados
    // Botón "Exportar Excel" → Maatwebsite Excel
    // Equivalente funcional a SellsReport en admin-itsocks/
}
```

---

## 3. Tabla Completa de Recursos Filament

| React Admin Resource | Filament Resource | Grupo de Navegación | Funcionalidades especiales |
|---------------------|------------------|--------------------|-----------------------------|
| `Order` | `OrderResource` | Comercio | Filtros de fecha, estado, exportar Excel, agregar guía |
| `Product` | `ProductResource` | Catálogo | Upload imágenes S3, checkboxes tallas/colores |
| `Category` | `CategoryResource` | Catálogo | CRUD básico |
| `Subcategory` | `SubcategoryResource` | Catálogo | Select de categoría padre |
| `Type` | `TypeResource` | Catálogo | Select de subcategoría |
| `Design` | `DesignResource` | Catálogo | Upload imagen del diseño |
| `Tag` | `TagResource` | Catálogo | CRUD básico |
| `Color` | `ColorResource` | Catálogo | Color picker hex |
| `Size` | `SizeResource` | Catálogo | CRUD básico |
| `Pack` | `PackResource` | Comercio | Selección multiple de productos |
| `DiscountCode` | `DiscountCodeResource` | Comercio | Generación automática de código |
| `ProductOrder` | `ProductOrderResource` | Comercio | Vista de líneas de orden |
| `Shipping` | `ShippingResource` | Logística | Importación masiva de tarifas |
| `Customer` | `CustomerResource` | Marketing | Vista de clientes |
| `Slider` | `SliderResource` | Marketing | Upload imagen, orden arrastrable |
| `SizeGuide` | `SizeGuideResource` | Marketing | Upload imagen por categoría |
| `TypeImage` | `TypeImageResource` | Catálogo | Imágenes por tipo |
| `WishList` | `WishListResource` | Marketing | Vista de listas (solo lectura) |
| `User` | `UserResource` | Admin | Crear/editar admins, roles |
| `BulkPrices` | `ImportarProductos` (Page) | Catálogo | Importación Excel |
| `SellsReport` | `ReporteVentas` (Page) | Reportes | Filtros + exportar Excel |
| `OrderReport` | `ReporteVentas` (misma Page) | Reportes | Tablas por período |

---

## 4. Configuración de Navegación del Panel

```php
// app/Providers/Filament/AdminPanelProvider.php
->navigationGroups([
    NavigationGroup::make('Catálogo')->icon('heroicon-o-tag'),
    NavigationGroup::make('Comercio')->icon('heroicon-o-shopping-bag'),
    NavigationGroup::make('Logística')->icon('heroicon-o-truck'),
    NavigationGroup::make('Marketing')->icon('heroicon-o-megaphone'),
    NavigationGroup::make('Reportes')->icon('heroicon-o-chart-bar'),
    NavigationGroup::make('Administración')->icon('heroicon-o-cog'),
])
->widgets([
    VentasStatsWidget::class,
    VentasDiariasWidget::class,
])
```

---

## 5. Tests de Filament

### 5a. Fixtures de prueba

Antes de implementar los tests, crear estos archivos en `tests/fixtures/`:

```bash
tests/fixtures/
├── product_import_valid.xlsx     # 10 productos bien formados para test de importación exitosa
├── product_import_invalid.xlsx   # Excel con columnas faltantes para test de error
└── product_placeholder.jpg       # Imagen 400x400 JPEG para tests de upload (ya creada en F1)
```

El archivo `product_import_valid.xlsx` debe tener las columnas: `nombre`, `precio`, `categoria`, `subcategoria`, `tipo`, `disenio`, `compresion`, `activo`.

### 5b. Tests de importación masiva (Queue::fake)

```php
// tests/Feature/Filament/ProductImportTest.php
class ProductImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_importar_productos_despacha_job(): void
    {
        Queue::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin);

        $file = UploadedFile::fake()->createWithContent(
            'productos.xlsx',
            file_get_contents(base_path('tests/fixtures/product_import_valid.xlsx'))
        );

        $response = $this->postJson('/api/v1/files/import', ['file' => $file]);

        $response->assertStatus(202);
        Queue::assertPushed(ImportarProductosJob::class);
    }

    public function test_job_importacion_crea_productos_en_bd(): void
    {
        // Testear el Job directamente (sin queue, modo sync)
        $excelPath = base_path('tests/fixtures/product_import_valid.xlsx');

        (new ImportarProductosJob($excelPath))->handle();

        $this->assertDatabaseCount('product', 10);
    }

    public function test_excel_invalido_retorna_error_descriptivo(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin);

        $file = UploadedFile::fake()->createWithContent(
            'invalid.xlsx',
            file_get_contents(base_path('tests/fixtures/product_import_invalid.xlsx'))
        );

        $response = $this->postJson('/api/v1/files/import', ['file' => $file]);
        $response->assertStatus(422)
                 ->assertJsonStructure(['message', 'errors']);
    }
}
```

### 5c. Tests de imágenes con S3 fake

```php
// tests/Feature/Filament/ProductImageTest.php
class ProductImageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('s3');
    }

    public function test_upload_imagen_producto_a_s3(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::factory()->create();
        $imageFile = UploadedFile::fake()->image('product.jpg', 400, 400);

        $response = $this->actingAs($admin, 'sanctum')
                         ->postJson('/api/v1/images', [
                             'product_id' => $product->id,
                             'image' => $imageFile,
                         ]);

        $response->assertStatus(201);
        Storage::disk('s3')->assertExists(
            $response->json('data.path')
        );
    }

    public function test_imagen_eliminada_se_borra_de_s3(): void
    {
        Storage::fake('s3');
        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::factory()->create();
        $image = Image::factory()->create([
            'product_id' => $product->id,
            'url' => 's3://itsocks-test/products/test.jpg',
        ]);

        Storage::disk('s3')->put('products/test.jpg', 'fake content');

        $this->actingAs($admin, 'sanctum')
             ->deleteJson("/api/v1/images/{$image->id}")
             ->assertStatus(200);

        Storage::disk('s3')->assertMissing('products/test.jpg');
    }
}
```

### 5d. Tests del dashboard de ventas

```php
// tests/Feature/Filament/DashboardTest.php
class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_muestra_ventas_del_mes(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        Order::factory()->count(5)->create([
            'total' => 80000,
            'status' => 'paid',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($admin)
                         ->get('/admin');

        $response->assertStatus(200)
                 ->assertSee('400.000')  // 5 × 80.000 = 400.000 COP
                 ->assertSee('Ventas del mes');
    }

    public function test_exportar_ordenes_genera_excel(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        Order::factory()->count(3)->create();

        $response = $this->actingAs($admin)
                         ->get('/api/v1/reports/sells/export?format=xlsx');

        $response->assertStatus(200)
                 ->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }
}
```

---

## 6. Criterios de Aceptación

### Funcionalidades críticas (bloquean el cierre de F6)
- [ ] Dashboard muestra ventas del mes y gráfico de ventas diarias
- [ ] Exportación Excel de órdenes genera archivo descargable con todos los campos
- [ ] Importación Excel de productos crea registros en BD (modo Job async)
- [ ] Imágenes se suben a S3 y se muestran en el panel
- [ ] Agregar guía de envío a una orden dispara email al cliente
- [ ] Filtros de órdenes por estado y rango de fecha funcionan
- [ ] Reporte de ventas muestra totales por período

### Paridad funcional (verificar contra admin-itsocks/)
- [ ] Todas las funcionalidades del React Admin tienen equivalente en Filament
- [ ] Usuario admin puede completar todas las operaciones del flujo de negocio diario sin `admin-itsocks/`

### Criterios técnicos
- [ ] `php artisan test --filter=Filament` verde (incluye tests de la sección 5)
- [ ] `Queue::fake()` confirma que `ImportarProductosJob` se despacha correctamente
- [ ] `Storage::fake('s3')` confirma que imágenes se guardan sin tocar S3 real
- [ ] Panel accesible en `/admin` en producción
- [ ] Sin errores al ejecutar todas las acciones críticas

---

## 6. Fuera de Alcance

- Funcionalidades nuevas que no existen en React Admin (mejoras para después)
- API REST del panel (Filament es server-side)
- Migración de datos históricos del panel admin
- Configuración de roles granulares (más allá de admin/no-admin)
