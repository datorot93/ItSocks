---
nombre: "Fase 2 — API Laravel Completa"
version: "1.0"
fecha: "2026-04-23"
propietario: "daaltoto@gmail.com"
estado: "aprobado"
tipo: "spec-implementacion"
alcance: "itsocks-laravel/ — implementación completa de endpoints con paridad funcional 100% vs FastAPI"
agente: "agente-laravel-api-fase2"
rama: "feature/fase-2-laravel-api"
---

# Spec Fase 2: API Laravel Completa

## 1. Objetivo

Implementar todos los endpoints de la API de ItSocks en Laravel con **paridad funcional 100%** respecto al backend FastAPI. El frontend React actual debe seguir funcionando sin modificaciones después de que el tráfico se migre a Laravel en F3. Al finalizar F2, se ejecuta una suite de paridad automatizada que compara las respuestas de ambas APIs.

**Tiempo estimado:** 10 semanas  
**Prerrequisito:** F1 completada (modelos, migraciones, Sanctum, paquetes)

---

## 2. Estructura de Carpetas (Domain-Driven Design Táctico)

```
app/
├── Domain/
│   ├── Catalog/
│   │   ├── Models/          → Product, Category, Subcategory, Type, Design, Tag, Color, Size, Image
│   │   ├── Services/        → ProductCatalogService
│   │   └── Actions/         → ImportProductsFromExcel
│   ├── Commerce/
│   │   ├── Models/          → Order, Pack, DiscountCode, ProductOrder
│   │   ├── Services/        → OrderService, DiscountService, MercadoPagoService
│   │   └── Actions/         → CreateOrder, ApplyDiscount, ValidateDiscount
│   ├── Logistics/
│   │   ├── Models/          → Shipping
│   │   └── Services/        → ShippingCalculatorService
│   └── Marketing/
│       ├── Models/          → Slider, WishList, Customer
│       └── Services/        → WishListService, FacebookPixelService
├── Http/
│   ├── Controllers/Api/V1/  → Thin controllers (solo HTTP)
│   ├── Requests/            → Form Requests (validación)
│   └── Resources/           → API Resources (shapeo de respuesta)
├── Jobs/                    → ProductImportJob, SendOrderEmailJob
├── Events/                  → OrderCreated, ShippingGuideAdded
├── Listeners/               → SendOrderConfirmationEmail, SendShippingGuideEmail
└── Mail/                    → OrderConfirmation, ShippingGuideUpdated (Mailables)
```

---

## 3. Tabla de Equivalencia de Endpoints (FastAPI → Laravel)

### Autenticación
| Método | FastAPI | Laravel | Auth |
|--------|---------|---------|------|
| POST | `/api/v1/auth/login` | `/api/v1/auth/login` | Público |
| POST | `/api/v1/auth/logout` | `/api/v1/auth/logout` | `auth:sanctum` |
| GET | `/api/v1/auth/me` | `/api/v1/auth/me` | `auth:sanctum` |

### Catálogo (25 endpoints FastAPI → 1 + CRUD)
| Método | FastAPI | Laravel | Auth |
|--------|---------|---------|------|
| GET | 25 variantes de `/api/v1/products/...` | `/api/v1/products?filter[...]` | Público |
| GET | `/api/v1/products/{id}` | `/api/v1/products/{id}` | Público |
| POST | `/api/v1/products` | `/api/v1/products` | Admin |
| PUT | `/api/v1/products/{id}` | `/api/v1/products/{id}` | Admin |
| DELETE | `/api/v1/products/{id}` | `/api/v1/products/{id}` | Admin |
| GET | `/api/v1/categories` | `/api/v1/categories` | Público |
| POST/PUT/DELETE | `/api/v1/categories/...` | `/api/v1/categories/...` | Admin |
| GET | `/api/v1/subcategories` | `/api/v1/subcategories` | Público |
| GET | `/api/v1/types` | `/api/v1/types` | Público |
| GET | `/api/v1/designs` | `/api/v1/designs` | Público |
| GET | `/api/v1/tags` | `/api/v1/tags` | Público |
| GET | `/api/v1/colors` | `/api/v1/colors` | Público |
| GET | `/api/v1/sizes` | `/api/v1/sizes` | Público |

### Imágenes
| Método | FastAPI | Laravel | Auth |
|--------|---------|---------|------|
| POST | `/api/v1/images` | `/api/v1/images` | Admin |
| DELETE | `/api/v1/images/{id}` | `/api/v1/images/{id}` | Admin |

### Órdenes
| Método | FastAPI | Laravel | Auth |
|--------|---------|---------|------|
| POST | `/api/v1/orders` | `/api/v1/orders` | Público |
| GET | `/api/v1/orders` | `/api/v1/orders` | Admin |
| GET | `/api/v1/orders/{id}` | `/api/v1/orders/{id}` | Admin |
| PUT | `/api/v1/orders/{id}` | `/api/v1/orders/{id}` | Admin |
| POST | `/api/v1/orders/{id}/shipping` | `/api/v1/orders/{id}/shipping-guide` | Admin |

### Pagos
| Método | FastAPI | Laravel | Auth |
|--------|---------|---------|------|
| POST | `/api/v1/payments/preference` | `/api/v1/payments/preference` | Público |
| POST | `/api/v1/payments/webhook` | `/api/v1/payments/webhook` | IP Whitelist MP |

### Packs, Descuentos, WishList, Envíos
| Módulo | Endpoints | Auth |
|--------|-----------|------|
| Packs | CRUD `/api/v1/packs` | GET público, escritura admin |
| Descuentos | `POST /api/v1/discount-codes/validate` | Público |
| Descuentos CRUD | `/api/v1/discount-codes` | Admin |
| WishList | GET/POST/DELETE `/api/v1/wishlists` | Público por token |
| Envíos | GET `/api/v1/shippings`, GET `/{municipio}` | Público |
| Envíos CRUD | `/api/v1/shippings` | Admin |

### Importación y Reportes
| Módulo | Endpoint | Auth |
|--------|---------|------|
| Importación Excel | POST `/api/v1/files/import` | Admin |
| Reporte ventas | GET `/api/v1/reports/sells` | Admin |
| Exportar reporte | GET `/api/v1/reports/sells/export` | Admin |
| Bulk precios | POST `/api/v1/bulk/prices` | Admin |
| Bulk tarifas | POST `/api/v1/bulk/shipping-rates` | Admin |
| Facebook Pixel | POST `/api/v1/pixels/purchase` | Público |
| Sliders | GET `/api/v1/sliders` | Público |
| Sliders CRUD | `/api/v1/sliders` | Admin |

---

## 4. Implementación del Módulo de Catálogo (spatie/query-builder)

Este es el módulo más importante. Los 25+ endpoints de filtro de FastAPI se consolidan en 1:

```php
// routes/api.php
Route::get('/products', [ProductController::class, 'index']);

// app/Http/Controllers/Api/V1/ProductController.php
public function index(Request $request): AnonymousResourceCollection
{
    $products = QueryBuilder::for(Product::class)
        ->allowedFilters([
            AllowedFilter::exact('compresion'),
            AllowedFilter::exact('type_id'),
            AllowedFilter::exact('design_id'),
            AllowedFilter::scope('byCategory', 'category'),
            AllowedFilter::scope('bySubcategory', 'subcategory'),
            AllowedFilter::scope('byTag', 'tag'),
            AllowedFilter::custom('search', new ProductSearchFilter()),
        ])
        ->allowedIncludes(['images', 'sizes', 'colors', 'design', 'type', 'subcategory', 'tags'])
        ->allowedSorts(['price', 'name', 'created_at'])
        ->with($request->get('include', []))
        ->paginate($request->integer('per_page', 20));

    return ProductResource::collection($products);
}
```

**Scopes en el modelo Product:**
```php
public function scopeByCategory(Builder $query, string $category): Builder
{
    return $query->whereHas('subcategory.category', fn($q) => $q->where('name', $category));
}

public function scopeBySubcategory(Builder $query, string $subcategory): Builder
{
    return $query->whereHas('subcategory', fn($q) => $q->where('name', $subcategory));
}
```

---

## 5. Service Classes — Firmas de Métodos

### OrderService
```php
class OrderService
{
    public function create(array $validated): Order;
    public function updateStatus(Order $order, string $status): Order;
    public function addShippingGuide(Order $order, string $trackingNumber): Order;
}
```

### OrderNotificationService
```php
class OrderNotificationService
{
    public function sendOrderConfirmation(Order $order): void;  // via Queue
    public function sendShippingGuide(Order $order): void;     // via Queue
    public function sendAdminNotification(Order $order): void; // via Queue
}
```

### MercadoPagoService
```php
class MercadoPagoService
{
    public function createPreference(Order $order): string;  // retorna preference_id
    public function handleWebhook(array $payload): void;
    public function getPaymentStatus(string $paymentId): string;
}
```

### DiscountService
```php
class DiscountService
{
    public function validate(string $code, float $subtotal): array;  // ['valid' => bool, 'discount' => float]
    public function apply(Order $order, string $code): Order;
}
```

### ShippingCalculatorService
```php
class ShippingCalculatorService
{
    public function getRate(string $municipio): float;
    public function getByDepartamento(string $departamento): Collection;
}
```

---

## 6. Patrón de Tests de Feature HTTP

Crear tests que verifiquen que Laravel retorna las mismas respuestas que FastAPI:

```php
// tests/Feature/Api/ProductTest.php
class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_productos_paginada(): void
    {
        Product::factory()->count(25)->create();

        $response = $this->getJson('/api/v1/products?per_page=10');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [['id', 'name', 'price', 'compresion']],
                     'links' => ['first', 'last', 'next', 'prev'],
                     'meta' => ['total', 'per_page', 'current_page', 'last_page'],
                 ])
                 ->assertJsonCount(10, 'data');
    }

    public function test_filtrar_por_subcategoria(): void
    {
        $subcategory = Subcategory::factory()->create(['name' => 'pantorrilleras']);
        Product::factory()->count(3)->create(['subcategory_id' => $subcategory->id]);
        Product::factory()->count(2)->create(); // otras subcategorías

        $response = $this->getJson('/api/v1/products?filter[subcategory]=pantorrilleras');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    public function test_crear_producto_requiere_autenticacion(): void
    {
        $response = $this->postJson('/api/v1/products', ['name' => 'Test']);
        $response->assertStatus(401);
    }
}
```

---

## 7. Suite de Paridad Automatizada

Crear script para comparar Laravel vs FastAPI en staging:

```bash
# tests/parity/parity_suite.sh
#!/bin/bash
FASTAPI="http://staging:8888/api/v1"
LARAVEL="http://localhost:8000/api/v1"
FAILURES=0

check_endpoint() {
    local endpoint=$1
    local params=${2:-""}

    fastapi_data=$(curl -sf "$FASTAPI/$endpoint$params" | jq -r '.data | length')
    laravel_data=$(curl -sf "$LARAVEL/$endpoint$params" | jq -r '.data | length')

    if [ "$fastapi_data" != "$laravel_data" ]; then
        echo "FALLA: $endpoint | FastAPI: $fastapi_data | Laravel: $laravel_data"
        FAILURES=$((FAILURES + 1))
    else
        echo "OK: $endpoint ($fastapi_data items)"
    fi
}

check_endpoint "products" "?per_page=20"
check_endpoint "categories"
check_endpoint "shippings"
check_endpoint "packs"

echo "---"
echo "Fallos: $FAILURES"
exit $FAILURES
```

---

## 8. Orden de Implementación de Módulos

| Orden | Módulo | Duración estimada | Complejidad |
|-------|--------|------------------|-------------|
| 1 | Autenticación (Sanctum) | 3 días | Baja |
| 2 | Catálogo solo lectura (Query Builder) | 5 días | Alta |
| 3 | CRUD de catálogo (admin) | 4 días | Baja |
| 4 | Imágenes (S3 + Media Library) | 4 días | Media |
| 5 | Órdenes + OrderService + emails Queue | 8 días | Alta |
| 6 | Pagos MercadoPago | 5 días | Media |
| 7 | Packs | 3 días | Baja |
| 8 | Descuentos | 3 días | Media |
| 9 | WishList | 3 días | Baja |
| 10 | Envíos | 2 días | Baja |
| 11 | Importación Excel (Job) | 8 días | Muy Alta |
| 12 | Reportes de ventas | 5 días | Alta |
| 13 | Bulk operations + Facebook Pixel | 4 días | Media |

---

## 9. Cache para Endpoints de Solo Lectura

```php
// Catálogo de referencia: Cache 10 minutos
public function getCategories(): Collection
{
    return Cache::remember('categories', 600, fn() => Category::all());
}

public function getTypes(): Collection
{
    return Cache::remember('types', 600, fn() => Type::with('subcategory')->get());
}
```

---

## 10. Criterios de Aceptación

| Criterio | Cómo verificar |
|----------|---------------|
| 100% de endpoints implementados | Lista de rutas: `php artisan route:list \| grep api/v1 \| wc -l` ≥ número de endpoints FastAPI |
| Tests de Feature al 100% | `php artisan test --coverage` ≥ 90% en controllers y services |
| Suite de paridad verde | `bash tests/parity/parity_suite.sh` retorna 0 fallos |
| Emails asincrónicos | `php artisan queue:work` procesa jobs de email sin errores |
| Importación Excel funciona | Subir archivo Excel de prueba → productos creados en BD |
| MercadoPago en sandbox | Flujo de pago completo en cuenta sandbox sin errores |

---

## 11. Fuera de Alcance

- Construcción del frontend Vue 3 (F4)
- Cutover de tráfico a producción (F3)
- Funcionalidades avanzadas del panel Filament (F6)
- Optimizaciones de performance avanzadas (índices de BD, query optimization) — a implementar en base al monitoreo de F3
