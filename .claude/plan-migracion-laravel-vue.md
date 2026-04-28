# Plan Maestro de Migración: ItSocks → Laravel 11 + Vue 3

**Versión:** 1.0  
**Fecha de inicio:** 2026-04-23  
**Duración estimada:** 9 meses (~36 semanas)  
**Stack origen:** FastAPI + React 18 + React Admin 5  
**Stack destino:** Laravel 11 + Vue 3 + Filament 3  

---

## Mapa de Fases

| Fase | Nombre | Semanas | Agente | Spec | Rama Git |
|------|--------|---------|--------|------|----------|
| F0 | Saneamiento de Seguridad | 1–2 | `agente-seguridad-fase0` | `fase-0-saneamiento-seguridad.spec.md` | `feature/fase-0-seguridad` |
| F1 | Scaffolding y Modelado Laravel | 3–8 | `agente-laravel-arquitecto-fase1` | `fase-1-scaffolding-laravel.spec.md` | `feature/fase-1-laravel-scaffolding` |
| F2 | API Laravel Completa | 9–18 | `agente-laravel-api-fase2` | `fase-2-api-laravel-completa.spec.md` | `feature/fase-2-laravel-api` |
| F3 | Cutover Backend | 19 | `agente-devops-cutover` | `fase-3-cutover-backend.spec.md` | `feature/fase-3-cutover-backend` |
| F4 | Frontend Vue 3 | 20–30 | `agente-vue3-frontend-fase4` | `fase-4-frontend-vue3.spec.md` | `feature/fase-4-vue3-frontend` |
| F5 | Cutover Frontend | 31–32 | `agente-devops-cutover` | `fase-5-cutover-frontend.spec.md` | `feature/fase-5-cutover-frontend` |
| F6 | Admin Panel Filament (finalización) | 33–36 | `agente-filament-admin-fase6` | `fase-6-filament-admin.spec.md` | `feature/fase-6-filament-admin` |

---

## Diagrama de Dependencias

```
F0 (seguridad)
    ↓
F1 (scaffolding Laravel)
    ↓              ↓
F2 (API laravel)  F6 (Filament — paralelo con F4)
    ↓
F3 (cutover backend)
    ↓
F4 (Vue 3 frontend)
    ↓
F5 (cutover frontend)
```

**Regla:** Cada fase depende de la anterior. F6 puede iniciarse en paralelo con F4 una vez que F2 esté completa.

---

## Criterios de Entrada y Salida por Fase

### Fase 0 — Saneamiento de Seguridad
- **Entrada:** Repositorio en estado actual (secrets hardcodeados, auth comentada)
- **Salida:** Sin secrets en código. CORS restringido. Auth habilitada. Rama mergeada a main.

### Fase 1 — Scaffolding Laravel
- **Entrada:** F0 completada. Laravel instalado localmente (`php 8.2+`, `composer`).
- **Salida:** Proyecto `itsocks-laravel/` con 27 modelos, migraciones sin typos, Filament accesible, seeders funcionales.

### Fase 2 — API Laravel Completa
- **Entrada:** F1 completada. PostgreSQL en staging accesible desde Laravel.
- **Salida:** 100% de endpoints implementados. Suite de paridad con FastAPI verde. Tests de Feature al 100%.

### Fase 3 — Cutover Backend
- **Entrada:** F2 completada y validada en staging durante al menos 72h. Backup de BD confirmado. Ejecutar `/parity-check` y confirmar 0 fallos antes de escalar tráfico.
- **Salida:** 100% del tráfico en producción sobre Laravel. FastAPI en standby 7 días. Monitorear con `/cutover-monitor` hasta error rate < 0.1% sostenido por 1h.

### Fase 4 — Frontend Vue 3
- **Entrada:** F3 completada. API Laravel estable en producción.
- **Salida:** Storefront Vue 3 con paridad funcional. Lighthouse ≥ 80 mobile. Ejecutar `/playwright-e2e all` y confirmar 8 tests E2E verdes.

### Fase 5 — Cutover Frontend
- **Entrada:** F4 completada y validada en staging. Redirects 301 configurados. Ejecutar `/playwright-e2e all` y confirmar 8 tests verdes antes de escalar tráfico.
- **Salida:** 100% del tráfico sobre Vue 3. Monitorear con `/cutover-monitor` hasta métricas de conversión ≥ baseline React.

### Fase 6 — Admin Filament (finalización)
- **Entrada:** F2 completada (puede correr en paralelo con F4).
- **Salida:** Panel Filament con paridad funcional vs `admin-itsocks/`. React Admin deprecado.

---

## Convenciones Técnicas del Proyecto

### Ramas Git
- Formato: `feature/fase-{N}-{nombre-corto}`
- Ejemplos: `feature/fase-0-seguridad`, `feature/fase-2-laravel-api`
- Cada fase vive en su propia rama hasta el PR a main.

### Commits
- Idioma: español
- Formato: descripción concisa en presente + co-autoría de Claude
- Ejemplo: `Mover credenciales SMTP a variables de entorno`

### Pull Requests
- Crear via MCP GitHub (`mcp__github__create_pull_request`)
- Ejecutar skill `/github-pr-changelog` después de crear el PR
- Base siempre: `main`

### Criterio de cierre de fase
1. Tests pasan (`pytest` / `php artisan test` / `npm run test`)
2. PR aprobado y mergeado a `main`
3. Agente reporta cobertura y criterios de aceptación cumplidos

---

## Decisiones Arquitectónicas Clave

### Corrección de Typos en Esquema de BD

| Campo actual (typo) | Campo corregido | Tabla |
|---------------------|-----------------|-------|
| `billing_addess` | `billing_address` | `orders` |
| `pyment_id` | `payment_id` | `orders` |
| `de` | `gift_from` | `orders` |
| `para` | `gift_to` | `orders` |

### Consolidación de Endpoints de Productos
- FastAPI tiene 25+ endpoints de filtro para productos.
- Laravel los reemplaza con **1 endpoint** usando `spatie/laravel-query-builder`.
- Ver spec F2 para implementación detallada.

### Migración del Sistema de Rutas Frontend
- React: `ItSocksRoutes.jsx` con 743 líneas y 80+ rutas declarativas.
- Vue 3: ~15 rutas paramétricas anidadas con Vue Router 4.
- Ver spec F4 para tabla de equivalencia.

### Tablas de Nombres Singulares (Eloquent)
- El esquema PostgreSQL actual usa nombres singulares (`product`, `order`).
- Eloquent espera plurales por defecto.
- Solución: definir `protected $table = 'product'` explícitamente en cada modelo, **sin renombrar las tablas** (para evitar riesgos durante coexistencia).

### Panel de Administración
- React Admin 5 (`admin-itsocks/`) → Filament 3 integrado en el proyecto Laravel.
- Elimina la necesidad de un frontend separado para administración.
- Scaffold básico en F1, funcionalidades completas en F6.

---

## Stack Objetivo — Paquetes y Versiones

### Backend Laravel 11 (PHP 8.2+)
```
laravel/framework: ^11.0
laravel/sanctum: ^3.3
spatie/laravel-medialibrary: ^11
spatie/laravel-permission: ^6
spatie/laravel-query-builder: ^5
maatwebsite/excel: ^3.1
intervention/image: ^3.0
mercadopago/dx-php: ^3.0
filament/filament: ^3.0
darkaonline/l5-swagger: ^8.0
```

### Frontend Vue 3
```
vue: ^3.4
vite: ^5.0
typescript: ^5.0
pinia: ^2.0
vue-router: ^4.0
axios: ^1.6
tailwindcss: ^3.4
@headlessui/vue: ^1.7
swiper: ^11.0
@tanstack/vue-query: ^5.0
vitest: ^1.0
@vue/test-utils: ^2.0
```

---

## Infraestructura de Testing Cross-Fase

Esta sección define los patrones de testing que aplican a todas las fases. Es la fuente de verdad para cualquier decisión sobre cómo escribir tests en el proyecto Laravel + Vue 3.

### Stack de testing por capa

| Capa | Herramienta | Tipo | Comando |
|------|-------------|------|---------|
| Laravel | PHPUnit + `php artisan test` | Unit + Feature | `php artisan test --coverage` |
| Laravel | `Mail::fake()` | Mock de emails | automático en `.env.testing` |
| Laravel | `Queue::fake()` | Mock de colas | automático en `.env.testing` |
| Laravel | `Http::fake()` | Mock de APIs externas (MP) | por test |
| Laravel | `Storage::fake('s3')` | Mock de S3 | por test |
| Vue 3 | Vitest + `@vue/test-utils` | Unit stores/composables | `npm run test:unit` |
| Vue 3 | Playwright | E2E flujos críticos | `npm run test:e2e` |
| Vue 3 | Lighthouse CI | Performance + Accesibilidad | `npm run test:lighthouse` |

### Datos compartidos entre fases

El `DatabaseSeeder` de F1 es la **única fuente de datos de prueba** para F2, F4 y F6. Los datos del seeder determinan qué productos aparecen en los E2E de Playwright. Cualquier cambio en el seeder debe propagarse a los fixtures de Playwright en `e2e/fixtures/index.ts`.

### Configuración de `.env.testing` (Laravel)

```
APP_ENV=testing
DB_DATABASE=itsocks_testing
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
MAIL_MAILER=log
CACHE_STORE=array
MERCADOPAGO_ACCESS_TOKEN=TEST-fake-token
MERCADOPAGO_PUBLIC_KEY=TEST-fake-key
```

### Credenciales de integraciones externas para tests

| Integración | Tests de Feature (F2) | Tests E2E (F4) |
|-------------|----------------------|----------------|
| MercadoPago | `Http::fake(['api.mercadopago.com/*' => ...])` | `page.route()` que stub el SDK JS |
| S3/Storage | `Storage::fake('s3')` en `setUp()` | No aplica (Playwright usa URLs placeholder) |
| SMTP/Email | `Mail::fake()` + `MAIL_MAILER=log` | No aplica |
| Redis/Queue | `QUEUE_CONNECTION=sync` | No aplica |

### Fixtures de archivos (`tests/fixtures/`)

| Archivo | Descripción | Usado en |
|---------|-------------|---------|
| `product_placeholder.jpg` | Imagen 400x400 JPEG 10KB | F2 tests de upload, F6 tests Filament |
| `product_import_valid.xlsx` | 10 productos bien formados | F6 test de importación masiva |
| `product_import_invalid.xlsx` | Excel con columnas faltantes | F6 test de validación de errores |
| `shipping_data.json` | ~50 municipios Colombia con tarifas | F1 ShippingSeeder fallback |

### Umbrales de calidad por fase

| Fase | Cobertura mínima | Tests requeridos |
|------|-----------------|-----------------|
| F1 | N/A | Migraciones y seeders corren sin errores |
| F2 | ≥ 90% en controllers y services | Feature tests + Auth + MP mock + Mail mock |
| F3 | N/A | Script de paridad retorna 0 fallos |
| F4 | ≥ 90% en stores Pinia | 8 tests E2E verdes + Lighthouse ≥ 80 mobile |
| F6 | `--filter=Filament` verde | Queue::fake + Storage::fake + Excel fixture |

---

## Herramientas de Verificación por Fase

| Herramienta | Cuándo usarla | F0 | F1 | F2 | F3 | F4 | F5 | F6 |
|-------------|--------------|----|----|----|----|----|----|-----|
| `/migration-status` | Ver estado global antes de empezar | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/spec-lint F{N}` | Auditar la spec antes de implementar | ✓ | ✓ | ✓ | — | ✓ | — | ✓ |
| `/parity-check` | Validar que Laravel == FastAPI antes del cutover | — | — | ✓ | ✓ | — | — | — |
| `/cutover-monitor` | Monitorear métricas durante el cutover gradual | — | — | — | ✓ | — | ✓ | — |
| `/playwright-e2e` | Verificar flujos del frontend en el navegador | — | — | — | — | ✓ | ✓ | — |
| `/fase-cierre` | Cerrar la fase: tests + commit + push + PR + changelog | ✓ | ✓ | ✓ | — | ✓ | — | ✓ |

> F3 y F5 no usan `/fase-cierre` porque el cierre del cutover es manual y requiere rollback progresivo controlado por el `agente-devops-cutover`.

---

## Para Iniciar una Fase

> **Nota sobre el hook automático:** El archivo `.claude/hooks/migration-check.sh` se activa al final de cada sesión de Claude en ramas `feature/fase-N`. Emite un cuestionario obligatorio de 4 puntos sobre tests, resultados y criterios de aceptación. Los agentes deben responder ✓/✗ antes de continuar.

0. Ejecutar `/migration-status` para verificar el estado actual de todas las fases
1. Ejecutar `/spec-lint F{N}` para auditar la spec de la fase antes de implementar
2. El usuario le indica al agente correspondiente: _"Lee tu spec en `.claude/specs/fase-N-nombre.spec.md` y ejecuta la Fase N"_
3. El agente crea la rama git correspondiente (`feature/fase-N-nombre`)
4. El agente implementa según la spec
5. El agente ejecuta los tests de la fase (ver "Infraestructura de Testing Cross-Fase")
6. El agente verifica los criterios de aceptación de la fase
7. El agente ejecuta `/fase-cierre` — automatiza commit + push + PR a main + changelog
8. El usuario revisa y mergea el PR
