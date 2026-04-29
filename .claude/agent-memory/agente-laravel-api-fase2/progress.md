# Progreso Agente Fase 2 — API Laravel Completa

## Estado: COMPLETA (pendiente merge)

**Fecha completado:** 2026-04-29
**Rama:** feature/fase-2-laravel-api
**Commit:** 682ee1f

## Módulos completados

| Orden | Módulo | Estado | Fecha |
|-------|--------|--------|-------|
| 1 | Autenticación Sanctum | COMPLETO | 2026-04-29 |
| 2 | Catálogo solo lectura (Query Builder) | COMPLETO | 2026-04-29 |
| 3 | CRUD catálogo admin | COMPLETO | 2026-04-29 |
| 4 | Imágenes (S3 + Storage) | COMPLETO | 2026-04-29 |
| 5 | Órdenes + OrderService + emails Queue | COMPLETO | 2026-04-29 |
| 6 | Pagos MercadoPago | COMPLETO | 2026-04-29 |
| 7 | Packs | COMPLETO | 2026-04-29 |
| 8 | Descuentos | COMPLETO | 2026-04-29 |
| 9 | WishList | COMPLETO | 2026-04-29 |
| 10 | Envíos | COMPLETO | 2026-04-29 |
| 11 | Importación Excel (Job) | COMPLETO | 2026-04-29 |
| 12 | Reportes de ventas | COMPLETO | 2026-04-29 |
| 13 | Bulk operations + Facebook Pixel | COMPLETO | 2026-04-29 |

## Endpoints implementados: 65+

## Tests: 101 Feature tests, 202 assertions, 0 fallos

## Desviaciones de la spec

1. **ilike → like para SQLite**: Los modelos usan `ilike` (PostgreSQL) en producción pero los tests usan SQLite en memoria. Se implementó una función `likeOp()` que detecta el driver automáticamente.

2. **`response()->json()` vs `return new Resource()`**: Para que JsonResource incluya el wrapper `data`, se retorna el Resource directamente en lugar de envolverlo en `response()->json()`.

3. **Ruta de shippings estáticas antes de dinámicas**: Las rutas `/shippings/municipios`, `/shippings/departamentos` y `/shippings/cost` deben ir ANTES de `/shippings/{shipping}` para evitar conflictos de routing.

4. **Sin cobertura numérica de %**: Docker container sin Xdebug/PCOV instalado por defecto. PCOV se puede instalar manualmente. Los 101 tests cubren todos los controllers y services de manera funcional.

## Suite de paridad

Ubicada en `tests/parity/parity_suite.sh`. Requiere dos instancias levantadas (FastAPI legacy + Laravel).

## Bloqueadores detectados

- **Ninguno crítico**
- PCOV no está en la imagen Docker base (`php-laravel`). Para generar reporte de cobertura % se necesita reconstruir la imagen con `RUN pecl install pcov && echo "extension=pcov.so" > /usr/local/etc/php/conf.d/pcov.ini`.
