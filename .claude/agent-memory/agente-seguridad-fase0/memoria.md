# Memoria Agente Seguridad — Fase 0

## Rama
`feature/fase-0-seguridad`

## Routers modificados (S3 — Auth habilitada)

| Router | Endpoints protegidos | Endpoints dejados públicos |
|--------|---------------------|---------------------------|
| `orders.py` | GET (lista, single, detail), PUT, DELETE | POST (crear orden — cliente sin auth) |
| `products.py` | POST, PUT, DELETE (product_create, tag_create, product_edit, product_delete) | Todos los GET del catálogo |
| `categories.py` | POST, PUT, DELETE | GET (lista, by_id) |
| `designs.py` | POST, PUT, DELETE | GET (lista, by_id) |
| `types.py` | POST, PUT, DELETE | GET (lista, by_id) |
| `subcategories.py` | POST, PUT, DELETE | GET (lista, by_id) |
| `shippings.py` | POST, PUT, DELETE | Todos los GET (selección de envío por cliente) |
| `users.py` | GET (lista, by_id), POST, PUT, DELETE | ninguno |
| `sliders.py` | POST, PUT, DELETE | GET (lista, active, by_id) |
| `tags.py` | POST, PUT, DELETE | GET (lista, by_id) |
| `customers.py` | POST, PUT, GET (all_customers), DELETE | ninguno |
| `images.py` | POST, PUT, DELETE | GET (lista, by_id) |
| `colors.py` | POST (color_create, product_color_create), PUT, DELETE | GET (all_types) |
| `sizes.py` | POST, PUT, DELETE, POST (product_size_create) | GET (lista, by_id) |
| `size_guides.py` | POST, PUT, DELETE | GET (lista, by_name, by_id) |
| `product_orders.py` | GET (lista, by_id), POST, PUT, DELETE | ninguno |
| `product_sizes.py` | POST, PUT, DELETE | GET (lista, by_id) |
| `wish_lists.py` | POST, PUT, DELETE | GET (by_id_list) |
| `contact_infos.py` | PUT, DELETE | GET (lista, by_id) |
| `packs.py` | POST, PUT, DELETE | GET (lista, by_id, names) |
| `discount_codes.py` | POST, PUT, DELETE | GET (lista, by_id, active, specific) |
| `type_images.py` | POST, PUT, DELETE | GET (lista, by_id) |
| `sells_reports.py` | GET / (lista), GET /products_by_city, GET /detailed_orders, GET /products_sum, GET /single_order, GET /{id} | ninguno (todo admin) |
| `payments.py` | ninguno (endpoint de pagos es público — clientes crean preferencias) | POST create_payment_preference |

## Variables de entorno añadidas

### Nuevas (esta fase):
- `MERCADOPAGO_ACCESS_TOKEN` — clave de acceso MercadoPago (antes hardcodeada en payments.py)
- `SMTP_HOST` — servidor SMTP (default: smtp.gmail.com)
- `SMTP_PORT` — puerto SMTP (default: 587)
- `SMTP_USER` — usuario/email SMTP (antes hardcodeado como daaltoto@gmail.com)
- `SMTP_PASSWORD` — contraseña/app password SMTP (antes hardcodeada)

### Preexistentes (no modificadas):
- `POSTGRES_SERVER`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `AWS_REGION_NAME`, `AWS_BUCKET_NAME`
- `SECRET_KEY` (para JWT)

## Endpoints deliberadamente públicos (no protegidos)

1. `POST /api/v1/orders` — crear orden: el cliente en checkout no está autenticado
2. `POST /api/v1/payments/create_payment_preference` — crear preferencia MP: cliente sin auth
3. `GET /api/v1/shippings/*` — consultar tarifas de envío: clientes en checkout
4. `GET /api/v1/products/*` — catálogo público: storefront sin auth
5. `GET /api/v1/categories`, `/subcategories`, `/types`, `/designs` — catálogo
6. `GET /api/v1/sliders` — imágenes del sitio: públicas
7. `GET /api/v1/discount_codes/specific_code`, `active_discounts` — validar códigos: clientes
8. `GET /api/v1/tags` — tags del catálogo: públicas
9. `GET /api/v1/packs` — packs del catálogo: públicos
10. `GET /api/v1/size_guides` — guías de tallas: públicas
11. `GET /api/v1/contact_infos` — información de contacto: pública
12. `GET /api/v1/wish_lists/get_wish_list_by_id_list` — lista de deseos por ID: semi-pública
13. `POST /api/v1/auth/token` (login) — siempre público

## Historial git comprometido

Las siguientes claves aparecen en el historial de git y DEBEN SER ROTADAS:
- `APP_USR-5570936269195060-121823-0c16a1942fc303996ffead6a436796ee-1600827084` (MercadoPago)
- `APP_USR-3862339680898373-061913-d48cd5b2fa6933c9ab7671f72d9d0e31-756609509` (MercadoPago anterior)
- `cldu nlga ufuf uuku` (Gmail app password)
- `daaltoto@gmail.com` (usuario SMTP)

## Implementación adicional

- `backend/app/api/deps.py`: Implementadas `get_current_user`, `get_current_active_user`, `get_current_active_superuser` (estas funciones no existían antes)
- `backend/app/tests/conftest.py`: Actualizado para overridear `get_current_active_superuser` en tests

## Tests

- 142 passed, 18 xfailed, 0 failed
- Los tests de routers verifican correctamente que POST /orders retorna 200 sin auth
