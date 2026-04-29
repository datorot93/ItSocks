# Estado Implementación F6 — Filament Admin

## Fecha: 2026-04-28

## Resources implementados (19 total)

### Catálogo
1. `ProductResource` — Formulario con checkboxes colores/tallas, galería de imágenes, filtros
2. `CategoryResource` — CRUD básico con contador de subcategorías
3. `SubcategoryResource` — Select de categoría padre
4. `TypeResource` — CRUD básico
5. `DesignResource` — CRUD con código
6. `TagResource` — CRUD básico
7. `ColorResource` — CRUD básico
8. `SizeResource` — CRUD básico
9. `TypeImageResource` — Con preview de imagen S3

### Comercio
10. `OrderResource` — Filtros fecha+estado, acción "Agregar guía", ExportBulkAction (OrderExporter)
11. `PackResource` — CRUD con imagen S3
12. `DiscountCodeResource` — Generación automática de código, badge tipo
13. `ProductOrderResource` — Vista de líneas de orden

### Logística
14. `ShippingResource` — Filtro por departamento

### Marketing
15. `SliderResource` — reorderable por prioridad
16. `SizeGuideResource` — CRUD con imagen
17. `CustomerResource` — Vista clientes
18. `WishListResource` — Solo lectura (view + delete)

### Administración
19. `UserResource` — CRUD con asignación de roles (Spatie)

## Páginas especiales (2)
- `ImportarProductos` — FileUpload -> ProductImportJob (async)
- `ReporteVentas` — Filtros fecha, tabla, exportar Excel (SellsReportExport)

## Widgets (2)
- `VentasStatsWidget` — 4 stats: ventas mes, órdenes mes, pendientes, productos activos
- `VentasDiariasWidget` — Gráfico línea últimos 30 días (no canceladas)

## Exporters (1)
- `OrderExporter` — 23 columnas, formato Filament Exporter nativo

## Tests creados (4 archivos)
- `ProductImportTest` — Queue::fake, Job directo, Excel inválido, fixtures
- `ProductImageTest` — Storage::fake('s3'), upload, delete
- `DashboardTest` — Dashboard acceso, stats, recursos accesibles
- `OrderResourceTest` — Lista, filtros, addShippingGuide, exportar

## Fixtures Excel
- `tests/fixtures/product_import_valid.xlsx` — 10 productos válidos (Python/openpyxl)
- `tests/fixtures/product_import_invalid.xlsx` — Columnas incorrectas

## Mapeo Excel → BD (ProductsImport)
| Columna Excel | Campo BD |
|---|---|
| nombre/name | product.name |
| precio/price | product.price |
| categoria | category.name (firstOrCreate) |
| subcategoria | subcategory.name (firstOrCreate) |
| tipo | type.name (firstOrCreate) |
| disenio/diseno | design.name (firstOrCreate) |
| compresion | product.compresion (bool) |
| activo/state | product.state (bool) |
| codigo/code | product.code (Str::slug fallback) |

## Stash aplicado
- `stash@{0}` — UserSeeder con Spatie Permission rol admin aplicado a main

## Decisiones de navegación
- Grupos: Catálogo, Comercio, Logística, Marketing, Reportes, Administración
- ProductOrderResource → Comercio (no Catálogo, tiene contexto de orden)
- WishListResource → Marketing (solo lectura, sin create/edit)
- UserResource → Administración

## Funcionalidades React Admin cubiertas
- [x] Order list/edit con filtros
- [x] Order export Excel
- [x] Shipping guide action
- [x] Product create/edit con imágenes
- [x] Categories CRUD
- [x] Bulk import products
- [x] Sells report con export
- [x] Discount code generate
- [x] Users admin
- [x] Sliders marketing
- [x] Size guides marketing
- [x] BulkPrices → ImportarProductos page
- [x] SellsReport → ReporteVentas page
- [x] TypeImages resource

## Bloqueadores encontrados
- PHP no disponible en el entorno de desarrollo (macOS), no se pudieron ejecutar tests directamente
- El fixture generator.php se reemplazó con generador Python
- ExportBulkAction requiere `filament/actions` v3 con Exporter nativo (no Maatwebsite directo)
- BadgeColumn en F1 usaba API antigua; migrado a `.badge()` en TextColumn
