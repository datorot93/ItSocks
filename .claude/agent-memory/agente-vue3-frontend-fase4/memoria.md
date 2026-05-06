# Memoria Agente Vue 3 Frontend - Fase 4

## Sprints Completados

- Sprint 1 (2026-04-28): Arquitectura base — proyecto Vue 3, 7 stores Pinia, composables, router, env
- Sprint 2 (2026-04-28): Componentes UI — Navbar, Footer, Breadcrumb, ProductCard, Spinner, SkeletonLoader, Modal, Badge, Alert, PackCard, CartItem, CartSummary, ProductGallery, ProductFilter
- Sprint 3 (2026-04-28): Catálogo — HomePage, SubcategoryPage, ProductListPage, MediasLayout
- Sprint 4 (2026-04-28): Detalle y búsqueda — ProductDetailPage, PackDetailPage, PacksPage, SearchPage
- Sprint 5 (2026-04-28): Flujo de compra — CartPage, CheckoutPage, BillingPage, OrderConfirmationPage, integración MP Bricks
- Sprint 6 (2026-04-28): Complementarios — WishListPage, SizeGuidePage, FAQPage, ShippingPolicyPage, PrivacyPage, 8 E2E Playwright, unit tests stores

## Comportamientos No Obvios de React y Cómo Se Replicaron en Vue

1. **CartContext multi-operación**: El React original tenía `addPackToCart` separado de `addToCart`. En Vue se unificaron en `addItem(product, size, qty, packId?)` con el parámetro `packId` opcional.

2. **Rutas declarativas 743 líneas**: ItSocksRoutes.jsx generaba rutas dinámicamente con `filtrosAccesorios.map()`. En Vue se reemplazó con rutas paramétricas anidadas bajo `/medias/:subcategoria/:tipo/:disenio/:compresion/:nombre`.

3. **PreferenceStore (Redux slice)**: Redux tenía `preferenceReducer` que guardaba el `preferenceId` de MercadoPago. En Vue es un Pinia store simple con `setPreference(id, orderId)`.

4. **WishList compartible por token**: El React hacía una llamada API para generar el token. En Vue el `wishlistStore.share()` llama `wishlistApi.createWishlist(productIds)` y guarda el token en el store con persistencia.

5. **Rutas de búsqueda**: El React tenía `/search` y `/search/:product`. En Vue se usa solo `/buscar?q=...` con redirección 301 desde `/search`.

## Configuración MercadoPago Bricks

- SDK cargado en `index.html` como `<script src="https://sdk.mercadopago.com/js/v2"></script>`
- Composable `useMercadoPago()` en `src/composables/useMercadoPago.ts`
- El `preferenceId` se guarda en `preferenceStore` después de crear la orden en `BillingPage`
- El Wallet Brick se inicializa en el contenedor `#mp-checkout`
- Para tests E2E: se intercepta la URL del SDK con `page.route()` para retornar un stub

## Decisión Técnica: Pinia Persistence con Pinia v3

- `pinia-plugin-persistedstate` v4.7.1 no augmenta correctamente `DefineSetupStoreOptions` en Pinia v3.0.4
- Solución: `// @ts-ignore` en la opción `{ persist: true }` de cada store
- El plugin funciona en runtime — solo el tipo TypeScript no reconoce la opción

## Versiones Instaladas (desviación del plan)

El scaffolding npm create vue@latest instaló versiones más recientes:
- Tailwind CSS v4.2.4 (plan especificaba ^3.4) → requirió `@tailwindcss/postcss` y CSS `@import "tailwindcss"` en lugar de `@tailwind base/components/utilities`
- Pinia v3.0.4 (plan especificaba ^2.0) → sin breaking changes funcionales
- Vue Router v5.0.4 (plan especificaba ^4.0) → compatible
- Vite v8.0.10 (plan especificaba ^5.0) → compatible

## Rutas que Requieren Redirects 301 (para F5)

| URL React original | URL Vue nueva | Status |
|--------------------|---------------|--------|
| `/search` | `/buscar` | Redirect implementado en router |
| `/search/:product` | `/medias/.../:nombre` | Redirect parcial (pendiente F5) |
| `/medias` | `/` | Redirect implementado |
| `/accesorios` | `/medias/accesorios` | Redirect implementado |
| `/temporada` | `/` | Redirect implementado |
| `/lista_de_favoritos/:token` | `/lista_de_favoritos/:token` | Mismo path, compatible |

## Tests Unitarios

- 7 archivos de test, 42 tests en total
- Cobertura statements: 98.65%, branches: 84.21%, functions: 97.95%
- Tests pasan sin backend (mocks de API con vi.mock)

## E2E Playwright

- 8 tests en e2e/tests/
- Configuración en e2e/playwright.config.ts
- Helper mockMercadoPago() intercepta SDK con stub headless
- BLOCKER: Tests requieren backend API disponible en http://localhost:8000 (o staging)
  - Sin backend: 7 de 8 tests fallan por productos vacíos
  - Con backend: tests deben pasar según flujo funcional
