---
nombre: "Fase 4 — Frontend Vue 3 (Storefront)"
version: "1.0"
fecha: "2026-04-23"
propietario: "daaltoto@gmail.com"
estado: "aprobado"
tipo: "spec-implementacion"
alcance: "itsocks-vue/ — construcción del storefront Vue 3 con paridad funcional vs React 18"
agente: "agente-vue3-frontend-fase4"
rama: "feature/fase-4-vue3-frontend"
---

# Spec Fase 4: Frontend Vue 3

## 1. Objetivo

Construir el nuevo storefront de ItSocks en Vue 3 con TypeScript, Pinia y Tailwind CSS, reemplazando el frontend React 18 actual. El nuevo storefront debe tener paridad funcional completa con el frontend React y conectarse al backend Laravel (F3 ya completada).

**Tiempo estimado:** 11 semanas (6 sprints)  
**Prerrequisito:** F3 completada (backend Laravel en producción)

---

## 2. Setup del Proyecto

```bash
cd /Users/datorot/Documents/Projects/ItSocks

# Crear proyecto Vue 3 con TypeScript, Router, Pinia, ESLint
npm create vue@latest itsocks-vue -- \
  --typescript \
  --router \
  --pinia \
  --eslint-with-prettier \
  --vitest

cd itsocks-vue

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer @tailwindcss/vite
npx tailwindcss init -p

# HTTP y estado
npm install axios @tanstack/vue-query

# UI
npm install swiper @headlessui/vue @heroicons/vue

# Testing
npm install -D @vue/test-utils jsdom @testing-library/vue

git checkout -b feature/fase-4-vue3-frontend
```

### Configuración Tailwind (`tailwind.config.js`)
```js
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Paleta ItSocks
        brand: { DEFAULT: '#YOUR_COLOR', dark: '#DARKER' }
      }
    }
  }
}
```

---

## 3. Estructura de Directorios

```
itsocks-vue/src/
├── api/
│   ├── client.ts          → Axios instance con interceptores
│   ├── productApi.ts      → Endpoints de catálogo
│   ├── orderApi.ts        → Endpoints de órdenes
│   ├── authApi.ts         → Login/logout
│   └── ...
├── composables/
│   ├── useApi.ts          → Wrapper genérico de Axios
│   ├── useFilters.ts      → Filtros del catálogo reactivos
│   ├── useMercadoPago.ts  → Bricks de pago
│   ├── useIntersection.ts → Infinite scroll
│   └── usePagination.ts   → Paginación
├── stores/
│   ├── cartStore.ts
│   ├── wishlistStore.ts
│   ├── packStore.ts
│   ├── shippingStore.ts
│   ├── discountStore.ts
│   ├── preferenceStore.ts
│   └── authStore.ts
├── router/
│   └── index.ts           → 15 rutas paramétricas
├── components/
│   ├── ui/                → Button, Input, Badge, Modal, Spinner, Alert
│   ├── layout/            → Navbar, Footer, Breadcrumb
│   ├── product/           → ProductCard, ProductFilter, ProductGallery
│   ├── cart/              → CartItem, CartSummary, CartDrawer
│   └── pack/              → PackCard, PackDetail
├── pages/
│   ├── HomePage.vue
│   ├── medias/
│   │   ├── MediasLayout.vue
│   │   ├── SubcategoryPage.vue
│   │   └── ProductListPage.vue
│   ├── products/
│   │   └── ProductDetailPage.vue
│   ├── packs/
│   │   ├── PacksPage.vue
│   │   └── PackDetailPage.vue
│   ├── checkout/
│   │   ├── CartPage.vue
│   │   ├── CheckoutPage.vue
│   │   ├── BillingPage.vue
│   │   └── OrderConfirmationPage.vue
│   └── info/
│       ├── SizeGuidePage.vue
│       ├── FAQPage.vue
│       ├── ShippingPolicyPage.vue
│       └── PrivacyPage.vue
└── types/
    └── index.ts           → Interfaces TypeScript
```

---

## 4. Definición de Stores Pinia

### cartStore.ts
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const itemCount = computed(() =>
    items.value.reduce((acc, item) => acc + item.quantity, 0)
  )

  function addItem(product: Product, size: Size, quantity: number, packId?: number) {
    const existing = items.value.find(
      i => i.product.id === product.id && i.size.id === size.id
    )
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, size, quantity, pack_id: packId })
    }
  }

  function removeItem(productId: number, sizeId: number) {
    items.value = items.value.filter(
      i => !(i.product.id === productId && i.size.id === sizeId)
    )
  }

  function clearCart() { items.value = [] }

  return { items, total, itemCount, addItem, removeItem, clearCart }
}, { persist: true })
```

### Otros stores (estructura similar):
- `wishlistStore`: `items[]`, `token`, `addItem()`, `removeItem()`, `share()`
- `packStore`: `selectedPack`, `setSelectedPack()`, `clearPack()`
- `shippingStore`: `selectedCity`, `shippingRate`, `setCity()`, `fetchRate()`
- `discountStore`: `code`, `discountAmount`, `validateCode()`, `clearDiscount()`
- `preferenceStore`: `preferenceId`, `setPreferenceId()`, `clearPreference()`
- `authStore`: `user`, `token`, `isAuthenticated`, `login()`, `logout()`

---

## 5. Sistema de Rutas Vue Router

```typescript
// router/index.ts
const routes = [
  {
    path: '/',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/medias/:subcategoria',
    component: () => import('@/pages/medias/MediasLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/medias/SubcategoryPage.vue') },
      { path: ':tipo', component: () => import('@/pages/medias/ProductListPage.vue') },
      { path: ':tipo/:disenio', component: () => import('@/pages/medias/ProductListPage.vue') },
      { path: ':tipo/:disenio/:compresion', component: () => import('@/pages/medias/ProductListPage.vue') },
      { path: ':tipo/:disenio/:compresion/:nombre', component: () => import('@/pages/products/ProductDetailPage.vue') },
    ]
  },
  { path: '/packs', component: () => import('@/pages/packs/PacksPage.vue') },
  { path: '/packs/:id', component: () => import('@/pages/packs/PackDetailPage.vue') },
  { path: '/carrito', component: () => import('@/pages/checkout/CartPage.vue') },
  { path: '/checkout', component: () => import('@/pages/checkout/CheckoutPage.vue') },
  { path: '/billing', component: () => import('@/pages/checkout/BillingPage.vue') },
  { path: '/order/:id', component: () => import('@/pages/checkout/OrderConfirmationPage.vue') },
  { path: '/wishlist/:token', component: () => import('@/pages/WishListPage.vue') },
  { path: '/buscar', component: () => import('@/pages/SearchPage.vue') },
  { path: '/guia-de-tallas', component: () => import('@/pages/info/SizeGuidePage.vue') },
  { path: '/envios', component: () => import('@/pages/info/ShippingPolicyPage.vue') },
  { path: '/faq', component: () => import('@/pages/info/FAQPage.vue') },
  { path: '/politica-de-datos', component: () => import('@/pages/info/PrivacyPage.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]
```

---

## 6. Tabla de Equivalencia de Componentes React → Vue

| Componente React | Componente Vue 3 | Notas |
|-----------------|-----------------|-------|
| `Navbar.jsx` | `components/layout/Navbar.vue` | Carrito reactivo con `useCartStore` |
| `Footer.jsx` | `components/layout/Footer.vue` | |
| `ProductoCard.jsx` | `components/product/ProductCard.vue` | |
| `ProductoList.jsx` | `pages/medias/ProductListPage.vue` | Paginación o infinite scroll |
| `ListaCarrito.jsx` | `components/cart/CartSummary.vue` | |
| `CarritoCompras.jsx` | `pages/checkout/CartPage.vue` | |
| `Billing.jsx` | `pages/checkout/BillingPage.vue` | |
| `BillingInfo.jsx` | `pages/checkout/CheckoutPage.vue` | |
| `FinishOrder.jsx` | `pages/checkout/OrderConfirmationPage.vue` | |
| `PackCard.jsx` | `components/pack/PackCard.vue` | |
| `Packs.jsx` | `pages/packs/PacksPage.vue` | |
| `Search.jsx` | `pages/SearchPage.vue` | |
| `WishList.jsx` | `pages/WishListPage.vue` | |
| `GuiaTallas.jsx` | `pages/info/SizeGuidePage.vue` | |
| `Carousel` (react-slick) | Swiper.js `<Swiper>` | |
| `ScrollHorizontal.jsx` | Swiper.js con `slidesPerView: 'auto'` | |
| `TagFilter.jsx` | `components/product/ProductFilter.vue` | |
| `PopUps.jsx` | `components/ui/Modal.vue` (HeadlessUI) | |

---

## 7. Interfaces TypeScript Principales

```typescript
// types/index.ts

export interface Product {
  id: number
  name: string
  slug: string
  price: number
  compresion: boolean
  design: Design
  type: Type
  subcategory: Subcategory
  images: Image[]
  sizes: Size[]
  colors: Color[]
  tags: Tag[]
}

export interface Order {
  id: number
  customer_name: string
  email: string
  phone: string
  total: number
  subtotal: number
  shipping_cost: number
  discount_amount: number
  payment_id: string        // nota: corregido de pyment_id en la BD
  billing_address: string   // nota: corregido de billing_addess en la BD
  gift_from?: string        // nota: corregido de 'de' en la BD
  gift_to?: string          // nota: corregido de 'para' en la BD
  is_gift: boolean
  status: OrderStatus
  tracking_number?: string
  items: OrderItem[]
}

export interface CartItem {
  product: Product
  size: Size
  quantity: number
  pack_id?: number
  price: number
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
```

---

## 8. Integración MercadoPago Bricks

```typescript
// composables/useMercadoPago.ts
export function useMercadoPago() {
  const preferenceStore = usePreferenceStore()
  let bricksController: any = null

  async function initWallet(containerId: string) {
    const mp = new (window as any).MercadoPago(
      import.meta.env.VITE_MP_PUBLIC_KEY,
      { locale: 'es-CO' }
    )
    const bricks = mp.bricks()
    bricksController = await bricks.create('wallet', `#${containerId}`, {
      initialization: { preferenceId: preferenceStore.preferenceId },
      customization: {
        texts: { valueProp: 'smart_option' }
      },
      callbacks: {
        onReady: () => {},
        onError: (error: any) => console.error('MP Error:', error),
      }
    })
  }

  function destroyBricks() {
    if (bricksController) bricksController.unmount()
  }

  return { initWallet, destroyBricks }
}
```

Cargar el SDK en `index.html`:
```html
<script src="https://sdk.mercadopago.com/js/v2"></script>
```

---

## 9. Composable `useApi`

```typescript
// composables/useApi.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor de request: adjuntar token Sanctum
apiClient.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

// Interceptor de response: manejar 401
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
    }
    return Promise.reject(error)
  }
)

export function useApi() {
  return { api: apiClient }
}
```

---

## 10. Plan de Sprints

### Sprint 1 — Semanas 20-21: Arquitectura Base
**Entregables:**
- Proyecto Vue 3 configurado con TypeScript, Tailwind, Pinia, Vue Router
- 7 stores Pinia con persistencia en localStorage (pinia-plugin-persistedstate)
- Composable `useApi` con Axios + interceptores
- Sistema de rutas completo (15 rutas, lazy loading)
- Variables de entorno (`VITE_API_URL`, `VITE_MP_PUBLIC_KEY`)
- `npm run dev` levanta sin errores y navega entre rutas

**Criterio de aceptación:** Navegar a `/medias/pantorrilleras` y `/packs` no da 404.

### Sprint 2 — Semanas 22-23: Componentes UI
**Entregables:**
- Navbar con contador de carrito reactivo, búsqueda y link a wishlist
- Footer con links a páginas informativas
- ProductCard con imagen, nombre, precio y botón "Agregar al carrito"
- Carousel con Swiper.js (reemplaza react-slick y react-multi-carousel)
- Spinner/SkeletonLoader para estados de carga
- Breadcrumb dinámico basado en la ruta

**Criterio de aceptación:** Navbar muestra `(3)` cuando hay 3 items en el carrito.

### Sprint 3 — Semanas 24-25: Catálogo
**Entregables:**
- HomePage con Sliders (banners) y secciones de productos destacados
- SubcategoryPage con grid de productos y filtros laterales
- ProductListPage con filtros por tipo/diseño/compresión reactivos
- Paginación o infinite scroll en listados
- Integración con API Laravel (`GET /api/v1/products?filter[...]`)

**Criterio de aceptación:** Filtrar por subcategoría "pantorrilleras" muestra solo productos de esa subcategoría.

### Sprint 4 — Semanas 26-27: Detalle y Búsqueda
**Entregables:**
- ProductDetailPage con galería de imágenes, selector de talla y botón de carrito
- PackDetailPage con composición de pack y precio
- SearchPage con resultados en tiempo real (debounce 300ms)
- Páginas de estilos de vida (running, trabajo, formal, etc.)

**Criterio de aceptación:** Seleccionar talla en detalle de producto y agregar al carrito actualiza el contador del navbar.

### Sprint 5 — Semanas 28-29: Flujo de Compra (Crítico)
**Entregables:**
- CartPage con resumen, modificación de cantidades y validación de stock
- CheckoutPage con formulario de envío y cálculo de tarifa en tiempo real
- BillingPage con datos de facturación y código de descuento
- Integración MercadoPago Bricks (Wallet Brick)
- OrderConfirmationPage post-pago con resumen y número de orden

**Criterio de aceptación:** Flujo completo: agregar producto → checkout → pago en sandbox MP → página de confirmación muestra número de orden.

### Sprint 6 — Semana 30: Complementarios y Testing
**Entregables:**
- WishListPage con compartir por URL pública (token)
- SizeGuidePage, ShippingPolicyPage, FAQPage, PrivacyPage
- Tests E2E del flujo de compra completo (Playwright) — ver sección 13
- Tests unitarios de stores Pinia (carrito, descuentos) — ver sección 14
- Optimizaciones: lazy loading de imágenes, code splitting

**Criterio de aceptación:** Lighthouse ≥ 80 en mobile. Tests E2E del flujo de compra verde.

---

## 11. Variables de Entorno

```
# .env
VITE_API_URL=https://api.itsocks.co/api/v1
VITE_MP_PUBLIC_KEY=APP_USR-xxxxxxxx

# .env.local (desarrollo)
VITE_API_URL=http://localhost:8000/api/v1
VITE_MP_PUBLIC_KEY=TEST-xxxxxxxx  # clave sandbox
```

---

## 12. Criterios de Aceptación Finales

| Criterio | Métrica |
|----------|---------|
| Lighthouse Performance (mobile) | ≥ 80 |
| Lighthouse Accessibility | ≥ 85 |
| Flujo de compra E2E | 100% verde en Playwright |
| Tests unitarios stores | ≥ 90% cobertura |
| Sin errores TypeScript | `tsc --noEmit` sin errores |
| Sin errores ESLint | `npm run lint` sin errores |
| Todas las rutas de React funcionan | Redirects 301 cubren URLs antiguas |

---

## 13. Configuración Playwright E2E

### Instalación

```bash
cd itsocks-vue
npm install -D @playwright/test
npx playwright install chromium  # suficiente para CI; agregar firefox para local
```

### `e2e/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,  // los tests comparten estado de BD de staging
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  expect: { timeout: 8_000 },

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Limpiar localStorage entre tests para que el carrito empiece vacío
    storageState: undefined,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
```

### `e2e/fixtures/index.ts` — Datos compartidos entre tests

```typescript
// Datos que el seeder de Laravel ya creó (deben coincidir con ProductSeeder)
export const TEST_PRODUCT_LARGA = {
  name: 'Media Flash Larga',
  category: 'Medias',
  subcategory: 'Estampadas',
  type: 'Largas',
  price: 45000,
}

export const TEST_PRODUCT_ACCESORIO = {
  name: 'Termo Test',
  category: 'Accesorios',
  subcategory: 'Termos',
  price: 35000,
}

export const TEST_DISCOUNT_CODE = 'TEST10'
export const TEST_CITY = 'Bogotá'
export const TEST_DEPARTMENT = 'Bogotá D.C.'

export const TEST_CUSTOMER = {
  name: 'Juan',
  lastName: 'Pérez',
  email: 'test@playwright.com',
  phone: '3001234567',
  document: '12345678',
  address: 'Calle 123 # 45-67',
}
```

### `e2e/helpers/cart.ts` — Helper para limpiar estado

```typescript
import { Page } from '@playwright/test'

export async function clearCart(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('cart')
    localStorage.removeItem('shipping')
    localStorage.removeItem('discount')
    localStorage.removeItem('preference')
  })
}

export async function mockMercadoPago(page: Page) {
  // Intercepta la carga del SDK de MercadoPago y devuelve un stub
  await page.route('https://sdk.mercadopago.com/js/v2', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        window.MercadoPago = function(key, opts) {
          this.bricks = () => ({
            create: async (type, containerId, config) => {
              const el = document.getElementById(containerId.replace('#', ''));
              if (el) {
                el.innerHTML = '<button id="mp-wallet-stub" data-testid="mp-wallet">Pagar con MercadoPago (TEST)</button>';
              }
              config?.callbacks?.onReady?.();
              return { unmount: () => {} };
            }
          });
        };
      `,
    })
  })
}
```

### Tests E2E — Los 8 flujos críticos

#### `e2e/tests/E2E-01-catalogo.spec.ts`
```typescript
test('E2E-01: Explorar catálogo y ver detalle de producto', async ({ page }) => {
  await page.goto('/medias/estampadas')
  await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible()

  await page.locator('[data-testid="product-card"]').first().click()

  // Verificar que la página de detalle carga correctamente
  await expect(page.locator('[data-testid="product-name"]')).toBeVisible()
  await expect(page.locator('[data-testid="product-price"]')).toBeVisible()
  await expect(page.locator('[data-testid="size-selector"]')).toBeVisible()
  await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible()
})
```

#### `e2e/tests/E2E-02-carrito.spec.ts`
```typescript
test('E2E-02: Agregar producto al carrito y verificar qty', async ({ page }) => {
  await clearCart(page)
  await page.goto('/medias/estampadas/largas')

  await page.locator('[data-testid="product-card"]').first().click()
  await page.locator('[data-testid="size-selector"] button').first().click()
  await page.locator('[data-testid="add-to-cart-btn"]').click()

  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')

  await page.goto('/carrito')
  await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
  await expect(page.locator('[data-testid="cart-total"]')).toBeVisible()

  // Incrementar cantidad
  await page.locator('[data-testid="qty-increase"]').click()
  await expect(page.locator('[data-testid="cart-item-qty"]')).toHaveText('2')

  // Eliminar
  await page.locator('[data-testid="remove-item-btn"]').click()
  await expect(page.locator('[data-testid="cart-empty"]')).toBeVisible()
})
```

#### `e2e/tests/E2E-03-checkout-envio.spec.ts`
```typescript
test('E2E-03: Carrito → Billing → verificar cálculo de envío', async ({ page }) => {
  await clearCart(page)
  // Agregar un producto primero (reutilizar helper de E2E-02)
  await addProductToCart(page)

  await page.goto('/checkout')
  await page.locator('[data-testid="input-name"]').fill(TEST_CUSTOMER.name)
  await page.locator('[data-testid="input-lastname"]').fill(TEST_CUSTOMER.lastName)
  await page.locator('[data-testid="input-email"]').fill(TEST_CUSTOMER.email)
  await page.locator('[data-testid="input-phone"]').fill(TEST_CUSTOMER.phone)

  // Seleccionar departamento → esperar ciudades → seleccionar ciudad
  await page.locator('[data-testid="department-select"]').selectOption(TEST_DEPARTMENT)
  await page.waitForResponse(r => r.url().includes('/shippings') && r.status() === 200)
  await page.locator('[data-testid="city-select"]').selectOption(TEST_CITY)

  // Verificar que el costo de envío se calcula
  await expect(page.locator('[data-testid="shipping-cost"]')).not.toHaveText('—')
  await expect(page.locator('[data-testid="order-total"]')).toBeVisible()
})
```

#### `e2e/tests/E2E-04-descuento.spec.ts`
```typescript
test('E2E-04: Aplicar código de descuento y verificar total', async ({ page }) => {
  await clearCart(page)
  await addProductToCart(page)
  await fillShippingForm(page)

  const totalAntes = await page.locator('[data-testid="order-total"]').textContent()

  await page.locator('[data-testid="discount-input"]').fill(TEST_DISCOUNT_CODE)
  await page.locator('[data-testid="apply-discount-btn"]').click()

  await expect(page.locator('[data-testid="discount-applied"]')).toBeVisible()
  const totalDespues = await page.locator('[data-testid="order-total"]').textContent()
  expect(totalDespues).not.toBe(totalAntes)

  // Quitar descuento
  await page.locator('[data-testid="remove-discount-btn"]').click()
  await expect(page.locator('[data-testid="discount-applied"]')).not.toBeVisible()
})
```

#### `e2e/tests/E2E-05-finish-order.spec.ts`
```typescript
test('E2E-05: Billing → Finish Order → MP Wallet carga', async ({ page }) => {
  await mockMercadoPago(page)
  await clearCart(page)
  await addProductToCart(page)
  await fillShippingForm(page)

  await page.locator('[data-testid="next-step-btn"]').click()
  await page.waitForURL('**/billing')

  // Verificar que el Wallet de MP aparece (stub del mock)
  await expect(page.locator('[data-testid="mp-wallet"]')).toBeVisible({ timeout: 10_000 })
  await expect(page.locator('[data-testid="order-summary"]')).toBeVisible()
})
```

#### `e2e/tests/E2E-06-busqueda.spec.ts`
```typescript
test('E2E-06: Búsqueda de producto', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="search-input"]').fill('flash')
  await page.locator('[data-testid="search-input"]').press('Enter')

  await page.waitForURL('**/buscar**')
  await expect(page.locator('[data-testid="search-result"]').first()).toBeVisible()
  await page.locator('[data-testid="search-result"]').first().click()
  await expect(page.locator('[data-testid="product-name"]')).toBeVisible()
})
```

#### `e2e/tests/E2E-07-favoritos.spec.ts`
```typescript
test('E2E-07: Agregar a favoritos y compartir lista', async ({ page }) => {
  await page.goto('/medias/estampadas')
  await page.locator('[data-testid="wishlist-btn"]').first().click()
  await expect(page.locator('[data-testid="wishlist-toast"]')).toBeVisible()

  await page.goto('/lista_de_favoritos')
  await expect(page.locator('[data-testid="wishlist-item"]')).toHaveCount(1)

  const shareUrl = await page.locator('[data-testid="share-url"]').inputValue()
  expect(shareUrl).toMatch(/\/lista_de_favoritos\/[a-z0-9-]+/)
})
```

#### `e2e/tests/E2E-08-packs.spec.ts`
```typescript
test('E2E-08: Ver pack y agregarlo al carrito', async ({ page }) => {
  await clearCart(page)
  await page.goto('/packs')
  await expect(page.locator('[data-testid="pack-card"]').first()).toBeVisible()

  await page.locator('[data-testid="pack-card"]').first().click()
  await expect(page.locator('[data-testid="pack-detail"]')).toBeVisible()
  await expect(page.locator('[data-testid="pack-price"]')).toBeVisible()

  await page.locator('[data-testid="add-pack-to-cart-btn"]').click()
  await expect(page.locator('[data-testid="cart-count"]')).not.toHaveText('0')
})
```

---

## 14. Tests Unitarios de Stores Pinia

```typescript
// src/stores/__tests__/cartStore.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cartStore'

describe('cartStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('agrega producto al carrito', () => {
    const cart = useCartStore()
    const product = { id: 1, name: 'Media Test', price: 45000 } as any
    const size = { id: 1, name: 'M' } as any

    cart.addItem(product, size, 2)

    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].quantity).toBe(2)
    expect(cart.total).toBe(90000)
  })

  it('incrementa cantidad si el mismo producto/talla ya está', () => {
    const cart = useCartStore()
    const product = { id: 1, name: 'Test', price: 45000 } as any
    const size = { id: 1, name: 'M' } as any

    cart.addItem(product, size, 1)
    cart.addItem(product, size, 1)

    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].quantity).toBe(2)
  })

  it('elimina producto del carrito', () => {
    const cart = useCartStore()
    const product = { id: 1, name: 'Test', price: 45000 } as any
    const size = { id: 1, name: 'M' } as any

    cart.addItem(product, size, 1)
    cart.removeItem(1, 1)

    expect(cart.items).toHaveLength(0)
  })
})

// src/stores/__tests__/discountStore.spec.ts
describe('discountStore', () => {
  it('aplica descuento porcentual correctamente', async () => {
    // Mock de la API
    vi.mock('@/api/productApi', () => ({
      validateDiscount: vi.fn().mockResolvedValue({ valid: true, discount: 10 })
    }))

    const discount = useDiscountStore()
    await discount.validateCode('TEST10', 100000)

    expect(discount.discountAmount).toBe(10000)
    expect(discount.code).toBe('TEST10')
  })
})
```

---

## 15. Lighthouse CI — Configuración y Umbrales

### Instalación

```bash
npm install -D @lhci/cli
```

### `lighthouserc.js`

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/medias/estampadas',
        'http://localhost:5173/medias/estampadas/largas',
        'http://localhost:5173/packs',
        'http://localhost:5173/carrito',
      ],
      numberOfRuns: 2,
      settings: { preset: 'desktop' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.80 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.80 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
}
```

### Comando en `package.json`

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:lighthouse": "lhci autorun",
    "test:unit": "vitest run",
    "test:all": "npm run test:unit && npm run test:e2e"
  }
}
```

---

## 16. Fuera de Alcance

- Cutover a producción (F5)
- Panel de administración Filament (F6)
- SEO avanzado (meta tags dinámicas, sitemap) — puede añadirse después
- App móvil nativa
- PWA (puede considerarse como mejora post-migración)
