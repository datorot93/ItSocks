# Análisis de Migración Técnica: ItSocks — FastAPI + React hacia Laravel + Vue 3

**Versión:** 1.0  
**Fecha:** 23 de abril de 2026  
**Clasificación:** Confidencial — Uso interno del equipo de ingeniería  
**Autor:** Análisis arquitectónico sobre la base del código fuente actual

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Estado Actual del Sistema](#2-estado-actual-del-sistema)
3. [Stack Objetivo](#3-stack-objetivo)
4. [Análisis de Brechas por Capa](#4-análisis-de-brechas-por-capa)
5. [Equivalencias Tecnológicas](#5-equivalencias-tecnológicas)
6. [Estrategias de Migración](#6-estrategias-de-migración)
7. [Análisis de Riesgos](#7-análisis-de-riesgos)
8. [Plan de Migración por Fases](#8-plan-de-migración-por-fases)
9. [Composición del Equipo Ideal](#9-composición-del-equipo-ideal)
10. [Estimación de Esfuerzo y Tiempos](#10-estimación-de-esfuerzo-y-tiempos)
11. [Mejoras Arquitectónicas](#11-mejoras-arquitectónicas)
12. [Recomendaciones Finales](#12-recomendaciones-finales)

---

## 1. Resumen Ejecutivo

### Contexto Estratégico

ItSocks es una plataforma de e-commerce especializada en medias y accesorios para el mercado colombiano. El sistema actual fue construido con un backend Python/FastAPI y dos frontends React independientes (storefront de clientes + panel de administración React Admin), desplegados sobre AWS EC2 con PostgreSQL 12.

La pregunta estratégica que motiva este análisis es si conviene migrar el stack a **Laravel (PHP)** en el backend y **Vue 3** en el frontend, y de ser así, cuál es la ruta óptima para hacerlo.

### Hallazgos Clave del Análisis del Código

La inspección directa del repositorio reveló condiciones específicas que elevan el costo y el riesgo de la migración por encima de lo que cabría esperar para un e-commerce de esta escala:

- **Deuda técnica significativa en el backend.** Las claves de API de MercadoPago están hardcodeadas en el código fuente (`payments.py`). Las credenciales SMTP también aparecen en texto plano en `orders.py`. Los middlewares de autenticación en la mayoría de los routers están comentados, lo que significa que **la API actualmente opera sin control de acceso en producción**. El CORS está configurado como `allow_origins=["*"]`, exponiendo la API a cualquier origen.
- **Lógica de negocio embebida en routers.** El router `orders.py` contiene ~400 líneas que mezclan manejo HTTP, construcción de objetos de dominio, generación de HTML para emails y envío SMTP directamente. No existe capa de servicios separada.
- **El sistema de rutas del frontend es de alta complejidad.** El archivo `ItSocksRoutes.jsx` contiene 743 líneas de rutas declaradas manualmente para cada combinación de categoría/subcategoría/tipo/diseño/compresión. Esta estructura requerirá un rediseño completo al migrar a Vue Router.
- **El módulo `files.py` del backend** actúa como importador masivo de datos vía Excel (pandas + openpyxl), procesador de imágenes (Pillow), uploader a S3 (boto3) y creador de registros en base de datos, todo en un único endpoint POST. Es el componente de mayor complejidad técnica a migrar.
- **38 migraciones Alembic** generadas de forma orgánica, incluyendo typos en nombres de columna (`billing_addess`, `pyment_id`) que deben corregirse durante la migración.
- **Celery está configurado** pero el único consumidor visible de tareas asíncronas es un endpoint de prueba, indicando que la infraestructura existe pero el uso real es mínimo.
- **El panel admin es una aplicación React Admin completamente separada** (`admin-itsocks/`) que consume el mismo backend, con recharts para reportes y xlsx para exportación.

### Objetivos de la Migración

1. Adoptar un stack con mayor madurez en el ecosistema de la organización (si el equipo tiene mayor expertise en PHP/Vue).
2. Consolidar el panel de administración dentro del ecosistema Laravel (Filament o Nova).
3. Mejorar la seguridad corrigiendo las vulnerabilidades críticas descubiertas.
4. Reducir la deuda técnica estructurando la lógica de negocio con patrones establecidos (Eloquent, Service Layer, Form Requests).
5. Mejorar la mantenibilidad del frontend con TypeScript, Pinia, y la Composition API de Vue 3.

### Conclusión Anticipada

La migración es **técnicamente viable pero de complejidad real alta** para el tamaño aparente del sistema. El código base es mayor de lo que sugieren las métricas superficiales (27 modelos, 34 endpoints) debido a la densidad de lógica ad-hoc en los routers. La recomendación es una estrategia **de migración por fases con saneamiento previo** (Estrategia C), comenzando con la corrección de vulnerabilidades críticas activas en producción, independientemente de si se decide migrar o no.

---

## 2. Estado Actual del Sistema

### 2.1 Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS EC2                              │
│                                                             │
│  ┌──────────┐    ┌──────────────────┐    ┌───────────────┐ │
│  │  nginx   │───▶│ FastAPI + Uvicorn │───▶│ PostgreSQL 12 │ │
│  │  :80     │    │ :8888            │    │ (misma EC2)   │ │
│  └──────────┘    └──────────────────┘    └───────────────┘ │
│                          │                                  │
│                          ├──▶ Redis (Celery broker)         │
│                          └──▶ AWS S3 (imágenes)             │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐     ┌──────────────────────┐
│  Frontend Storefront │     │  Admin Panel         │
│  React 18 + Vite     │     │  React Admin 5       │
│  AWS S3 static       │     │  (app separada)      │
└──────────────────────┘     └──────────────────────┘
```

La base de datos PostgreSQL corre en la misma instancia EC2 que el backend — no hay separación de infraestructura. El frontend del storefront está desplegado en S3 como sitio estático.

### 2.2 Backend — Análisis Detallado

#### Estructura de Módulos

| Directorio | Cantidad | Descripción |
|---|---|---|
| `app/models/` | 27 archivos | Modelos SQLAlchemy (ORM) |
| `app/schemas/` | ~24 archivos | Schemas Pydantic v1 |
| `app/crud/` | 29 archivos | Clases CRUD (CRUDBase + especializadas) |
| `app/api/api_v1/routers/` | 34 archivos | Routers FastAPI |
| `app/migrations/versions/` | 38 archivos | Migraciones Alembic |
| `app/core/` | 4 archivos | Config, seguridad, Celery |

#### Modelos de Dominio Identificados

**Catálogo de productos:**
- `Product` — entidad central con relaciones a Design, Type, Subcategory
- `Category`, `Subcategory`, `Type` — jerarquía de clasificación (3 niveles)
- `Design` — diseños de estampado
- `Tag`, `TagProduct` — etiquetado many-to-many
- `Color`, `ProductColor` — colores por producto (many-to-many)
- `Size`, `ProductSize` — tallas por producto (many-to-many)
- `Image` — imágenes por producto (URLs de S3)
- `TypeImage`, `Preview` — imágenes por tipo y previsualizaciones

**Comercio:**
- `Order` — pedidos con datos de envío embebidos (no normalizado)
- `ProductOrder` — líneas de pedido con cantidad y referencia de pack
- `Pack` — paquetes de productos con precio propio
- `DiscountCode` — códigos de descuento con expiración

**Logística:**
- `Shipping` — tabla de tarifas por municipio/departamento (mercado colombiano)

**Administración:**
- `User` — usuarios admin (sin roles granulares, solo `is_admin`)
- `Customer` — clientes (estructura separada de User, sin FK con Order)
- `Slider` — banners del homepage
- `SizeGuide` — guías de tallas

#### Patrones de Código Backend

El `CRUDBase` implementa el patrón Repository genérico con los métodos `get`, `get_multi`, `create`, `update`, `remove`. Las clases CRUD especializadas extienden esto con queries complejas.

El módulo `crud_product.py` es el más complejo del sistema: implementa más de 20 métodos de consulta para cubrir todas las combinaciones de filtros del catálogo (categoría × subcategoría × tipo × diseño × compresión), lo que explica por qué el router de productos tiene 25+ endpoints distintos.

#### Vulnerabilidades de Seguridad Críticas

> **⚠️ ESTAS VULNERABILIDADES ESTÁN ACTIVAS EN PRODUCCIÓN AHORA MISMO**

| ID | Vulnerabilidad | Archivo | Impacto |
|---|---|---|---|
| S1 | Clave de acceso MercadoPago hardcodeada | `payments.py` | Uso fraudulento de la cuenta de pagos |
| S2 | Credenciales SMTP de Gmail hardcodeadas | `orders.py` | Envío de spam/phishing desde cuenta ItSocks |
| S3 | Autenticación deshabilitada (comentada) en todos los routers | Todos los routers | Cualquier usuario puede crear/borrar productos y órdenes |
| S4 | CORS wildcard activo (`allow_origins=["*"]`) | `main.py` | API expuesta a cualquier origen web |

**Estos puntos deben corregirse independientemente de si se migra o no.**

### 2.3 Frontend Storefront — Análisis Detallado

#### Estructura

```
frontend/src/
├── context/          # 7 Contexts (cart, shipping, pack, wish, discount, preference, order)
├── hooks/            # Custom hooks
├── itsocks/
│   ├── components/   # Componentes reutilizables
│   ├── helpers/      # Funciones de fetching y utilidades
│   ├── pages/        # 26+ páginas principales
│   └── routes/       # ItSocksRoutes.jsx (743 líneas)
├── reducers/         # Redux-style reducers
├── store/            # Redux Toolkit store
├── ui/               # Componentes compartidos (Navbar, Footer, etc.)
└── router/           # AppRouter.jsx
```

#### Estado de la Aplicación

El estado global usa una arquitectura híbrida: Redux Toolkit para algunos estados y Context API + reducers propios para otros, sin consistencia en cuál patrón se usa para qué.

Las 6 contexts cubren: carrito, envío, packs, lista de favoritos, descuentos, y preferencias de MercadoPago. Estas son las unidades de estado que deben traducirse a stores Pinia en Vue 3.

#### Gestión de Datos Remotos

No se usa Axios ni ninguna librería de fetching dedicada — toda comunicación con la API usa `fetch` nativo con llamadas directas desde helpers y páginas. No hay caché de datos, no hay manejo de estados de carga consistente a nivel de aplicación, y no hay interceptores.

#### Complejidad del Sistema de Rutas

El archivo `ItSocksRoutes.jsx` declara más de 80 rutas individuales para cubrir las combinaciones del catálogo. Por ejemplo, para medias pantorrilleras estampadas existen 6 variantes de ruta (`/:disenio`, `/:disenio/:compresion`, `/:nombre`, `/:disenio/:nombre`, etc.). Este patrón se repite para cada tipo de media y pack. En Vue Router esto se resuelve con rutas parametrizadas anidadas.

### 2.4 Panel de Administración

El admin (`admin-itsocks/`) es una aplicación React Admin 5 independiente con:
- Dashboard con recharts para visualización de ventas
- Gestión CRUD de todos los recursos
- Módulo de reportes con exportación a Excel (xlsx)
- Autenticación con jwt-decode

En Laravel, este panel se reemplaza con **Filament 3** (open source) eliminando la necesidad de un frontend separado para administración.

### 2.5 Fortalezas del Stack Actual

1. **FastAPI proporciona documentación OpenAPI automática** (`/api/docs`) — útil durante el período de migración.
2. **La base de datos está bien estructurada** — 38 migraciones representan un esquema evolucionado con datos reales.
3. **El módulo de importación masiva vía Excel** (`files.py`) es funcional y cubre un caso de uso operativo crítico.
4. **PostgreSQL 12** es totalmente compatible con Laravel/Eloquent sin cambios en la base de datos.

### 2.6 Debilidades del Stack Actual

1. Sin separación de capas — lógica de negocio mezclada en routers HTTP
2. Sin cobertura de tests — archivos de test vacíos o mínimos
3. Dependencias desactualizadas — FastAPI 0.89.1 (actual: 0.111+), Pydantic 1.10.4 (actual: v2), Celery 4.4.2 (actual: 5.3+)
4. Sin TypeScript en el frontend — código JSX sin tipos
5. Hardcoding de configuración — IPs de AWS, claves de API y credenciales en el código
6. Panel admin desacoplado — dos repositorios frontend distintos con lógica duplicada
7. PostgreSQL en la misma EC2 que el backend — único punto de falla

---

## 3. Stack Objetivo

### 3.1 Backend: Laravel 11

**Versión recomendada:** Laravel 11.x  
**PHP:** 8.2 o 8.3 mínimo  
**Base de datos:** PostgreSQL 16 (upgrade desde 12, totalmente compatible)

| Caso de uso | Solución Laravel |
|---|---|
| ORM y migraciones | Eloquent ORM + Laravel Migrations |
| Validación de requests | Form Requests |
| Autenticación API | Laravel Sanctum (token-based) |
| Cola de trabajos asíncronos | Laravel Queues + Redis (reemplaza Celery) |
| Procesamiento de imágenes | Intervention Image 3 + Spatie Media Library |
| Almacenamiento S3 | Laravel Filesystem (driver S3 nativo) |
| Emails transaccionales | Laravel Mail + Blade templates |
| Reportes Excel | Laravel Excel (Maatwebsite) |
| Pagos MercadoPago | `mercadopago/dx-php` (SDK oficial PHP) |
| Panel de administración | Filament 3 |
| Filtrado avanzado de catálogo | `spatie/laravel-query-builder` |
| Comandos CLI | Artisan Commands (reemplaza Typer) |
| API REST | Laravel API Resources + `Route::apiResource()` |

**Paquetes composer recomendados:**

```
laravel/sanctum:^3.3
spatie/laravel-medialibrary:^11
spatie/laravel-permission:^6
spatie/laravel-query-builder:^5
maatwebsite/excel:^3.1
intervention/image:^3.0
mercadopago/dx-php:^3.0
filament/filament:^3.0
darkaonline/l5-swagger:^8.0
```

### 3.2 Frontend: Vue 3

**Versión recomendada:** Vue 3.4+ con Composition API  
**Build tool:** Vite 5  
**Lenguaje:** TypeScript 5

| Caso de uso | Solución Vue 3 |
|---|---|
| State management | Pinia 2 (reemplaza Redux Toolkit + Context API) |
| Router | Vue Router 4 |
| HTTP client | Axios 1.x + composable `useApi` |
| UI framework | Tailwind CSS 3 + HeadlessUI |
| Carousel | Swiper.js (reemplaza react-slick + react-multi-carousel) |
| Scroll infinito | IntersectionObserver composable o `@tanstack/vue-virtual` |
| MercadoPago | SDK JS oficial con Bricks de pago |
| Iconos | Heroicons o Lucide Vue |
| Testing | Vitest + Vue Testing Library |

**Estructura de Pinia stores:**

```
stores/
├── cartStore.ts       ← cart context + useCartReducer
├── wishlistStore.ts   ← wish context
├── packStore.ts       ← pack context
├── shippingStore.ts   ← shipping context
├── discountStore.ts   ← discount context
├── preferenceStore.ts ← MercadoPago preference context
└── authStore.ts       ← nuevo (autenticación de clientes)
```

---

## 4. Análisis de Brechas por Capa

### 4.1 Capa de Datos (PostgreSQL + ORM)

**Brecha principal:** Los nombres de tabla usan snake_case singular (`product`, `order`). Eloquent por defecto espera plural (`products`, `orders`). Se debe configurar `$table` explícitamente en cada modelo o renombrar las tablas.

**Typos identificados en el esquema actual que deben corregirse en la migración:**

| Campo actual | Corrección | Tabla |
|---|---|---|
| `billing_addess` | `billing_address` | `orders` |
| `pyment_id` | `payment_id` | `orders` |
| `de` | `gift_from` | `orders` |
| `para` | `gift_to` | `orders` |

**Problema de normalización:** `Order` embebe todos los datos del cliente directamente (nombre, teléfono, documento, email, dirección) en lugar de relacionarse con `Customer`. No hay FK entre ambas tablas. La migración es la oportunidad de normalizar esto.

**Esfuerzo estimado:** 5-8 días/desarrollador.

### 4.2 Capa de Lógica de Negocio

No hay capa de servicios. La lógica está en routers y clases CRUD. Las siguientes unidades deben extraerse a Service Classes en Laravel:

| Lógica actual | Ubicación actual | Service Laravel propuesto |
|---|---|---|
| Envío de email de confirmación de orden | `orders.py` | `OrderNotificationService` |
| Envío de email de guía de envío | `orders.py` | `OrderNotificationService` |
| Creación de preferencia MercadoPago | `payments.py` | `MercadoPagoService` |
| Importación Excel de productos | `files.py` | `ProductImportService` (Job) |
| Subida y procesamiento de imágenes | `files.py` | `ImageProcessingService` |
| Filtrado complejo de productos | `crud_product.py` (20+ métodos) | `spatie/laravel-query-builder` |
| Aplicación de descuentos | Lógica dispersa | `DiscountService` |
| Cálculo de tarifa de envío | `shippings.py` | `ShippingCalculatorService` |
| Pixel tracking Facebook | `pixels.py` | `FacebookPixelService` |

### 4.3 Capa de API

**Brecha crítica:** En lugar de traducir los 25 endpoints de filtro de productos uno a uno, Laravel permite resolverlos con un único endpoint parametrizado:

```php
// Un endpoint reemplaza 25 en FastAPI
Route::get('/products', [ProductController::class, 'index']);

// Controller
$products = QueryBuilder::for(Product::class)
    ->allowedFilters(['category.name', 'subcategory.name', 'type.name',
                      'design.name', 'compresion', 'tag.name'])
    ->allowedIncludes(['images', 'sizes', 'colors', 'design', 'type', 'subcategory'])
    ->paginate();
```

**Clasificación de endpoints por nivel de autenticación** (actualmente todos públicos):

| Nivel | Ejemplos | Middleware Laravel |
|---|---|---|
| Público | Catálogo, shippings, validación de descuentos | Sin middleware |
| Cliente autenticado | Wishlist, crear orden | `auth:sanctum` |
| Solo admin | CRUD de productos, reportes, bulk updates | `auth:sanctum + role:admin` |

### 4.4 Capa de Frontend

**Brecha del sistema de rutas:** Las 80+ rutas individuales se pueden expresar en Vue Router con ~15 rutas paramétricas:

```typescript
{
  path: '/medias/:subcategoria',
  component: MediasLayout,
  children: [
    { path: '', component: SubcategoryPage },
    { path: ':tipo', component: ProductListPage },
    { path: ':tipo/:disenio', component: ProductListPage },
    { path: ':tipo/:disenio/:compresion', component: ProductListPage },
    { path: ':tipo/:disenio/:compresion/:nombre', component: ProductDetailPage },
  ]
}
```

**Brecha de componentes:** 89 archivos JSX deben convertirse a Single File Components (`.vue`). Los hooks React (`useCartReducer`, `useWishReducer`) deben convertirse a composables Vue 3.

**Brecha de estilos:** Bootstrap 5 (CDN) + CSS Modules debe migrarse a Tailwind CSS 3 (recomendado) o mantenerse como Bootstrap 5 vía npm. La decisión impacta en 89 componentes.

**Brecha MercadoPago:** El SDK React `@mercadopago/sdk-react@0.0.3` está en una versión no oficial. La integración Vue debe usar el SDK JS oficial con los Bricks de pago, que son independientes del framework.

---

## 5. Equivalencias Tecnológicas

### 5.1 Backend: FastAPI → Laravel

| Concepto FastAPI | Equivalente Laravel | Notas |
|---|---|---|
| `FastAPI()` instance | `Application` (bootstrap/app.php) | |
| `APIRouter()` | `Route::apiResource()` / `Route::group()` | |
| `Depends(get_db)` | Eloquent (sin injection explícita) | Active Record vs. Data Mapper |
| `Depends(get_current_user)` | Middleware `auth:sanctum` | |
| Pydantic `BaseModel` (schema) | Form Request + API Resource | Validación + shapeo de respuesta |
| SQLAlchemy Model | Eloquent Model | |
| `CRUDBase.get_multi()` | `Model::paginate()` | Paginación nativa incluida |
| `CRUDBase.create()` | `Model::create($validated)` | |
| Alembic migrations | `php artisan make:migration` | Sintaxis diferente, mismo concepto |
| `alembic upgrade head` | `php artisan migrate` | |
| Celery task | Laravel Job | |
| Redis broker (Celery) | Redis queue driver Laravel | Compatible, misma infraestructura |
| `smtp.SMTP` + `smtplib` | Laravel Mail + Mailable classes | |
| Jinja2 templates (email) | Blade templates (email) | |
| `boto3.resource('s3')` | `Storage::disk('s3')` | Abstracción más limpia |
| Pillow Image processing | Intervention Image 3 | |
| Pandas + openpyxl | Maatwebsite Excel | |
| JWT HS256 + OAuth2 | Laravel Sanctum (tokens de API) | |
| `typer` CLI | Artisan Commands | |
| `unidecode` para búsquedas | Extensión `unaccent` de PostgreSQL | Compatible con raw queries en Eloquent |
| FastAPI `/api/docs` (OpenAPI) | `darkaonline/l5-swagger` | Documentación explícita requerida |
| `mercadopago.SDK` (Python) | `mercadopago/dx-php` | SDK oficial disponible |

### 5.2 Frontend: React → Vue 3

| Concepto React | Equivalente Vue 3 | Notas |
|---|---|---|
| JSX / `.jsx` file | Single File Component `.vue` | Template + Script + Style |
| `React.FC` | `<script setup lang="ts">` | Preferir script setup |
| `useState` | `ref()` / `reactive()` | |
| `useEffect` | `watch()` / `onMounted()` | |
| `useMemo` | `computed()` | |
| `useRef` | `useTemplateRef()` | |
| `useContext(CartContext)` | `useCartStore()` (Pinia) | |
| `createContext + Provider` | Pinia store | |
| Redux Toolkit `createSlice` | Pinia `defineStore` | |
| Redux `useSelector` | `storeInstance.property` | |
| Redux `useDispatch` | `storeInstance.action()` | |
| React Router `<Route>` | Vue Router `routes[]` config | |
| React Router `useNavigate` | `useRouter().push()` | |
| React Router `useParams` | `useRoute().params` | |
| React Router `<Link>` | `<RouterLink>` | |
| `react-slick` | Swiper.js | |
| `react-multi-carousel` | Swiper.js (multi-slide) | |
| `react-infinite-scroll-component` | IntersectionObserver composable | |
| `react-lazy-load-image-component` | Directiva `v-lazy` (vue-lazyload) | |
| Bootstrap 5 CDN | Tailwind CSS 3 (recomendado) | |
| CSS Modules (`.module.css`) | `<style scoped>` | |
| `@mercadopago/sdk-react` | MercadoPago Bricks JS (vanilla) | SDK oficial independiente de framework |
| Native `fetch` | `axios` + composable `useApi` | Interceptores y error handling centralizado |
| `localforage` | `@vueuse/core` useStorage | |

### 5.3 Admin Panel: React Admin → Filament 3

| Concepto React Admin | Equivalente Filament 3 | Notas |
|---|---|---|
| `<Resource name="products">` | `ProductResource extends Resource` | |
| `<List>` | `static function table(Table $table)` | |
| `<Create>` / `<Edit>` | `static function form(Form $form)` | |
| `ra-data-json-server` | Eloquent nativo | Sin adapter necesario |
| recharts | Filament Widgets con chart.js | |
| xlsx export | Filament Export plugin | |
| `jwt-decode` auth | Filament auth nativo | |

---

## 6. Estrategias de Migración

### 6.1 Opción A: Big Bang (Reescritura Total)

**Descripción:** Se congela el desarrollo en el sistema actual y se construye el nuevo sistema completo antes de hacer el cutover.

**Ventajas:**
- Arquitectura limpia desde el inicio sin compromisos legacy
- Sin overhead de mantener dos sistemas simultáneamente
- Permite corregir todos los problemas de diseño de datos

**Desventajas:**
- Riesgo máximo — si el nuevo sistema tiene bugs en producción, hay que revertir todo
- El negocio no recibe nuevas features durante 6-12 meses
- Las integraciones externas (MercadoPago, Facebook Pixel) deben funcionar perfectamente desde el día 1

**Duración estimada:** 8-12 meses | **Riesgo:** ALTO | **Recomendada para ItSocks:** NO

### 6.2 Opción B: Strangler Fig (Migración Incremental)

**Descripción:** El nuevo sistema reemplaza gradualmente módulos del sistema actual. nginx enruta peticiones al sistema legado o al nuevo según qué módulos han sido migrados.

```
[Cliente] → [nginx] → [FastAPI/React]  (módulos no migrados)
                    → [Laravel/Vue]    (módulos migrados)
```

**Ventajas:**
- Riesgo por iteración controlado
- El negocio puede recibir mejoras incrementales
- Permite validar la equivalencia funcional módulo a módulo

**Desventajas:**
- Overhead de mantener dos bases de código activas durante 12-18 meses
- La base de datos compartida puede crear conflictos de migración
- El routing condicional añade complejidad operacional

**Duración estimada:** 12-18 meses | **Riesgo:** MEDIO | **Recomendada para ItSocks:** PARCIALMENTE

### 6.3 Opción C: Migración por Fases con Saneamiento Previo ★ RECOMENDADA

**Descripción:** Antes de migrar de stack, se realiza una fase de saneamiento que corrige los problemas críticos de seguridad y deuda técnica. Luego se migra backend y frontend en fases desacopladas.

**Proceso resumido:**
1. **Fase 0:** Corregir vulnerabilidades críticas en el sistema actual (2-3 semanas)
2. **Fase 1:** Scaffolding Laravel, modelos Eloquent, Filament básico (6 semanas)
3. **Fase 2:** API Laravel completa con paridad funcional (10 semanas)
4. **Fase 3:** Cutover de backend — switch nginx de FastAPI a Laravel (1 semana). El frontend React sigue sin cambios.
5. **Fase 4:** Construcción del frontend Vue 3 con el backend Laravel estable (11 semanas)
6. **Fase 5:** Cutover del frontend (2 semanas)
7. **Fase 6:** Completar panel Filament (en paralelo con Fase 4, 4 semanas)

**Ventajas:**
- Desacopla la migración de backend de la de frontend
- El cutover del backend puede validarse con el frontend existente
- El saneamiento previo reduce riesgos durante la migración
- Cada cutover es independiente y tiene rollback claro

**Desventajas:**
- El período de saneamiento puede percibirse como "trabajo no visible"
- Requiere disciplina para no extender la convivencia de sistemas

**Duración estimada:** 10-14 meses totales | **Riesgo:** MEDIO-BAJO | **Recomendada:** SÍ

---

## 7. Análisis de Riesgos

### 7.1 Riesgos Técnicos

| ID | Riesgo | Severidad | Probabilidad | Mitigación |
|---|---|---|---|---|
| T1 | Pérdida o corrupción de datos durante migración | CRÍTICA | BAJA | Script de migración con validación de conteo, backup completo antes del cutover, prueba en staging con datos reales |
| T2 | Regresión en integración MercadoPago | ALTA | MEDIA | Ambiente de pruebas con cuenta sandbox, testing manual del flujo completo antes del cutover |
| T3 | Incompatibilidad de la función `unaccent` de PostgreSQL en Eloquent | MEDIA | ALTA | Usar raw queries en Eloquent donde se necesite, o extensión nativa de PostgreSQL |
| T4 | El módulo de importación Excel tiene dependencias de paths locales y diccionarios hardcodeados | ALTA | ALTA | Reescritura completa como Job Laravel con mapeo configurable, testing con archivos Excel reales |
| T5 | SEO — cambio de estructura de URLs del frontend | MEDIA | ALTA | Implementar redirects 301 para todas las URLs antiguas en nginx/Laravel antes del cutover |
| T6 | Typos en columnas (`billing_addess`, `pyment_id`) crean riesgos al renombrar | MEDIA | ALTA | Documentar todos los typos, script de migración explícito con validación de paridad |
| T7 | Estado del carrito se pierde para usuarios activos en el cutover | BAJA | ALTA | Cutover en horario de mínimo tráfico; el carrito en localStorage persiste |

### 7.2 Riesgos de Negocio

| ID | Riesgo | Severidad | Probabilidad | Mitigación |
|---|---|---|---|---|
| N1 | Equipo sin experiencia previa en Laravel o Vue 3 | ALTA | MEDIA | Capacitación antes de iniciar, contratar al menos 1 senior con experiencia real en Laravel |
| N2 | Scope creep durante la migración | ALTA | ALTA | La Fase 2 reimplementa paridad funcional exacta — nuevas features solo en Fases 4+ |
| N3 | Pérdida de la documentación viva que proporciona FastAPI OpenAPI | BAJA | MEDIA | Implementar `darkaonline/l5-swagger` desde el inicio del proyecto Laravel |
| N4 | El negocio no puede congelar features durante la migración | ALTA | ALTA | Política de feature flags; nuevas features solo en el stack nuevo |

### 7.3 Riesgos de Seguridad (Activos en Producción)

| ID | Vulnerabilidad | Severidad | Estado | Acción inmediata |
|---|---|---|---|---|
| S1 | Clave de acceso MercadoPago hardcodeada en `payments.py` | CRÍTICA | ACTIVO | Rotar clave INMEDIATAMENTE y mover a `.env` |
| S2 | Credenciales SMTP hardcodeadas en `orders.py` | ALTA | ACTIVO | Mover a `.env`, rotar contraseña de app Gmail |
| S3 | Autenticación comentada — API pública en producción | CRÍTICA | ACTIVO | Habilitar middlewares comentados en todos los routers |

### 7.4 Riesgos de Arquitectura

| ID | Riesgo | Severidad | Mitigación |
|---|---|---|---|
| A1 | PostgreSQL en la misma EC2 que el backend — único punto de falla | MEDIA | Migrar PostgreSQL a RDS durante la Fase 1 |
| A2 | Sin Redis cluster para colas/jobs | BAJA | Configurar ElastiCache para Redis en producción |

---

## 8. Plan de Migración por Fases

### Fase 0: Saneamiento de Seguridad (Semanas 1-2)

**Objetivo:** Corregir vulnerabilidades críticas en el sistema actual sin cambiar el stack.

**Semana 1:**
1. Rotar la clave de acceso MercadoPago y moverla a variable de entorno
2. Rotar la app password de Gmail SMTP y moverla a variable de entorno
3. Verificar que `.env` esté en `.gitignore` y que no haya secrets en el historial de git
4. Reemplazar `allow_origins=["*"]` con lista explícita de dominios
5. Habilitar autenticación en endpoints de escritura

**Semana 2:**
1. Configurar rate limiting básico en nginx
2. Auditoría y eliminación de `print()` statements que loguean datos de clientes
3. Documentar el esquema de BD actual con diagrama ER
4. Implementar refresh tokens o extender TTL del JWT

**Criterio de salida:** Ningún secret en el código fuente. Endpoints CRUD protegidos. CORS restringido.

---

### Fase 1: Scaffolding y Modelado Laravel (Semanas 3-8)

**Objetivo:** Crear el proyecto Laravel con todos los modelos, migraciones y el panel Filament funcional.

1. `laravel new itsocks-api` con estructura recomendada
2. Migrar PostgreSQL a RDS (aprovechando para upgradear de Pg12 a Pg16)
3. Crear las 27 migraciones Laravel corrigiendo typos de columnas
4. Crear los 27 modelos Eloquent con relaciones, `$fillable`, `$casts`
5. Configurar Laravel Sanctum para autenticación
6. Instalar y configurar Filament 3
7. Crear todos los Resources de Filament (CRUD de productos, órdenes, categorías, usuarios)
8. Configurar Laravel Storage con driver S3
9. Configurar Laravel Mail con Blade templates equivalentes a los HTML de `orders.py`
10. Configurar Laravel Queues con Redis
11. Escribir seeders para datos de referencia (categorías, tipos, diseños, colores, tallas, tarifas de envío colombianas)

**Hito:** Panel Filament funcional en staging. Todos los modelos con tests unitarios de relaciones.

---

### Fase 2: API Laravel Completa (Semanas 9-18)

**Objetivo:** Implementar todos los endpoints en Laravel con paridad funcional al 100%.

**Orden de implementación por prioridad:**

1. **Auth:** login, logout, get_user
2. **Catálogo (solo lectura):** Un endpoint con `spatie/laravel-query-builder` reemplaza 25 de FastAPI
3. **Imágenes:** Upload a S3 con Spatie Media Library
4. **Órdenes:** Creación, consulta, actualización de estado + `OrderNotificationService`
5. **Pagos:** `MercadoPagoService` con SDK PHP
6. **Packs:** CRUD y lógica de negocio
7. **Descuentos:** Validación de códigos
8. **WishList:** CRUD y lógica de compartir
9. **Envíos:** Lookup de tarifas por municipio colombiano
10. **Importación Excel:** `ProductImportService` como Job Laravel con Maatwebsite Excel
11. **Reportes de ventas:** Queries Eloquent equivalentes a `sells_reports.py`
12. **Bulk operations:** Precios y tarifas de envío masivas
13. **Facebook Pixel:** `FacebookPixelService` con Conversions API

**Enfoque de testing:** Tests de Feature (HTTP) que verifican que Laravel retorna las mismas respuestas que FastAPI para los mismos inputs. Ejecutar ambos sistemas contra la misma base de datos de staging.

**Criterio de salida:** 100% de endpoints con tests. 0 diferencias en suite de paridad automatizada.

---

### Fase 3: Cutover Backend (Semana 19)

**Objetivo:** Reemplazar FastAPI con Laravel en producción. El frontend React sigue sin cambios.

1. Deploy de Laravel a producción (servidor independiente, misma BD)
2. Activar 10% del tráfico hacia Laravel mediante nginx upstream ponderado
3. Monitorear logs, errores, tiempos de respuesta durante 48h
4. Migrar 100% del tráfico a Laravel
5. FastAPI en standby para rollback durante 1 semana
6. Desmantelar FastAPI si no hay issues

**Criterio de salida:** 99.9% de requests exitosos durante 48 horas en producción.

---

### Fase 4: Frontend Vue 3 (Semanas 20-30)

**Sprint 1 (sem 20-21):** Setup del proyecto Vue 3 + Vite + TypeScript + Tailwind + Pinia + Vue Router. Definir todas las stores Pinia. Crear composables base (`useApi`, `useCart`, `useWishlist`). Sistema de rutas parametrizadas.

**Sprint 2 (sem 22-23):** Componentes UI compartidos: Navbar, Footer, Breadcrumb, Carousel (Swiper), Loader, ProductCard.

**Sprint 3 (sem 24-25):** Homepage, página de Medias, página de Packs, listado de productos con filtros.

**Sprint 4 (sem 26-27):** Detalle de producto, detalle de pack, búsqueda, páginas de estilos de vida (running, trabajo, etc.).

**Sprint 5 (sem 28-29):** Carrito, checkout, billing, integración MercadoPago Bricks, confirmación de orden.

**Sprint 6 (sem 30):** WishList, páginas informativas (FAQ, envíos, política de datos), Order Description.

**Criterio de salida:** Lighthouse score ≥ 80 en mobile. E2E tests para flujo de compra completo.

---

### Fase 5: Cutover Frontend (Semanas 31-32)

1. Deploy del frontend Vue en S3/CloudFront
2. A/B testing: 10% de usuarios al frontend Vue
3. Monitorear métricas de conversión vs. frontend React
4. Si métricas OK: migrar 100%
5. Configurar redirects 301 para URLs que cambiaron de estructura

---

### Fase 6: Admin Panel Filament — Finalización (Semanas 33-36)

Completar funcionalidades avanzadas del panel admin (en paralelo con Fase 4):
- Widgets de dashboard con métricas de ventas
- Exportación Excel de órdenes y reportes
- Gestión de imágenes en S3 (Spatie Media Library)
- Importación masiva de productos
- Gestión de guías de envío

---

## 9. Composición del Equipo Ideal

### 9.1 Equipo Mínimo Viable

| Rol | Seniority | Cantidad | Responsabilidades principales |
|---|---|---|---|
| **Tech Lead / Arquitecto** | Senior (5+ años) | 1 | Decisiones de arquitectura, revisión de código, definición de patrones, gestión técnica |
| **Backend Developer Laravel** | Senior (3+ años en Laravel) | 1 | Modelos Eloquent, servicios, endpoints API, integración de paquetes |
| **Backend Developer Laravel** | Semi-Senior (2+ años) | 1 | CRUD estándar, tests, migraciones, Filament Resources |
| **Frontend Developer Vue 3** | Senior (3+ años en Vue/React) | 1 | Arquitectura de componentes, stores Pinia, composables, routing |
| **Frontend Developer Vue 3** | Semi-Senior (1+ años en Vue) | 1 | Implementación de páginas, componentes UI, integración con API |
| **DevOps / Infraestructura** | Semi-Senior | 0.5 (part-time) | CI/CD, AWS RDS, nginx routing, deployment |
| **QA Engineer** | Semi-Senior | 0.5 (part-time) | Tests de integración, suite de paridad, E2E testing |

**Total: 5 personas a tiempo completo + 1 part-time**

### 9.2 Equipo Recomendado (Confort)

Añadir al equipo mínimo:
- 1 Backend Developer Junior para CRUD, tests unitarios, documentación
- 1 Frontend Developer para acelerar migración de componentes
- 1 QA Engineer a tiempo completo desde la Fase 2

**Total: 7-8 personas**

### 9.3 Perfiles Críticos e Irremplazables

**Tech Lead:** Debe tener experiencia en migraciones de sistemas y conocimiento profundo del dominio e-commerce. Es quien define la estrategia de datos y supervisa la paridad funcional. Su ausencia detiene el proyecto.

**Backend Senior Laravel:** Debe conocer bien Eloquent (relaciones, scopes, eager loading), Form Requests, API Resources, y los paquetes clave (Spatie Query Builder, Spatie Media Library). El éxito de la Fase 2 depende directamente de este perfil.

**Frontend Senior Vue:** Debe conocer la Composition API, `<script setup>`, Pinia con persistencia, Vue Router 4 con guardas, y TypeScript en Vue. La simplificación del sistema de rutas requiere criterio arquitectónico.

### 9.4 Curva de Aprendizaje para el Equipo Actual

Si el equipo actual tiene experiencia en FastAPI y React:
- **FastAPI → Laravel:** 4-6 semanas para ser productivo en características básicas; 3 meses para dominar el ecosistema. La mayor diferencia conceptual es Active Record (Eloquent) vs. Data Mapper (SQLAlchemy).
- **React → Vue 3:** 2-4 semanas para desarrolladores React con hooks. La Composition API es conceptualmente similar a los React Hooks, pero la reactividad de Vue es más explícita y predecible.

---

## 10. Estimación de Esfuerzo y Tiempos

### 10.1 Resumen por Fase

| Fase | Descripción | Duración | Personas | Esfuerzo (persona-semana) |
|---|---|---|---|---|
| 0 | Saneamiento de seguridad | 2 semanas | 2 | 4 |
| 1 | Scaffolding y modelado Laravel | 6 semanas | 3 | 18 |
| 2 | API Laravel completa | 10 semanas | 4 | 40 |
| 3 | Cutover backend | 1 semana | 3 | 3 |
| 4 | Frontend Vue 3 | 11 semanas | 3 | 33 |
| 5 | Cutover frontend | 2 semanas | 2 | 4 |
| 6 | Admin Filament (finalización) | 4 semanas | 2 | 8 |
| **Total** | | **~36 semanas (~9 meses)** | | **~110 persona-semanas** |

### 10.2 Distribución del Esfuerzo — Backend

| Componente | Esfuerzo estimado | Complejidad |
|---|---|---|
| Modelos Eloquent (27) + Migraciones | 2 semanas | Media |
| Autenticación (Sanctum) | 0.5 semanas | Baja |
| CRUD estándar (20 recursos simples) | 3 semanas | Baja |
| Módulo de Productos con filtros | 2 semanas | Alta |
| Módulo de Órdenes + Emails | 2 semanas | Alta |
| Integración MercadoPago | 1.5 semanas | Media |
| Importación Excel masiva | 2 semanas | MUY ALTA |
| Reportes de ventas | 1.5 semanas | Alta |
| Panel Filament (Fases 1 + 6) | 3 semanas | Media |
| Tests de paridad | 2 semanas | Media |
| DevOps y deployment | 1.5 semanas | Media |

### 10.3 Distribución del Esfuerzo — Frontend

| Componente | Esfuerzo estimado | Complejidad |
|---|---|---|
| Setup + arquitectura + stores Pinia | 1.5 semanas | Media |
| Componentes UI compartidos | 2 semanas | Media |
| Sistema de rutas Vue Router | 1 semana | Media |
| Homepage + páginas de catálogo | 2.5 semanas | Alta |
| Detalle de producto + pack | 2 semanas | Alta |
| Flujo de carrito + checkout | 2.5 semanas | MUY ALTA |
| Integración MercadoPago Bricks | 1.5 semanas | Alta |
| WishList + páginas informativas | 1 semana | Baja |
| Búsqueda + filtros | 1 semana | Media |
| Testing E2E del flujo de compra | 1 semana | Media |

### 10.4 Estimación de Costos (Referencia Mercado Latam 2026)

| Perfil | Costo mensual estimado | Meses | Total estimado |
|---|---|---|---|
| Tech Lead / Arquitecto Senior | USD 5,000–6,000 | 9 | USD 45,000–54,000 |
| Backend Senior Laravel | USD 4,000–5,000 | 9 | USD 36,000–45,000 |
| Backend Semi-Senior | USD 2,500–3,500 | 7 | USD 17,500–24,500 |
| Frontend Senior Vue | USD 4,000–5,000 | 6 | USD 24,000–30,000 |
| Frontend Semi-Senior | USD 2,500–3,500 | 6 | USD 15,000–21,000 |
| DevOps part-time | USD 1,500–2,000 | 9 | USD 13,500–18,000 |
| **Total estimado de equipo** | | | **USD 151,000–192,500** |

**Infraestructura adicional durante migración:**
- RDS PostgreSQL (db.t3.medium): ~USD 50/mes × 9 = USD 450
- Servidor staging completo: ~USD 100/mes × 9 = USD 900
- Laravel Nova (si se elige sobre Filament gratuito): USD 299 (one-time)

---

## 11. Mejoras Arquitectónicas

### 11.1 Separación de Responsabilidades (SOLID — Single Responsibility)

**Problema actual:** El router `orders.py` mezcla HTTP routing, construcción de objetos de dominio, envío de emails, y lógica de negocio en ~400 líneas.

**Solución en Laravel:**

```
app/
├── Http/
│   ├── Controllers/
│   │   └── OrderController.php      ← Solo HTTP: request/response
│   └── Requests/
│       └── CreateOrderRequest.php   ← Solo validación
├── Services/
│   ├── OrderService.php             ← Solo lógica de negocio
│   └── OrderNotificationService.php ← Solo emails
├── Models/
│   └── Order.php                    ← Solo ORM/datos
└── Mail/
    ├── OrderConfirmation.php        ← Mailable con template Blade
    └── ShippingGuideUpdated.php     ← Mailable
```

### 11.2 Query Object Pattern para el Catálogo (25 endpoints → 1)

**Problema actual:** 25 endpoints y 20 métodos de CRUD para cubrir combinaciones de filtros.

**Solución:**

```php
Route::get('/products', [ProductController::class, 'index']);

public function index(Request $request): ResourceCollection
{
    $products = QueryBuilder::for(Product::class)
        ->allowedFilters([
            AllowedFilter::exact('compresion'),
            AllowedFilter::scope('byTag'),
            AllowedFilter::scope('byCategory'),
            AllowedFilter::scope('bySubcategory'),
            AllowedFilter::scope('byType'),
            AllowedFilter::scope('byDesign'),
            AllowedFilter::custom('search', new ProductSearchFilter),
        ])
        ->allowedIncludes(['images', 'sizes', 'colors', 'design', 'type', 'subcategory', 'tags'])
        ->allowedSorts(['price', 'name', 'created_at'])
        ->paginate($request->per_page ?? 20);

    return ProductResource::collection($products);
}
```

### 11.3 Event-Driven para Notificaciones (Observer Pattern)

**Problema actual:** Los emails se envían síncronamente dentro del request HTTP, lo que hace que la respuesta al cliente dependa del tiempo de envío de email.

**Solución en Laravel:**

```php
// Order.php Model
protected $dispatchesEvents = [
    'created' => OrderCreated::class,
];

// SendOrderConfirmationEmail.php Listener
public function handle(OrderCreated $event): void
{
    Mail::to($event->order->email)
        ->queue(new OrderConfirmation($event->order)); // ← asíncrono via Queue
}
```

### 11.4 Domain-Driven Design Ligero (DDD Táctico)

Organizar el código por dominio de negocio en lugar de por tipo de archivo:

```
app/
├── Domain/
│   ├── Catalog/
│   │   ├── Models/     (Product, Category, Design, Type, Tag)
│   │   ├── Services/   (ProductCatalogService)
│   │   └── Actions/    (ImportProductsFromExcel)
│   ├── Commerce/
│   │   ├── Models/     (Order, Pack, DiscountCode)
│   │   ├── Services/   (OrderService, DiscountService)
│   │   └── Actions/    (CreateOrder, ApplyDiscount)
│   ├── Logistics/
│   │   ├── Models/     (Shipping)
│   │   └── Services/   (ShippingCalculator)
│   └── Marketing/
│       ├── Models/     (Slider, WishList, Customer)
│       └── Services/   (WishListService, FacebookPixelService)
├── Http/               (Controllers, Requests, Resources)
├── Jobs/               (Background workers)
└── Mail/               (Mailables)
```

### 11.5 Typed API Resources para el Frontend

**Problema actual:** El backend retorna respuestas inconsistentes. El frontend no tiene tipado.

**Solución — Contrato tipado en ambos extremos:**

```php
// Laravel API Resource (contrato explícito)
class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'compresion' => $this->compresion,
            'images' => ImageResource::collection($this->whenLoaded('images')),
            'sizes' => SizeResource::collection($this->whenLoaded('sizes')),
            'colors' => ColorResource::collection($this->whenLoaded('colors')),
        ];
    }
}
```

```typescript
// Vue 3 TypeScript (mismo contrato)
interface Product {
  id: number
  name: string
  price: number
  compresion: boolean
  images: Image[]
  sizes: Size[]
  colors: Color[]
}
```

### 11.6 Normalización del Modelo de Órdenes

El modelo `Order` actual embebe datos del cliente en la orden sin FK a `Customer`. La migración permite normalizar:

```
orders
├── id
├── customer_id          ← FK → customers (nuevo)
├── shipping_address_id  ← FK → addresses (nuevo)
├── billing_address_id   ← FK → addresses (nuevo)
├── gift_message_from    ← renombrado desde "de"
├── gift_message_to      ← renombrado desde "para"
├── is_gift
├── total
├── subtotal
├── shipping_cost
├── preference_id        (MercadoPago)
└── payment_id           ← corregido desde "pyment_id"
```

### 11.7 Paginación y Caché de Consultas

- Laravel `paginate(20)` retorna metadata nativa (`total`, `per_page`, `next_page_url`)
- Para endpoints de solo lectura del catálogo (categorías, tipos, diseños): `Cache::remember()` con TTL de 10 minutos
- En el frontend Vue: TanStack Query para caché del lado cliente con stale-while-revalidate

---

## 12. Recomendaciones Finales

### 12.1 Criterios Go/No-Go

**GO — Proceder con la migración si:**

1. El equipo puede asignar al menos 3 desarrolladores a tiempo completo por 9 meses. Una migración parcial con recursos insuficientes es peor que no migrar.
2. Se confirma que Laravel/Vue 3 es estratégico para la organización (otros proyectos activos en ese stack).
3. Se puede establecer un ambiente de staging con datos reales para validar la paridad funcional.
4. La gerencia acepta un período de 3-4 meses sin nuevas features en el storefront (durante las Fases 1-3).
5. Existe presupuesto y disposición para contratar al menos 1 senior con experiencia real en Laravel.

**NO-GO — Posponer o reconsiderar si:**

1. El equipo tiene menos de 2 desarrolladores disponibles.
2. Se espera un período de alta demanda de negocio en los próximos 6 meses.
3. No existe experiencia interna en PHP moderno o Vue 3.
4. El principal motivador es "las tendencias tecnológicas" sin una necesidad de negocio concreta.

### 12.2 Alternativa si No se Migra: Modernización del Stack Actual

Si la migración no es viable en este momento, el sistema actual puede modernizarse sin cambiar el stack:

1. Actualizar FastAPI a 0.111+ y Pydantic a v2.
2. Migrar el frontend React a TypeScript.
3. Implementar la capa de seguridad faltante (autenticación, CORS correcto, secrets en env).
4. Refactorizar `products.py` usando parámetros de query en lugar de 25 endpoints.
5. Separar la lógica de negocio de los routers en Service classes Python.
6. Añadir tests con pytest-fastapi.

**Costo estimado:** 2-3 meses de trabajo. Resuelve los problemas más críticos sin el riesgo de una migración completa.

### 12.3 Factores Críticos de Éxito

1. **La Fase 0 es no negociable.** Las vulnerabilidades de seguridad actuales deben corregirse antes de cualquier otra inversión de tiempo, independientemente de la decisión sobre la migración.

2. **Automatizar la suite de paridad.** El mayor riesgo técnico es introducir regresiones funcionales que no se detecten hasta que los clientes las encuentren. Una suite automatizada que compara respuestas de ambas APIs es la única mitigación real.

3. **No migrar y agregar features simultáneamente.** La Fase 2 debe ser una reimplementación exacta del comportamiento actual. "Ya que estamos migrando, también mejoramos X" es la causa principal de migraciones que nunca terminan.

4. **Designar un DRI (Directly Responsible Individual) técnico.** La migración requiere decisiones de arquitectura continuas. Debe haber una persona con autoridad y accountability final sobre las decisiones técnicas.

5. **Planificar el rollback para cada cutover.** Cada cutover debe tener un plan de rollback ejecutable en menos de 15 minutos, con backup de base de datos y el sistema anterior en standby.

6. **Comunicar los tiempos al negocio con buffer del 30%.** Si el equipo tiene menos experiencia en el stack objetivo, agregar 30-40% a cada fase.

### 12.4 Recomendación Final

La migración a Laravel + Vue 3 es **recomendada** para ItSocks, bajo las siguientes condiciones:

- Adoptar la **Estrategia C: Migración por Fases con Saneamiento Previo**.
- Iniciar **INMEDIATAMENTE la Fase 0** de saneamiento de seguridad — esto no es negociable y no depende de la decisión final sobre la migración.
- Asegurar **al menos 1 desarrollador senior con experiencia real en Laravel** antes de iniciar la Fase 1.
- Priorizar la **migración del backend primero** (Fases 1-3), desacoplada del frontend, lo que permite validar la nueva arquitectura antes de comprometer también el storefront.

El estado actual del código — con vulnerabilidades críticas activas, lógica de negocio mezclada en routers HTTP, un sistema de rutas de 743 líneas, y sin cobertura de tests — justifica la inversión en una reescritura. La pregunta estratégica no es si se debe modernizar el sistema, sino con qué stack, con qué equipo, y en qué plazos realistas.

---

*Este análisis fue generado mediante inspección directa del código fuente del repositorio ItSocks. Todas las afirmaciones sobre el estado del código (vulnerabilidades, typos, estructuras de archivos) están referenciadas en archivos específicos del repositorio.*

**Archivos de referencia del análisis:**
- `backend/app/api/api_v1/routers/products.py` — 25+ endpoints de filtro
- `backend/app/api/api_v1/routers/orders.py` — lógica de negocio mezclada con routing
- `backend/app/api/api_v1/routers/files.py` — importación Excel masiva
- `backend/app/api/api_v1/routers/payments.py` — credenciales hardcodeadas
- `backend/app/crud/crud_product.py` — 20+ métodos de filtrado
- `frontend/src/itsocks/routes/ItSocksRoutes.jsx` — 743 líneas de rutas declarativas
