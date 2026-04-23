---
name: "Order Tests — Unit Test Specification"
version: "1.0"
date: "2026-04-16"
owner: "daaltoto@gmail.com"
status: "approved"
type: "test-spec"
scope: "orders + product_orders + order_report across backend, frontend, admin-itsocks"
---

# Spec — Tests unitarios para módulos de órdenes

## 1. Objetivo

Implementar una suite de **tests unitarios** para todos los módulos relacionados con órdenes en ItSocks, abarcando las tres capas del sistema (backend, frontend, admin-itsocks). La suite debe:

- Alcanzar **90% de cobertura de líneas** en los archivos listados en §4.
- **Documentar bugs existentes** mediante tests que fallen (rojos) o estén marcados `xfail`/`todo` — **sin corregir el código fuente**.
- Mockear completamente dependencias externas (MercadoPago, SMTP email, localStorage).

## 2. Alcance

### En alcance
- Backend: `models/order`, `models/product_order`, `schemas/order`, `schemas/product_order`, `crud/crud_order`, `crud/crud_product_order`, `routers/orders`, `routers/product_orders`.
- Frontend: `reducers/orderReducer`, `hooks/useOrder`, `hooks/useOrderReducer`, `context/order`, `itsocks/helpers/setOrder`, `itsocks/components/FinishOrderForm`, `itsocks/pages/FinishOrder`, `itsocks/pages/OrderDescription`.
- Admin: `Order/OrderList`, `Order/OrderEdit`, `Order/index`, `OrderReport/OrderReportCreate`, `OrderReport/OrderReportEdit`, `OrderReport/OrderReportrList`, `OrderReport/index`.

### Fuera de alcance
- Tests de integración end-to-end.
- Tests contra MercadoPago sandbox real.
- Tests contra servidor SMTP real.
- Refactorización del código fuente (los bugs quedan documentados, no corregidos).

## 3. Tipo de tests

**Unit tests únicamente** — aislamiento total de dependencias externas. Se permite una DB SQLite en memoria para el CRUD/router de backend porque SQLAlchemy es una dependencia de primera clase (no externa), pero cualquier servicio externo (SMTP, MercadoPago, AWS S3, red) debe estar mockeado.

## 4. Meta de cobertura

| Capa | Path raíz | Meta línea |
|---|---|---|
| Backend | `backend/app/` (solo archivos del §2) | **90%** |
| Frontend | `frontend/src/` (solo archivos del §2) | **90%** |
| Admin | `admin-itsocks/src/Order/` y `admin-itsocks/src/OrderReport/` | **90%** |

Nota: los archivos vacíos (`OrderReportCreate.jsx`, `OrderReportEdit.jsx`) se incluyen con un único test que verifica que el módulo importa sin errores y genera una nota "pendiente de implementación".

## 5. Stack técnico

### Backend (`backend/app/`)
Añadir al `pyproject.toml`:
```toml
[tool.poetry.group.test.dependencies]
pytest = "^7.4"
pytest-asyncio = "^0.21"
pytest-cov = "^4.1"
httpx = "^0.24"
```

Estructura:
```
backend/app/tests/
├── __init__.py
├── conftest.py          # fixtures de DB, client, factories
├── unit/
│   ├── __init__.py
│   ├── test_schemas_order.py
│   ├── test_schemas_product_order.py
│   ├── test_models_order.py
│   ├── test_models_product_order.py
│   ├── test_crud_order.py
│   └── test_crud_product_order.py
└── routers/
    ├── __init__.py
    ├── test_router_orders.py
    └── test_router_product_orders.py
```

DB de test: **SQLite en memoria** (`sqlite:///:memory:`) con `Base.metadata.create_all` por fixture `function`-scoped.

### Frontend (`frontend/`) y Admin (`admin-itsocks/`)
Añadir al `package.json` (en ambos proyectos):
```json
"devDependencies": {
  "vitest": "^1.6.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/user-event": "^14.5.0",
  "@testing-library/jest-dom": "^6.4.0",
  "jsdom": "^24.0.0",
  "@vitest/coverage-v8": "^1.6.0"
}
```

`vite.config.js`:
```js
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
  coverage: { provider: 'v8', reporter: ['text', 'html'] }
}
```

Estructura frontend:
```
frontend/src/test/
├── setup.js             # jest-dom + localStorage mock global
└── mocks/
    ├── mercadopago.js   # mock de @mercadopago/sdk-react
    └── localStorage.js  # mock de window.localStorage
frontend/src/reducers/__tests__/orderReducer.test.js
frontend/src/hooks/__tests__/useOrder.test.jsx
frontend/src/hooks/__tests__/useOrderReducer.test.jsx
frontend/src/context/__tests__/order.test.jsx
frontend/src/itsocks/helpers/__tests__/setOrder.test.js
frontend/src/itsocks/components/__tests__/FinishOrderForm.test.jsx
frontend/src/itsocks/pages/__tests__/FinishOrder.test.jsx
frontend/src/itsocks/pages/__tests__/OrderDescription.test.jsx
```

Estructura admin (espeja la del frontend bajo `admin-itsocks/src/`).

## 6. Estrategia de mocking

| Dependencia | Estrategia |
|---|---|
| **MercadoPago SDK** (`@mercadopago/sdk-react`) | Mock completo vía `vi.mock()`. `initMercadoPago` como `vi.fn()` no-op; `Wallet` como componente stub que renderiza `<div data-testid="wallet-mock" />`. |
| **SMTP** (`smtplib.SMTP` en `routers/orders.py`) | `unittest.mock.patch('app.api.api_v1.routers.orders.smtplib.SMTP')` en cada test que invoque endpoints que disparan email. Las helpers `create_order_send_email`, `update_guide_send_email`, `update_state_send_email` se patchean donde se llaman. |
| **`window.localStorage`** | Mock completo global en `src/test/setup.js`: `Object.defineProperty(window, 'localStorage', { value: { getItem, setItem, removeItem, clear } })`. Reset en `beforeEach`. |
| **`fetchWithoutToken`** (en `setOrder.js`) | Mock vía `vi.mock('../../utils/api')` devolviendo una respuesta `Response`-like con `.json()` configurable por test. |
| **React Router** (`useNavigate`, `useParams`) | Envolver en `<MemoryRouter>` o mockear hooks puntuales con `vi.mock('react-router-dom', ...)`. |
| **React Admin data provider** | Usar `<AdminContext dataProvider={testDataProvider(...)} />` de `react-admin` para proveer un dataProvider en memoria. |

## 7. Casos de negocio — Backend

### 7.1 `schemas/order.py` — `test_schemas_order.py`

| # | Test | Tipo |
|---|---|---|
| SO-01 | `OrderCreate` válido con todos los campos requeridos → instancia OK | feliz |
| SO-02 | `OrderCreate` sin `first_name` → `ValidationError` | error |
| SO-03 | `OrderCreate` sin `email` → `ValidationError` | error |
| SO-04 | `OrderCreate` con `isGift=False` → `isGift` persiste como `False` | feliz |
| SO-05 | `OrderCreate` sin `shipping_guide` → default `"No asignada"` | default |
| SO-06 | `OrderCreate` sin `paid_status` → default `"Pendiente"` | default |
| SO-07 | `OrderCreate` con `quantity` negativo → acepta (Pydantic v1 no valida; documentar con `xfail` + comentario) | **bug documentado** |
| SO-08 | `OrderCreate` con `email` malformado → acepta (el schema usa `str`, no `EmailStr`; documentar con `xfail`) | **bug documentado** |
| SO-09 | `OrderUpdate` con payload parcial falla porque todos los campos son requeridos (hereda de `OrderBase`) — documentar este comportamiento | comportamiento |

### 7.2 `schemas/product_order.py` — `test_schemas_product_order.py`

| # | Test | Tipo |
|---|---|---|
| SPO-01 | `ProductOrderCreate` válido → OK | feliz |
| SPO-02 | Sin `product_id` → `ValidationError` | error |
| SPO-03 | Sin `order_id` → `ValidationError` | error |
| SPO-04 | `discount` default = 0 | default |
| SPO-05 | `discount_code` default = `""` | default |
| SPO-06 | `price_paid` default = 0.0 | default |

### 7.3 `models/order.py` — `test_models_order.py`

| # | Test |
|---|---|
| MO-01 | Crear `Order` con campos mínimos + persistir en sesión → `id` generado |
| MO-02 | `shipping_guide` default = `"No asignada"` al crear sin valor |
| MO-03 | `paid_status` default = `"Pendiente"` |
| MO-04 | `isGift` default = `False` |
| MO-05 | `created_at` y `updated_at` se asignan en la creación |
| MO-06 | Relación `product_order` inicia vacía y acepta `ProductOrder` asociados |

### 7.4 `models/product_order.py` — `test_models_product_order.py`

| # | Test |
|---|---|
| MPO-01 | Crear `ProductOrder` con `product_id` + `order_id` + `quantity` → OK |
| MPO-02 | `quantity` default = 1 |
| MPO-03 | `num_in_order` default = 1 |
| MPO-04 | `discount` default = 0 |
| MPO-05 | `price_paid` default = 0.0 |
| MPO-06 | Relación bidireccional con `Order` (la orden ve su `product_order` y viceversa) |

### 7.5 `crud/crud_order.py` — `test_crud_order.py`

| # | Test | Notas |
|---|---|---|
| CO-01 | `create` (heredado de `CRUDBase`) con `OrderCreate` válido → persiste y retorna | feliz |
| CO-02 | `get(db, id=...)` con id existente → retorna la orden | feliz |
| CO-03 | `get(db, id=...)` con id inexistente → retorna `None` | feliz |
| CO-04 | `get_orders(db, skip=0, limit=10)` → retorna lista paginada | feliz |
| CO-05 | `get_order_list(db, skip=, limit=)` → idéntico a `get_orders` (documentar duplicación) | comportamiento |
| CO-06 | `get_single_order(db, id=...)` con id existente → retorna la orden | feliz |
| CO-07 | `get_single_order(db, id=...)` con id inexistente → retorna `None` | feliz |
| CO-08 | `remove_order(db, code=...)` con `code` cualquiera → **falla** porque `get_by_code` consulta `Order.code` que no existe | **bug documentado** (marcar `xfail(strict=True)` con razón: "bug: Order model no tiene campo `code`") |
| CO-09 | `get_by_code(db, code=...)` → **falla** con `OperationalError` / `InvalidRequestError` | **bug documentado** (`xfail`) |
| CO-10 | `get_order_by_name(db, name=...)` → **falla** porque `Order.name` no existe | **bug documentado** (`xfail`) |
| CO-11 | `object_as_dict(order)` → retorna dict con columnas del modelo | feliz |

### 7.6 `crud/crud_product_order.py` — `test_crud_product_order.py`

| # | Test |
|---|---|
| CPO-01 | `create(db, obj_in=...)` con datos válidos → persiste |
| CPO-02 | `get_product_order(db, product_id, order_id)` → retorna la línea si existe |
| CPO-03 | `get_product_order(db, product_id, order_id)` → `None` si no existe |
| CPO-04 | `get_by_code` → **bug documentado** (`ProductOrder` no tiene `code`) |
| CPO-05 | `remove_tag(db, code=...)` → **bug documentado** (depende de `get_by_code`) |
| CPO-06 | `get_order_by_name(db, order=...)` → **bug documentado** (consulta `Order.order` que no existe) |

### 7.7 `routers/orders.py` — `test_router_orders.py`

Todos usan `TestClient` + `override_get_db`. **SMTP siempre mockeado.**

| # | Test |
|---|---|
| RO-01 | `GET /orders` vacío → `[]` + header `Content-Range: 0-9/0` |
| RO-02 | `GET /orders` con 3 órdenes → lista con 3 |
| RO-03 | `GET /orders?skip=1&limit=1` → paginación correcta |
| RO-04 | `GET /orders/single_order/{id}` existente → objeto |
| RO-05 | `GET /orders/single_order/{id}` inexistente → 404 |
| RO-06 | `GET /orders/{id}` (order_detail) existente con productos → devuelve `products` ordenado por `num_in_order` |
| RO-07 | `GET /orders/{id}` sin `product_order` → `products = []` |
| RO-08 | `GET /orders/{id}` inexistente → 404 |
| RO-09 | `GET /orders/{id}` con `pack` que contiene "pares" → `products[].pack` se asigna; si no contiene "pares" → string vacío |
| RO-10 | `POST /orders` con payload válido → 200 + `smtplib.SMTP` llamado una vez |
| RO-11 | `POST /orders` con payload inválido (falta `email`) → 422 + SMTP **no** llamado |
| RO-12 | `POST /orders` cuando SMTP falla (excepción en `sendmail`) → documentar comportamiento actual (la excepción propaga y el endpoint responde 500) |
| RO-13 | `PUT /orders/{id}` cambiando `shipping_guide` y `shipping_guide_number` → `state = "Preparado"`, `shipping_guide = "Asignada"`, SMTP llamado |
| RO-14 | `PUT /orders/{id}` sin cambiar guía → no llama SMTP, no cambia state |
| RO-15 | `PUT /orders/{id}` inexistente → 404 |
| RO-16 | `DELETE /orders/{id}` existente → 200 + orden removida |
| RO-17 | `DELETE /orders/{id}` inexistente → 404 |

### 7.8 `routers/product_orders.py` — `test_router_product_orders.py`

| # | Test |
|---|---|
| RPO-01 | `GET /product_orders` vacío → `[]` |
| RPO-02 | `GET /product_orders/{id}` existente → objeto |
| RPO-03 | `GET /product_orders/{id}` inexistente → 404 |
| RPO-04 | `POST /product_orders` válido → 200 + persiste |
| RPO-05 | `POST /product_orders` inválido (sin `quantity`) → 422 |
| RPO-06 | `PUT /product_orders/{id}` existente → actualiza |
| RPO-07 | `PUT /product_orders/{id}` inexistente → 404 |
| RPO-08 | `DELETE /product_orders/{id}` existente → 200 |
| RPO-09 | `DELETE /product_orders/{id}` inexistente → 404 |

## 8. Casos de negocio — Frontend

### 8.1 `reducers/orderReducer.js` — `orderReducer.test.js`

| # | Test | Tipo |
|---|---|---|
| FR-01 | `orderInitialState` lee desde `localStorage`; si `null` → `{}` | feliz |
| FR-02 | `orderInitialState` con `localStorage` populado → parsea JSON | feliz |
| FR-03 | `ADD_TO_ORDER` reemplaza el state entero por `payload` | feliz |
| FR-04 | `CLEAR_ORDER` → state = `{}` + `localStorage` vacío | feliz |
| FR-05 | `CREATE_ORDER` → persiste `payload` en state y `localStorage` | feliz |
| FR-06 | `SUBSTRACT_PRODUCT_FROM_ORDER` con `state.productos` poblado → **falla** porque el reducer lee `state.prductos` (typo) | **bug documentado** (`it.fails` o `expect(...).toThrow`) |
| FR-07 | `UPDATE_ORDER` → persiste state actual en `localStorage` | feliz |
| FR-08 | `REMOVE_FROM_ORDER` dispatch → state sin cambios (**handler no implementado**) | **bug documentado** |
| FR-09 | `ADD_ONE_TO_ORDER` dispatch → state sin cambios | **bug documentado** |
| FR-10 | `SUBTRACT_ONE_TO_ORDER` dispatch → state sin cambios | **bug documentado** |
| FR-11 | Acción desconocida → retorna state sin cambios | feliz |
| FR-12 | `updateLocalStorage({foo: 1})` → `localStorage.setItem('order', '{"foo":1}')` | feliz |

### 8.2 `hooks/useOrder.js` — `useOrder.test.jsx`

| # | Test |
|---|---|
| UO-01 | `useOrder()` sin `<OrderProvider>` → lanza `Error('useOrder must be used within a OrderProvider')` |
| UO-02 | `useOrder()` dentro de `<OrderProvider>` → retorna el valor del contexto |

### 8.3 `hooks/useOrderReducer.js` — `useOrderReducer.test.jsx`

| # | Test |
|---|---|
| UOR-01 | Estado inicial es `orderInitialState` |
| UOR-02 | `addToOrder(product)` → dispatch + state actualizado |
| UOR-03 | `createOrder(order)` → dispatch + state actualizado + localStorage |
| UOR-04 | `clearOrder()` → state `{}` |
| UOR-05 | `updateOrder()` → dispatch sin payload, persiste en localStorage |
| UOR-06 | `substrackProductFromOrder(product)` → dispatch; efecto documenta el bug del typo (FR-06) |
| UOR-07 | `addOneToOrder`, `subtractOneToOrder`, `removeFromOrder` → dispatch pero state no cambia (documentar) |

### 8.4 `context/order.jsx` — `order.test.jsx`

| # | Test |
|---|---|
| CTX-01 | `<OrderProvider>` importa `useOrderReducer` desde `../hooks/useOrder` → **bug documentado**: el archivo `useOrder.js` no exporta `useOrderReducer` (está en `useOrderReducer.js`). Test verifica que el import falla o que el proveedor no funciona según estado actual. |
| CTX-02 | Si el import funciona por hot-reload/cache, el provider expone `order`, `addToOrder`, `clearOrder`, `createOrder`, `substrackProductFromOrder`, `updateOrder` |
| CTX-03 | Provider **no** expone `addOneToOrder`, `subtractOneToOrder`, `removeFromOrder` aunque `useOrderReducer` los retorna → **bug documentado** |

### 8.5 `itsocks/helpers/setOrder.js` — `setOrder.test.js`

| # | Test |
|---|---|
| SO-01 | `setOrder(order)` invoca `fetchWithoutToken('orders', order, 'POST')` |
| SO-02 | `setOrder(order)` retorna el resultado de `.json()` |
| SO-03 | `setProductOrder(po)` invoca `fetchWithoutToken('product_orders', po, 'POST')` |
| SO-04 | `setProductOrder(po)` retorna el resultado de `.json()` |
| SO-05 | Si `fetchWithoutToken` rechaza → `setOrder` propaga el error |

### 8.6 `itsocks/components/FinishOrderForm.jsx` — `FinishOrderForm.test.jsx`

MercadoPago SDK mockeado. Hooks `useShipping`, `useCart`, `useDiscount`, `usePreference` mockeados.

| # | Test |
|---|---|
| FF-01 | Renderiza header con logo y fase 2 |
| FF-02 | Renderiza input de email con `shipping.email` como valor inicial |
| FF-03 | Renderiza input de dirección con `shipping.address` |
| FF-04 | Escribir en el input de email actualiza el valor (userEvent) |
| FF-05 | Escribir en el input de dirección actualiza el valor |
| FF-06 | Click en lápiz de email → focus en input (verificar con `document.activeElement`) |
| FF-07 | Hover sobre icono tooltip → muestra mensaje "En este correo recibirás…" |
| FF-08 | Unhover → oculta tooltip |
| FF-09 | `shipping.shipping_value > 0` → muestra valor formateado en COP |
| FF-10 | `shipping.shipping_value === 0` → muestra "Envío Gratis" |
| FF-11 | `preference` no vacío → renderiza botón "Pagar con Mercado Pago" |
| FF-12 | `preference` vacío → no renderiza botón de pago |
| FF-13 | Click en "Volver a información" → `navigate('/carrito/billing')` + `removeFromDiscount()` |
| FF-14 | Click en "Pagar con Mercado Pago" → invoca `setOrder` con payload derivado de `shipping` |
| FF-15 | Tras `setOrder` resuelve, invoca `setProductOrder` por cada ítem del carrito |
| FF-16 | Productos con `name` que contiene "pares" → itera `product.prductos` (typo preservado) → **bug documentado** con test que falla si carrito tiene "pares" sin `prductos` |
| FF-17 | Productos normales calculan `price_paid = price - price*discount/100` |
| FF-18 | `initMercadoPago` se invoca con `'APP_USR-394df966-…'` y locale `es-CO` |

### 8.7 `itsocks/pages/FinishOrder.jsx` — `FinishOrder.test.jsx`

| # | Test |
|---|---|
| FO-01 | Renderiza `<FinishOrderForm>` y `<ProductsBillingList>` |
| FO-02 | Pasa `precio_envio="$ 5.600,00"` a `ProductsBillingList` |

### 8.8 `itsocks/pages/OrderDescription.jsx` — `OrderDescription.test.jsx`

| # | Test |
|---|---|
| OD-01 | Con `useParams` devolviendo `{id_order: '42'}` → renderiza "Order ID: 42" |
| OD-02 | Con `id_order` ausente → renderiza "Order ID: " |

## 9. Casos de negocio — Admin

### 9.1 `Order/OrderList.jsx` — `OrderList.test.jsx`

Envolver con `<AdminContext dataProvider={testDataProvider(...)}>` + mock de `getList`.

| # | Test |
|---|---|
| AOL-01 | Renderiza columnas: id, first_name, quantity, state, paid_status, subtotal, shipping_cost, total, created_at |
| AOL-02 | `subtotal`, `shipping_cost`, `total` se formatean en COP |
| AOL-03 | `created_at` se formatea con locale `es-CO` |
| AOL-04 | Click en fila → `rowClick="edit"` (verificar atributo) |

### 9.2 `Order/OrderEdit.jsx` — `OrderEdit.test.jsx`

| # | Test |
|---|---|
| AOE-01 | Renderiza sección "Productos" con ArrayField de `products` |
| AOE-02 | Renderiza inputs de cliente: first_name, last_name, document, phone_number, email |
| AOE-03 | Renderiza inputs de facturación: country, region, city, billing_addess, extra_info |
| AOE-04 | Renderiza `BooleanInput` para `isGift` |
| AOE-05 | Renderiza inputs de guía: shipping_guide (disabled), shipping_guide_number, shipping_guide_url |
| AOE-06 | Renderiza montos formateados en COP |
| AOE-07 | Guardar formulario invoca `update` del dataProvider con el payload |

### 9.3 `Order/index.js` — `Order-index.test.js`

| # | Test |
|---|---|
| AOI-01 | Exporta `OrderList` y `OrderEdit` |

### 9.4 `OrderReport/OrderReportrList.jsx` — `OrderReportList.test.jsx`

| # | Test |
|---|---|
| ORL-01 | Renderiza columnas: id, first_name, quantity, state, paid_status, subtotal, shipping_cost, total, created_at |
| ORL-02 | Formatos COP + locale `es-CO` |

### 9.5 `OrderReport/OrderReportCreate.jsx` y `OrderReportEdit.jsx`

Archivos **vacíos** (1 línea). Tests documentan estado pendiente:

| # | Test |
|---|---|
| ORC-01 | `import` del módulo no lanza error |
| ORC-02 | Test marcado `.todo('OrderReportCreate pendiente de implementación — archivo vacío')` |
| ORE-01 | `import` del módulo no lanza error |
| ORE-02 | Test marcado `.todo('OrderReportEdit pendiente de implementación — archivo vacío')` |

### 9.6 `OrderReport/index.js` — `OrderReport-index.test.js`

| # | Test |
|---|---|
| ORI-01 | Exporta los componentes esperados (verificar según lo que haga el archivo) |

## 10. Bugs documentados (resumen ejecutivo)

Esta tabla es el inventario de bugs que los tests **deben documentar sin corregir**. Cada bug debe tener al menos un test marcado `xfail(strict=True)` (pytest) o `it.fails` / `it.todo` (Vitest) con una razón explicativa.

| # | Ubicación | Bug | Test |
|---|---|---|---|
| B-01 | `crud/crud_order.py:38-44` | `get_by_code` consulta `Order.code` que no existe en el modelo | CO-09 |
| B-02 | `crud/crud_order.py:14-20` | `get_order_by_name` consulta `Order.name` que no existe | CO-10 |
| B-03 | `crud/crud_order.py:86-95` | `remove_order` depende de `get_by_code` (B-01) | CO-08 |
| B-04 | `crud/crud_product_order.py:39-45` | `get_by_code` consulta `ProductOrder.code` que no existe | CPO-04 |
| B-05 | `crud/crud_product_order.py:67-76` | `remove_tag` depende de `get_by_code` (B-04) | CPO-05 |
| B-06 | `crud/crud_product_order.py:15-21` | `get_order_by_name` consulta `Order.order` que no existe | CPO-06 |
| B-07 | `schemas/order.py:6-32` | `email` es `str` en vez de `EmailStr` — permite emails malformados | SO-08 |
| B-08 | `schemas/order.py` | No hay validación de `quantity >= 0` ni `total >= 0` | SO-07 |
| B-09 | `reducers/orderReducer.js:49-59` | `SUBSTRACT_PRODUCT_FROM_ORDER` lee `state.prductos` (typo) | FR-06 |
| B-10 | `reducers/orderReducer.js` | `REMOVE_FROM_ORDER`, `ADD_ONE_TO_ORDER`, `SUBTRACT_ONE_TO_ORDER` declarados pero sin handler | FR-08, FR-09, FR-10 |
| B-11 | `context/order.jsx:2` | Importa `useOrderReducer` desde `../hooks/useOrder` (debería ser `../hooks/useOrderReducer`) | CTX-01 |
| B-12 | `context/order.jsx:6-15` | Provider no expone `addOneToOrder`, `subtractOneToOrder`, `removeFromOrder` | CTX-03 |
| B-13 | `FinishOrderForm.jsx:133` | Itera `product.prductos` (typo; debería ser `productos`) | FF-16 |
| B-14 | `admin-itsocks/src/OrderReport/OrderReportCreate.jsx` | Archivo vacío | ORC-02 |
| B-15 | `admin-itsocks/src/OrderReport/OrderReportEdit.jsx` | Archivo vacío | ORE-02 |
| B-16 | `routers/orders.py:49-50` | Header `Content-Range` usa `0-9/{len(orders)}` incorrectamente (rango no corresponde a paginación real) | RO-01 (documentar valor observado) |
| B-17 | `routers/orders.py:181` | La condición `!= shipping_guide AND != shipping_guide_number` requiere ambos cambios; no dispara email si solo uno cambia | RO-13 (happy path con ambos) + extra xfail con solo uno |

## 11. Criterios de aceptación

La implementación de este spec se considera completa cuando:

1. ✅ La suite corre con un solo comando por capa y todos los tests en verde (excepto los marcados `xfail`/`todo`, que deben estar claramente identificados).
2. ✅ Cobertura de línea ≥ 90% en cada archivo listado en §4 (se permite < 90% solo en archivos vacíos como OrderReportCreate/Edit — documentado).
3. ✅ Todos los bugs de §10 tienen al menos un test que los documenta.
4. ✅ Ninguna dependencia externa real se invoca durante los tests (verificar con un run offline).
5. ✅ El CI-friendly exit code es 0 cuando la suite pasa.

## 12. Comandos de ejecución

### Backend
```bash
cd backend/app
poetry install --with test
pytest tests/ -v
pytest tests/ --cov=app.crud.crud_order --cov=app.crud.crud_product_order \
              --cov=app.api.api_v1.routers.orders --cov=app.api.api_v1.routers.product_orders \
              --cov=app.models.order --cov=app.models.product_order \
              --cov=app.schemas.order --cov=app.schemas.product_order \
              --cov-report=term-missing --cov-fail-under=90
```

### Frontend
```bash
cd frontend
npm install
npm run test
npm run test:coverage
```

### Admin
```bash
cd admin-itsocks
npm install
npm run test
npm run test:coverage
```

## 13. Orden de implementación sugerido

1. **Backend infra**: `conftest.py` + deps + un test smoke (`test_schemas_order.py SO-01`).
2. **Backend schemas + models** (más sencillos, sirven de validación de la infra).
3. **Backend CRUD** (incluye los `xfail` de bugs).
4. **Backend routers** (con mocks SMTP).
5. **Frontend infra**: `vite.config.js` test block + `setup.js` + mock global de MercadoPago y localStorage.
6. **Frontend pure-JS**: `orderReducer`, `setOrder`, `useOrder`, `useOrderReducer`.
7. **Frontend context + componentes**.
8. **Admin infra** (copia del frontend).
9. **Admin components** (Order + OrderReport).
10. **Ejecutar cobertura global** y ajustar tests hasta llegar al 90%.

## 14. Fuera de alcance explícito (no hacer)

- No corregir ninguno de los bugs listados en §10. Si al implementar tests se identifican bugs adicionales, agregarlos a §10 pero no corregirlos.
- No refactorizar el código fuente para facilitar los tests (ej. no extraer el envío de email a un servicio inyectable). Los mocks se aplican con `patch` directamente sobre el módulo.
- No añadir tests de integración entre capas (ej. frontend → backend real).
