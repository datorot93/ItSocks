---
nombre: "Fase 1 — Scaffolding y Modelado Laravel"
version: "1.0"
fecha: "2026-04-23"
propietario: "daaltoto@gmail.com"
estado: "aprobado"
tipo: "spec-implementacion"
alcance: "itsocks-laravel/ — creación del proyecto Laravel 11 con modelos, migraciones, paquetes, seeders y Filament básico"
agente: "agente-laravel-arquitecto-fase1"
rama: "feature/fase-1-laravel-scaffolding"
---

# Spec Fase 1: Scaffolding y Modelado Laravel

## 1. Objetivo

Crear el proyecto `itsocks-laravel/` con todos los modelos Eloquent, migraciones (corrigiendo los typos del esquema actual), configuración de infraestructura (S3, Mail, Redis, Sanctum) y un panel Filament básico funcional. Esta fase no implementa lógica de endpoints — ese es el trabajo de F2.

**Tiempo estimado:** 6 semanas  
**Prerrequisito:** F0 completada (opcional pero recomendado)

---

## 2. Estructura del Proyecto Laravel

```
itsocks-laravel/
├── app/
│   ├── Models/          → 27 modelos Eloquent
│   ├── Http/
│   │   └── Controllers/ → Solo Auth en esta fase
│   └── Filament/
│       └── Resources/   → 17 resources básicos
├── database/
│   ├── migrations/      → 27 migraciones en orden de dependencia
│   └── seeders/         → 8 seeders de datos de referencia
├── config/              → filesystems, mail, queue, sanctum
├── resources/views/
│   └── emails/          → Blade templates para emails
├── routes/
│   ├── api.php          → Solo auth routes en esta fase
│   └── web.php
├── composer.json
└── .env.example
```

---

## 3. Comando de Creación del Proyecto

```bash
cd /Users/datorot/Documents/Projects/ItSocks
composer create-project laravel/laravel itsocks-laravel "^11.0"
cd itsocks-laravel
git init
git checkout -b feature/fase-1-laravel-scaffolding
```

---

## 4. Paquetes Composer a Instalar

```bash
# Autenticación API
composer require laravel/sanctum

# Media y archivos
composer require spatie/laravel-medialibrary "^11"
composer require intervention/image "^3.0"

# Consultas avanzadas
composer require spatie/laravel-query-builder "^5"

# Roles y permisos
composer require spatie/laravel-permission "^6"

# Excel
composer require maatwebsite/excel "^3.1"

# MercadoPago SDK PHP
composer require mercadopago/dx-php "^3.0"

# Panel de administración
composer require filament/filament "^3.0"

# Documentación API (para usar durante el desarrollo)
composer require darkaonline/l5-swagger "^8.0"

# Publicar configuraciones
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan filament:install --panels
```

---

## 5. Lista de Modelos y Migraciones

### Orden de creación (respetar foreign keys)

#### Grupo 1 — Entidades independientes
| Modelo | Tabla | Campos principales |
|--------|-------|--------------------|
| `Category` | `category` | `id`, `name`, `slug` |
| `Design` | `design` | `id`, `name`, `image_url` |
| `Color` | `color` | `id`, `name`, `hex_code` |
| `Size` | `size` | `id`, `name`, `description` |
| `Tag` | `tag` | `id`, `name` |

#### Grupo 2 — Jerarquía de catálogo
| Modelo | Tabla | Relaciones |
|--------|-------|-----------|
| `Subcategory` | `subcategory` | `belongsTo(Category)` |
| `Type` | `type` | `belongsTo(Subcategory)` |

#### Grupo 3 — Producto y relaciones
| Modelo | Tabla | Relaciones |
|--------|-------|-----------|
| `Product` | `product` | `belongsTo(Subcategory, Type, Design)`, `belongsToMany(Color, Size, Tag)` |
| `ProductColor` | `product_color` | pivot: product_id, color_id |
| `ProductSize` | `product_size` | pivot: product_id, size_id |
| `TagProduct` | `tag_product` | pivot: tag_id, product_id |
| `Image` | `image` | `belongsTo(Product)` |
| `TypeImage` | `type_image` | `belongsTo(Type)` |
| `Preview` | `preview` | `belongsTo(Product)` |

#### Grupo 4 — Usuarios y clientes
| Modelo | Tabla | Notas |
|--------|-------|-------|
| `User` | `users` | Admin solamente. Usa tabla estándar de Laravel. |
| `Customer` | `customer` | Clientes del storefront (separado de User) |

#### Grupo 5 — Comercio
| Modelo | Tabla | Relaciones |
|--------|-------|-----------|
| `Pack` | `pack` | `belongsToMany(Product)` |
| `DiscountCode` | `discount_code` | campos: code, discount_type, value, expires_at, is_active |
| `Order` | `orders` | Ver columnas corregidas abajo |
| `ProductOrder` | `product_order` | `belongsTo(Order, Product, Pack)`, quantity, reference |

#### Grupo 6 — Logística y marketing
| Modelo | Tabla | Notas |
|--------|-------|-------|
| `Shipping` | `shipping` | municipio, departamento, tarifa |
| `Slider` | `slider` | imagen, link, orden |
| `SizeGuide` | `size_guide` | categoría, imagen |
| `WishList` | `wish_list` | token público, created_by |
| `WishListProduct` | `wish_list_product` | pivot: wish_list_id, product_id |

---

## 6. Corrección de Typos en la Tabla `orders` (OBLIGATORIO)

Estas columnas tienen errores tipográficos en el esquema actual de FastAPI. Las migraciones Laravel **DEBEN** usar los nombres corregidos:

| Columna con typo (FastAPI) | Columna correcta (Laravel) |
|---------------------------|---------------------------|
| `billing_addess` | `billing_address` |
| `pyment_id` | `payment_id` |
| `de` | `gift_from` |
| `para` | `gift_to` |

**Migración de la tabla `orders`:**
```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->string('customer_name');
    $table->string('email');
    $table->string('phone');
    $table->string('document')->nullable();
    $table->string('document_type')->nullable();
    $table->string('shipping_city');
    $table->string('shipping_department')->nullable();
    $table->string('shipping_address');
    $table->string('billing_address')->nullable();    // ← corregido de billing_addess
    $table->string('payment_id')->nullable();          // ← corregido de pyment_id
    $table->string('preference_id')->nullable();
    $table->string('gift_from')->nullable();           // ← corregido de 'de'
    $table->string('gift_to')->nullable();             // ← corregido de 'para'
    $table->boolean('is_gift')->default(false);
    $table->string('gift_message')->nullable();
    $table->decimal('subtotal', 10, 2)->default(0);
    $table->decimal('shipping_cost', 10, 2)->default(0);
    $table->decimal('discount_amount', 10, 2)->default(0);
    $table->decimal('total', 10, 2);
    $table->string('status')->default('pending');
    $table->string('tracking_number')->nullable();
    $table->timestamps();
});
```

**Nota:** Como Laravel coexistirá con FastAPI durante F3, la BD compartida tendrá las columnas con los nombres CORREGIDOS. FastAPI deberá poder leer ambas versiones (las viejas del historial y las nuevas en staging). Para evitar conflictos, Laravel corre en una BD de staging separada hasta el cutover.

---

## 7. Patrones de Código para Modelos

### Modelo estándar (ejemplo: Product)
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    // Nombre singular — esquema PostgreSQL actual no usa plurales
    protected $table = 'product';

    protected $fillable = [
        'name', 'slug', 'description', 'price', 'compresion',
        'design_id', 'type_id', 'subcategory_id', 'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compresion' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function design(): BelongsTo
    {
        return $this->belongsTo(Design::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(Type::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    public function sizes(): BelongsToMany
    {
        return $this->belongsToMany(Size::class, 'product_size');
    }

    public function colors(): BelongsToMany
    {
        return $this->belongsToMany(Color::class, 'product_color');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'tag_product');
    }
}
```

---

## 8. Configuración de Infraestructura

### S3 (`config/filesystems.php`)
```php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'bucket' => env('AWS_BUCKET'),
    'url' => env('AWS_URL'),
    'endpoint' => env('AWS_ENDPOINT'),
    'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
    'visibility' => 'public',
],
```

### Mail (`config/mail.php`)
```php
'smtp' => [
    'transport' => 'smtp',
    'host' => env('MAIL_HOST', 'smtp.gmail.com'),
    'port' => env('MAIL_PORT', 587),
    'encryption' => env('MAIL_ENCRYPTION', 'tls'),
    'username' => env('MAIL_USERNAME'),
    'password' => env('MAIL_PASSWORD'),
],
```

### Queue con Redis
```
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

## 9. Blade Templates para Emails

Crear los equivalentes de los templates HTML generados en `orders.py` de FastAPI:

- `resources/views/emails/order-confirmation.blade.php` — confirmación de orden al cliente
- `resources/views/emails/shipping-guide.blade.php` — notificación de guía de envío
- `resources/views/emails/order-admin-notification.blade.php` — alerta al admin cuando llega nueva orden

---

## 10. Seeders de Referencia

| Seeder | Contenido |
|--------|-----------|
| `CategorySeeder` | Mínimo: Medias, Accesorios |
| `SubcategorySeeder` | Cortas, Pantorrilleras, Largas, Tobilleras |
| `TypeSeeder` | Estampadas, Tejidas, Personalizadas, Compresión |
| `DesignSeeder` | 5-10 diseños de ejemplo |
| `ColorSeeder` | 10 colores estándar (negro, blanco, gris, azul, rojo, verde, etc.) |
| `SizeSeeder` | Única, Infantil (21-27), Junior (27-33), Dama (35-38), Caballero (39-42) |
| `ShippingSeeder` | 32 departamentos de Colombia + municipios principales, tarifas en COP |
| `UserSeeder` | 1 usuario admin: admin@itsocks.co / password: secret |

---

## 11. Filament — Resources Básicos (F1)

Solo crear el scaffold mínimo. La funcionalidad avanzada va en F6.

```bash
php artisan make:filament-resource Product --generate
php artisan make:filament-resource Order --generate
php artisan make:filament-resource Category --generate
# ... (resto de los 17 resources principales)
```

Panel accesible en `/admin`.

---

## 12. Archivo `.env.example`

```
APP_NAME="ItSocks Laravel"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=itsocks_laravel
DB_USERNAME=postgres
DB_PASSWORD=

CACHE_STORE=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@itsocks.co
MAIL_FROM_NAME="ItSocks"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=

FILAMENT_AUTH_GUARD=web
```

---

## 13. Criterios de Aceptación

| Criterio | Cómo verificar |
|----------|---------------|
| Proyecto crea sin errores | `composer create-project` completa sin errores |
| Migraciones sin typos | Las columnas `billing_address`, `payment_id`, `gift_from`, `gift_to` existen en la BD |
| Migraciones corren sin error | `php artisan migrate:fresh --seed` sin excepciones |
| Seeders populan datos | `php artisan db:seed` → tablas con datos de referencia |
| Filament accesible | Navegador en `/admin` muestra login de Filament |
| CRUD básico funciona | Crear, listar, editar y eliminar un producto desde Filament sin errores 500 |
| Tests de relaciones | `php artisan test` (tests de modelos) verdes |

---

## 14. Fuera de Alcance

- Implementación de endpoints API (F2)
- Implementación avanzada de Filament (dashboard, exportaciones) — F6
- Conexión con el frontend React actual
- Configuración de producción (servidores AWS) — F3
