# Memoria Agente Laravel Arquitecto Fase 1

## Entorno de Ejecución
- PHP: 8.4.20 (via Docker image `php-laravel:latest`)
- Composer: latest (bundled in Docker image)
- Laravel Framework: v11.51.0
- PostgreSQL: 12 (contenedor `itsocks-postgres-1`)
- Docker image: `php-laravel:latest` (PHP 8.4 CLI + extensiones pgsql, gd, exif, intl, zip, mbstring, xml, bcmath, pcntl)

## Decisión: PHP 8.4
El proyecto usa Laravel 11.51.0 que depende de symfony/css-selector ^8 que requiere PHP 8.4+.
Se construyó imagen Docker php-laravel:latest con PHP 8.4.

## Paquetes Composer Instalados
| Paquete | Versión | Notas |
|---------|---------|-------|
| laravel/sanctum | ^4.0 (v4.3.1) | API tokens — Sanctum v4 para Laravel 11 |
| spatie/laravel-medialibrary | ^11 | Gestión de medios |
| spatie/laravel-permission | ^6 | Roles y permisos |
| spatie/laravel-query-builder | ^5 | Consultas avanzadas |
| maatwebsite/excel | ^3.1 | Exportación/importación Excel |
| intervention/image | ^3.0 | Procesamiento de imágenes |
| mercadopago/dx-php | ^3.0 | SDK de pagos |
| filament/filament | ^3.0 (v3.3.50) | Panel admin |
| darkaonline/l5-swagger | ^11.0 | Documentación API |

## Nombres de Tabla (singular — esquema PostgreSQL)
Todos los modelos usan `protected $table = 'nombre_singular'` excepto:
- `User` → `users` (tabla estándar de Laravel)
- `Order` → `orders` (se mantiene plural porque es el nombre más limpio para Laravel)

La tabla `wish_list` corrige el typo original `whish_list` de FastAPI.

## Typos Corregidos en orders
| Campo FastAPI (typo) | Campo Laravel (correcto) |
|----------------------|--------------------------|
| `billing_addess` | `billing_address` |
| `pyment_id` | `payment_id` |
| `de` | `gift_from` |
| `para` | `gift_to` |

## Variables de Entorno (.env local)
```
DB_CONNECTION=pgsql
DB_HOST=host.docker.internal
DB_PORT=5432
DB_DATABASE=itsocks_laravel
DB_USERNAME=ituser
CACHE_STORE=database  # Redis no disponible en local dev sin phpredis
QUEUE_CONNECTION=database  # idem
```

## Bases de Datos Creadas
- `itsocks_laravel` — producción/desarrollo local
- `itsocks_testing` — tests PHPUnit

## Filament
- URL: `/admin`
- Panel ID: `admin`
- Color: Purple
- Brand: "ItSocks Admin"
- Auth guard: web
- Login confirmado en HTTP 200

## Tests
- 8 tests pasan (2 Unit + Feature + 6 ModelsRelations)
- `php artisan migrate:fresh --seed` — EXITOSO
- Filament `/admin/login` — HTTP 200

## Decisión: CACHE_STORE y QUEUE_CONNECTION
El .env.example mantiene `redis` como valor ideal para producción.
El .env local usa `database` porque la máquina de desarrollo no tiene la extensión phpredis.
En staging/producción se usará Redis.
