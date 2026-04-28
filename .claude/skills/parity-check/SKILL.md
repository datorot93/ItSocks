---
name: parity-check
description: Verifica la paridad de respuestas entre el backend FastAPI y el nuevo backend Laravel durante la migración ItSocks. Úsalo cuando el usuario diga "verificar paridad", "comparar apis", "parity check", "/parity-check", "¿Laravel tiene los mismos datos que FastAPI?", o antes del cutover de backend (Fase 3).
---

# Parity Check — Verificación de paridad FastAPI ↔ Laravel

Compara automáticamente las respuestas de los dos backends (FastAPI y Laravel) para garantizar que el cutover de la Fase 3 es seguro. Detecta diferencias en conteos de datos, estructura de respuesta y headers críticos.

## Qué hace este skill

1. Verifica que ambas APIs estén corriendo y accesibles
2. Ejecuta los scripts de paridad si existen (`parity_suite.sh`, `verify_data_parity.sh`)
3. Si los scripts no existen todavía, ejecuta comparaciones manuales endpoint por endpoint
4. Verifica headers críticos para React Admin (`Content-Range`)
5. Reporta tabla detallada de PASS/FAIL por endpoint
6. Emite veredicto final: SEGURO ESCALAR / NO ESCALAR + razones

## Workflow

### Paso 1 — Configurar URLs

Preguntar al usuario (o usar defaults):
```
FastAPI URL: [default: http://127.0.0.1:8888/api/v1]
Laravel URL: [default: http://127.0.0.1:8000/api/v1]
Admin token (Laravel): [necesario para endpoints protegidos]
```

Verificar accesibilidad:
```bash
curl -sf "$FASTAPI/products?per_page=1" > /dev/null && echo "FastAPI OK" || echo "FastAPI NO DISPONIBLE"
curl -sf "$LARAVEL/products?per_page=1" > /dev/null && echo "Laravel OK" || echo "Laravel NO DISPONIBLE"
```

### Paso 2 — Ejecutar scripts de paridad (si existen)

```bash
# Verificar si los scripts existen
if [ -f "tests/parity/parity_suite.sh" ]; then
    bash tests/parity/parity_suite.sh
fi

if [ -f "tests/parity/verify_data_parity.sh" ]; then
    ADMIN_PASSWORD="$ADMIN_PASSWORD" bash tests/parity/verify_data_parity.sh
fi
```

### Paso 3 — Comparaciones manuales (si los scripts no existen)

Comparar los siguientes endpoints uno por uno:

**Endpoints públicos (catálogo):**
```bash
# Contar productos totales
FA_PRODUCTS=$(curl -sf "$FASTAPI/products?limit=1" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('total', len(d)))" 2>/dev/null)
LV_PRODUCTS=$(curl -sf "$LARAVEL/products?per_page=1" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('meta',{}).get('total','?'))" 2>/dev/null)
```

Endpoints a comparar:
| Endpoint | FastAPI path | Laravel path | Verificar |
|----------|-------------|--------------|-----------|
| Productos | `GET /products` | `GET /products` | total count |
| Categorías | `GET /categories` | `GET /categories` | count + names |
| Subcategorías | `GET /subcategories` | `GET /subcategories` | count |
| Tipos | `GET /types` | `GET /types` | count |
| Diseños | `GET /designs` | `GET /designs` | count |
| Colores | `GET /colors` | `GET /colors` | count |
| Tallas | `GET /sizes` | `GET /sizes` | count |
| Tags | `GET /tags` | `GET /tags` | count |
| Packs | `GET /packs` | `GET /packs` | count |
| Envíos | `GET /shippings` | `GET /shippings` | count |
| Órdenes | `GET /orders` (admin) | `GET /orders` (admin) | total count |

### Paso 4 — Verificar headers Content-Range

React Admin 5 depende del header `Content-Range` para la paginación. Verificar que Laravel lo incluye:

```bash
# FastAPI
FA_RANGE=$(curl -sI "$FASTAPI/orders?skip=0&limit=10" -H "Authorization: $FA_TOKEN" | grep -i "content-range")
# Laravel
LV_RANGE=$(curl -sI "$LARAVEL/orders?page=1&per_page=10" -H "Authorization: Bearer $LV_TOKEN" | grep -i "content-range")

echo "FastAPI Content-Range: $FA_RANGE"
echo "Laravel Content-Range: $LV_RANGE"
```

### Paso 5 — Verificar estructura de respuesta

Comparar que la estructura del JSON es compatible con lo que espera el frontend React:

```bash
# Verificar que /products retorna { data: [], links: {}, meta: {} } en Laravel
curl -sf "$LARAVEL/products?per_page=1" | python3 -c "
import sys, json
d = json.load(sys.stdin)
keys = set(d.keys())
required = {'data', 'links', 'meta'}
missing = required - keys
if missing:
    print(f'FALLA: Faltan campos en respuesta: {missing}')
else:
    print('OK: Estructura de respuesta correcta')
"
```

### Paso 6 — Reportar resultados

Mostrar tabla:
```
REPORTE DE PARIDAD — [timestamp]
================================
FastAPI: http://127.0.0.1:8888/api/v1
Laravel: http://127.0.0.1:8000/api/v1

Endpoint              | FastAPI | Laravel | Estado
----------------------|---------|---------|--------
GET /products         |   347   |   347   | ✅ OK
GET /categories       |     3   |     3   | ✅ OK
GET /subcategories    |     6   |     6   | ✅ OK
GET /types            |     3   |     3   | ✅ OK
GET /orders (admin)   |   892   |   892   | ✅ OK
Content-Range header  |   ✅    |   ✅    | ✅ OK
JSON structure        |   N/A   |   ✅    | ✅ OK

FALLOS: 0 / 11

VEREDICTO: 🟢 SEGURO ESCALAR — Proceder con cutover Fase 3
```

Si hay fallos:
```
VEREDICTO: 🔴 NO ESCALAR — Resolver antes del cutover:
  - GET /orders: FastAPI=892, Laravel=850 (42 órdenes faltantes)
  Acción: Verificar que el ShippingSeeder y OrderSeeder están completos
```

## Casos especiales

**"Laravel no está corriendo"**: Mostrar instrucciones para levantarlo:
`cd itsocks-laravel && php artisan serve --port=8000`

**"Hay diferencia de 1-5 registros"**: Puede ser normal si hay órdenes creadas durante el tiempo de divergencia. Pedir al usuario confirmar si es aceptable.

**"FastAPI no está corriendo (fase 3 ya completó)"**: Si el cutover ya terminó y FastAPI no corre, cambiar el modo a solo verificar Laravel.

## Ejemplo de uso

```
Usuario: /parity-check

Claude: Configurando verificación de paridad...
FastAPI: http://127.0.0.1:8888/api/v1 ✅
Laravel: http://127.0.0.1:8000/api/v1 ✅

Ejecutando comparaciones...
[tabla de resultados]

VEREDICTO: 🟢 SEGURO ESCALAR
```

## Dependencias

- `curl` disponible en el sistema
- `python3` para parsear JSON
- Ambas APIs corriendo en los puertos configurados
- Token de admin de Laravel (para endpoints protegidos)

## Notas técnicas

- El header `Content-Range` tiene formato diferente entre FastAPI (`0-9/100`) y Laravel (`items 0-9/100`) — verificar cuál espera el frontend React
- Los endpoints de FastAPI usan `skip`/`limit`, Laravel usa `page`/`per_page` — el script ajusta automáticamente
- Un diff de > 5 registros en órdenes es una señal de alerta seria y debe investigarse antes del cutover
