---
name: playwright-e2e
description: Ejecuta tests de interfaz visual usando el MCP de Playwright sobre el storefront de ItSocks (React actual o Vue 3 nuevo). Úsalo cuando el usuario diga "probar el frontend", "test E2E", "playwright test", "/playwright-e2e", "verificar el flujo de compra visualmente", "tomar screenshot del sitio", o cuando quiera verificar que una funcionalidad del frontend funciona correctamente en el navegador.
---

# Playwright E2E — Tests visuales del frontend ItSocks

Ejecuta tests de interfaz visual usando el MCP de Playwright para verificar los flujos críticos del storefront ItSocks. Funciona tanto con el frontend React actual como con el nuevo frontend Vue 3.

## Qué hace este skill

1. Navega el frontend usando MCP Playwright
2. Interactúa con la UI (clicks, formularios, scroll)
3. Toma screenshots en puntos clave del flujo
4. Verifica que los elementos esperados están presentes
5. Limpia el estado (localStorage) entre flujos
6. Reporta resultado ✅/❌ por flujo con evidencia visual

## Flujos disponibles

| Comando | Flujo | Páginas involucradas |
|---------|-------|---------------------|
| `/playwright-e2e catalogo` | E2E-01: Explorar catálogo y ver producto | `/medias/estampadas` → ProductDetail |
| `/playwright-e2e carrito` | E2E-02: Agregar al carrito | ProductDetail → `/carrito` |
| `/playwright-e2e checkout` | E2E-03: Checkout con cálculo de envío | `/carrito` → Checkout/Billing |
| `/playwright-e2e descuento` | E2E-04: Aplicar código de descuento | Billing con código TEST10 |
| `/playwright-e2e finish-order` | E2E-05: Finish order + MP Wallet | Billing → FinishOrder |
| `/playwright-e2e busqueda` | E2E-06: Búsqueda de productos | Search → ProductDetail |
| `/playwright-e2e favoritos` | E2E-07: Lista de favoritos y compartir | Catálogo → `/lista_de_favoritos` |
| `/playwright-e2e packs` | E2E-08: Ver y agregar pack al carrito | `/packs` → PackDetail → carrito |
| `/playwright-e2e all` | Todos los flujos en secuencia | Todos |

## Workflow

### Paso 0 — Configurar URL base

Si no se especifica, preguntar:
```
URL del frontend a testear: [default: http://localhost:5173]
```

Verificar que el frontend está corriendo:
- `mcp__playwright__browser_navigate` a la URL base
- Verificar que la página carga (no da error de conexión)

### Paso 1 — Limpiar estado entre flujos

Antes de cada flujo, limpiar el localStorage para empezar desde cero:

```javascript
// Ejecutar via mcp__playwright__browser_evaluate
localStorage.removeItem('cart');
localStorage.removeItem('pinia-cart');
localStorage.removeItem('shipping');
localStorage.removeItem('discount');
localStorage.removeItem('preference');
localStorage.removeItem('wish');
```

### Paso 2 — Stub de MercadoPago (para flujos que llegan a FinishOrder)

Para los flujos E2E-05 y E2E-08, inyectar un stub del SDK de MercadoPago antes de navegar:

```javascript
// Ejecutar via mcp__playwright__browser_evaluate en la página raíz
window.MercadoPago = function(key, opts) {
  this.bricks = function() {
    return {
      create: async function(type, containerId, config) {
        const el = document.querySelector(containerId);
        if (el) {
          el.innerHTML = '<button id="mp-wallet-stub" style="background:#009ee3;color:white;padding:12px 24px;border:none;border-radius:6px;font-size:16px;cursor:pointer;">Pagar con MercadoPago (TEST)</button>';
        }
        if (config && config.callbacks && config.callbacks.onReady) {
          config.callbacks.onReady();
        }
        return { unmount: function() {} };
      }
    };
  };
};
```

### Paso 3 — Ejecutar flujo seleccionado

#### Flujo E2E-01: Catálogo

```
1. mcp__playwright__browser_navigate → /medias/estampadas
2. mcp__playwright__browser_snapshot → verificar que hay ProductCards
3. mcp__playwright__browser_take_screenshot → "01-catalogo-productos.png"
4. mcp__playwright__browser_click → primer ProductCard
5. mcp__playwright__browser_wait_for → selector del nombre del producto
6. mcp__playwright__browser_snapshot → verificar nombre, precio, selector de tallas
7. mcp__playwright__browser_take_screenshot → "01-producto-detalle.png"
RESULTADO: ✅ si ProductCard existe y ProductDetail cargó
```

#### Flujo E2E-02: Carrito

```
1. Ejecutar E2E-01 hasta llegar al ProductDetail
2. mcp__playwright__browser_click → primer botón de talla disponible
3. mcp__playwright__browser_click → botón "Agregar al carrito"
4. mcp__playwright__browser_wait_for → contador del carrito en navbar != 0
5. mcp__playwright__browser_take_screenshot → "02-producto-agregado.png"
6. mcp__playwright__browser_navigate → /carrito
7. mcp__playwright__browser_snapshot → verificar item en carrito
8. mcp__playwright__browser_take_screenshot → "02-carrito-con-producto.png"
RESULTADO: ✅ si el producto aparece en el carrito con qty > 0
```

#### Flujo E2E-03: Checkout

```
1. Ejecutar E2E-02 hasta tener producto en carrito
2. mcp__playwright__browser_click → botón "Continuar" o "Checkout"
3. mcp__playwright__browser_wait_for → formulario de checkout carga
4. mcp__playwright__browser_fill_form → nombre, apellido, email, teléfono, documento
5. mcp__playwright__browser_select_option → departamento "Bogotá D.C."
6. mcp__playwright__browser_wait_for → opciones de ciudad cargan
7. mcp__playwright__browser_select_option → ciudad "Bogotá"
8. mcp__playwright__browser_wait_for → costo de envío aparece (no vacío)
9. mcp__playwright__browser_take_screenshot → "03-checkout-con-envio.png"
RESULTADO: ✅ si el costo de envío se muestra (incluye "0" para Bogotá)
```

#### Flujo E2E-04: Descuento

```
1. Ejecutar E2E-03 hasta llegar al checkout con envío calculado
2. mcp__playwright__browser_fill_form → campo de cupón con "TEST10"
3. mcp__playwright__browser_click → botón "Aplicar"
4. mcp__playwright__browser_wait_for → mensaje de descuento aplicado
5. mcp__playwright__browser_take_screenshot → "04-descuento-aplicado.png"
6. Verificar que el total disminuyó
RESULTADO: ✅ si aparece confirmación de descuento y total es menor
```

#### Flujo E2E-05: Finish Order + MP Wallet

```
1. Ejecutar E2E-03, luego inyectar stub de MercadoPago
2. mcp__playwright__browser_click → botón "Continuar" / "Siguiente paso"
3. mcp__playwright__browser_wait_for → página de FinishOrder/Billing carga
4. mcp__playwright__browser_wait_for → botón "Pagar con MercadoPago (TEST)" visible
5. mcp__playwright__browser_take_screenshot → "05-finish-order-mp-wallet.png"
RESULTADO: ✅ si el stub del Wallet de MP es visible
```

#### Flujo E2E-06: Búsqueda

```
1. mcp__playwright__browser_navigate → URL base
2. mcp__playwright__browser_click → ícono/campo de búsqueda en navbar
3. mcp__playwright__browser_type → "flash"
4. mcp__playwright__browser_press_key → Enter
5. mcp__playwright__browser_wait_for → resultados de búsqueda cargan
6. mcp__playwright__browser_take_screenshot → "06-resultados-busqueda.png"
7. mcp__playwright__browser_click → primer resultado
8. mcp__playwright__browser_wait_for → ProductDetail carga
RESULTADO: ✅ si hay resultados y ProductDetail carga
```

#### Flujo E2E-07: Favoritos

```
1. mcp__playwright__browser_navigate → /medias/estampadas
2. mcp__playwright__browser_click → botón de favorito (corazón) del primer producto
3. mcp__playwright__browser_wait_for → toast/notificación de "agregado"
4. mcp__playwright__browser_navigate → /lista_de_favoritos
5. mcp__playwright__browser_snapshot → verificar producto en lista
6. mcp__playwright__browser_take_screenshot → "07-lista-favoritos.png"
RESULTADO: ✅ si el producto aparece en la lista de favoritos
```

#### Flujo E2E-08: Packs

```
1. mcp__playwright__browser_navigate → /packs
2. mcp__playwright__browser_snapshot → verificar PackCards presentes
3. mcp__playwright__browser_click → primer PackCard
4. mcp__playwright__browser_wait_for → PackDetail carga
5. mcp__playwright__browser_snapshot → verificar precio y descripción
6. mcp__playwright__browser_take_screenshot → "08-pack-detalle.png"
RESULTADO: ✅ si PackDetail carga con precio visible
```

### Paso 4 — Reporte de resultados

```
PLAYWRIGHT E2E REPORT — [timestamp]
=====================================
URL testeada: http://localhost:5173
Frontend detectado: Vue 3 (itsocks-vue)

Flujo                    | Estado | Detalles
-------------------------|--------|------------------------------------------
E2E-01: Catálogo         | ✅ OK  | 12 productos encontrados, detalle cargó
E2E-02: Carrito          | ✅ OK  | Producto agregado, qty=1 en navbar
E2E-03: Checkout         | ✅ OK  | Envío Bogotá: $0 calculado correctamente
E2E-04: Descuento        | ❌ FAIL| Campo de cupón no encontrado en la página
E2E-05: MP Wallet        | ✅ OK  | Stub visible, botón de pago presente
E2E-06: Búsqueda         | ✅ OK  | 3 resultados para "flash"
E2E-07: Favoritos        | ✅ OK  | 1 producto en lista de favoritos
E2E-08: Packs            | ✅ OK  | 3 packs disponibles, detalle cargó

RESULTADOS: 7/8 pasando

FLUJOS FALLIDOS:
  E2E-04 — No se encontró el campo de cupón. Posibles causas:
    • El selector [data-testid="discount-input"] no existe en la página
    • El componente de descuento está en otra ruta
    Screenshot de falla: 04-descuento-error.png
```

## Casos especiales

**"El frontend no está corriendo"**: Mostrar el comando para levantarlo:
- React: `cd frontend && npm run dev`
- Vue 3: `cd itsocks-vue && npm run dev`

**"Las imágenes de productos no cargan (broken images)"**: Es normal si S3 no está configurado o si se usan URLs placeholder. Los tests verifican la presencia del elemento `<img>`, no que la imagen cargue correctamente.

**"El carrito no persiste entre navegaciones"**: Verificar que `pinia-plugin-persistedstate` está configurado o que localStorage no está siendo bloqueado.

**"MercadoPago real aparece en vez del stub"**: El SDK de MP puede estar en caché. Intentar con una sesión de incógnito via `mcp__playwright__browser_navigate` con opción fresh.

## Ejemplo de uso

```
Usuario: /playwright-e2e carrito
Claude: [navega el frontend, agrega producto, verifica carrito, muestra screenshot]

Usuario: /playwright-e2e all
Claude: [ejecuta todos los 8 flujos en secuencia, muestra reporte final]

Usuario: /playwright-e2e checkout
Claude: [ejecuta flujo de checkout específico con formulario de envío]
```

## Dependencias

- MCP Playwright configurado y disponible:
  - `mcp__playwright__browser_navigate`
  - `mcp__playwright__browser_snapshot`
  - `mcp__playwright__browser_click`
  - `mcp__playwright__browser_fill_form`
  - `mcp__playwright__browser_take_screenshot`
  - `mcp__playwright__browser_evaluate`
  - `mcp__playwright__browser_wait_for`
  - `mcp__playwright__browser_select_option`
  - `mcp__playwright__browser_type`
  - `mcp__playwright__browser_press_key`
- Frontend corriendo en localhost (React en :5173 o Vue en :5173)
- Backend API corriendo (FastAPI en :8000 o Laravel en :8000)
- Datos de prueba en la BD (productos, categorías, shipping de Bogotá)

## Notas técnicas

- Los `data-testid` usados en este skill corresponden a los definidos en la spec F4 — deben implementarse en los componentes Vue
- Para el frontend React actual, los selectores pueden diferir — usar `mcp__playwright__browser_snapshot` primero para inspeccionar la estructura del DOM antes de hacer clicks
- Si un selector no se encuentra, usar `mcp__playwright__browser_snapshot` para ver la estructura actual de la página y ajustar la estrategia
- El stub de MercadoPago reemplaza la carga del SDK real — debe inyectarse ANTES de navegar a la página de FinishOrder
