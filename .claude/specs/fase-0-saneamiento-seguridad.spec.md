---
nombre: "Fase 0 — Saneamiento de Seguridad FastAPI"
version: "1.0"
fecha: "2026-04-23"
propietario: "daaltoto@gmail.com"
estado: "aprobado"
tipo: "spec-seguridad"
alcance: "backend/app — corrección de vulnerabilidades S1-S4 sin cambio de stack"
agente: "agente-seguridad-fase0"
rama: "feature/fase-0-seguridad"
---

# Spec Fase 0: Saneamiento de Seguridad

## 1. Objetivo

Corregir las 4 vulnerabilidades críticas activas en producción en el backend FastAPI de ItSocks **antes** de iniciar cualquier trabajo de migración. Esta fase es independiente y no bloqueante del resto del plan — debe ejecutarse independientemente de si la migración procede o no.

**Tiempo estimado:** 2 semanas  
**Riesgo de regresión:** BAJO (no se cambia lógica de negocio)

---

## 2. Vulnerabilidades a Corregir

### S1 — Clave MercadoPago Hardcodeada (CRÍTICA)

| Campo | Detalle |
|-------|---------|
| Archivo | `backend/app/api/api_v1/routers/payments.py` |
| Impacto | Cualquiera con acceso al repositorio puede usar la cuenta de pagos de ItSocks de forma fraudulenta |
| Acción | Mover el ACCESS_TOKEN a variable de entorno `MERCADOPAGO_ACCESS_TOKEN` |

**Patrón de corrección:**
```python
# ANTES (vulnerable):
sdk = mercadopago.SDK("APP_USR-XXXXXXXXXXXX-...")

# DESPUÉS (correcto):
import os
sdk = mercadopago.SDK(os.getenv("MERCADOPAGO_ACCESS_TOKEN"))
```

**Verificación:**
```bash
grep -n "APP_USR\|access_token\s*=" backend/app/api/api_v1/routers/payments.py
# No debe encontrar ninguna línea con la clave en texto plano
```

---

### S2 — Credenciales SMTP Hardcodeadas (ALTA)

| Campo | Detalle |
|-------|---------|
| Archivo | `backend/app/api/api_v1/routers/orders.py` |
| Impacto | Exposición de contraseña de cuenta Gmail de ItSocks; posible uso para spam/phishing |
| Acción | Mover host, usuario, contraseña y puerto a variables de entorno |

**Variables de entorno a crear:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=correo@itsocks.co
SMTP_PASSWORD=<app_password_rotada>
```

**Patrón de corrección:**
```python
# ANTES (vulnerable):
smtp_server = smtplib.SMTP("smtp.gmail.com", 587)
smtp_server.login("correo@itsocks.co", "contraseña_hardcodeada")

# DESPUÉS (correcto):
smtp_server = smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT", "587")))
smtp_server.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASSWORD"))
```

**Acción adicional:** Rotar la app password de Gmail después de moverla a `.env`.

---

### S3 — Autenticación Comentada en Routers (CRÍTICA)

| Campo | Detalle |
|-------|---------|
| Archivos | Todos los routers en `backend/app/api/api_v1/routers/` |
| Impacto | Cualquier usuario no autenticado puede crear, modificar o eliminar productos, órdenes y datos de clientes |
| Acción | Habilitar el middleware `get_current_active_user` en endpoints de escritura |

**Identificar routers afectados:**
```bash
grep -rln "# .*current_user\|#.*get_current\|# .*Depends.*auth" backend/app/api/api_v1/routers/
```

**Endpoints que DEBEN estar protegidos (escritura):**
- Todos los `POST`, `PUT`, `PATCH`, `DELETE` de productos, categorías, diseños, tipos
- Endpoints de gestión de órdenes (actualizar estado, agregar guía)
- Endpoints de importación de archivos
- Endpoints de gestión de usuarios
- Endpoints de bulk operations

**Endpoints que DEBEN seguir siendo públicos (lectura del catálogo):**
- `GET /api/v1/products` y variantes de filtro
- `GET /api/v1/categories`, `/subcategories`, `/types`, `/designs`
- `GET /api/v1/shippings`
- `POST /api/v1/orders` (crear orden — el cliente no está autenticado)
- `POST /api/v1/payments/preference` (crear preferencia MP)
- `POST /api/v1/discount-codes/validate` (validar descuento)
- `POST /api/v1/auth/login`

**Patrón de corrección:**
```python
# ANTES (vulnerable — auth comentada):
@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    # current_user: User = Depends(get_current_active_user),  # ← COMENTADO
    db: Session = Depends(get_db)
):

# DESPUÉS (correcto):
@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_active_user),  # ← HABILITADO
    db: Session = Depends(get_db)
):
```

---

### S4 — CORS Wildcard (MEDIA)

| Campo | Detalle |
|-------|---------|
| Archivo | `backend/app/main.py` |
| Impacto | La API puede ser consumida desde cualquier origen web, facilitando ataques CSRF |
| Acción | Reemplazar `allow_origins=["*"]` con lista explícita de dominios de ItSocks |

**Corrección:**
```python
# ANTES (inseguro):
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# DESPUÉS (correcto):
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://itsocks.co",
        "https://www.itsocks.co",
        "http://localhost:5173",   # storefront local
        "http://localhost:5174",   # admin local
        "http://localhost:3000",   # React admin local alternativo
    ],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
    allow_credentials=True,
)
```

---

## 3. Acciones Complementarias (Semana 2)

### 3.1 — Auditoría de `print()` con Datos Sensibles
```bash
grep -rn "print(" backend/app/api/api_v1/routers/ | grep -i "email\|password\|token\|card\|phone\|document\|cedula\|nit"
```
Eliminar cada `print()` que exponga datos de clientes o de pago.

### 3.2 — Verificar `.gitignore`
```bash
# Confirmar que .env no está trackeado:
git ls-files backend/.env
git ls-files .env
# Si retorna algo, agregar al .gitignore y eliminar del índice git
```

### 3.3 — Verificar historial de git
```bash
# Buscar si alguna clave fue commiteada en el pasado:
git log --all --full-history -- backend/app/api/api_v1/routers/payments.py | head -5
git log -p --all --follow backend/app/api/api_v1/routers/payments.py | grep -i "APP_USR\|access_token"
```
Si se encuentra una clave en el historial, rotar **inmediatamente** aunque ya esté en `.env`.

### 3.4 — Rate Limiting en Nginx
Agregar a la configuración nginx del servidor de producción:
```nginx
# /etc/nginx/sites-available/itsocks
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;

location /api/v1/ {
    limit_req zone=api burst=10 nodelay;
    # ... resto de config
}

location /api/v1/auth/ {
    limit_req zone=api burst=5 nodelay;
    # Más restrictivo para el endpoint de login
}
```

### 3.5 — Extender TTL del JWT (si está configurado como muy corto o muy largo)
Revisar `backend/app/core/security.py` y `config.py` para verificar la duración del token.

---

## 4. Checklist de Ejecución

- [ ] S1: Clave MercadoPago movida a `.env` y variable de entorno activa
- [ ] S1: Clave MercadoPago rotada en el dashboard de MercadoPago
- [ ] S2: Credenciales SMTP movidas a `.env`
- [ ] S2: App password de Gmail rotada
- [ ] S3: Todos los endpoints de escritura protegidos con `get_current_active_user`
- [ ] S3: Endpoints de lectura pública verificados (siguen siendo públicos)
- [ ] S4: `allow_origins=["*"]` reemplazado con lista explícita
- [ ] Auditoría de `print()` completada
- [ ] `.gitignore` incluye `.env`
- [ ] Historial de git verificado y limpio (o claves rotadas si hay historial)
- [ ] Rate limiting configurado en nginx (producción)

---

## 5. Archivo `.env.example` Actualizado

Al finalizar esta fase, el archivo `backend/.env.example` debe incluir:
```
# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# Base de datos (preexistentes)
POSTGRES_SERVER=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# AWS S3 (preexistentes)
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_BUCKET_NAME=
```

---

## 6. Criterios de Aceptación

| Criterio | Cómo verificar |
|----------|---------------|
| Sin secrets en código fuente | `grep -rn "APP_USR\|smtp_password\|@gmail.com.*password" backend/app/api/` → sin resultados |
| Auth habilitada en endpoints de escritura | `curl -X DELETE http://localhost:8000/api/v1/products/1` → retorna `401` |
| Endpoints públicos siguen funcionando | `curl http://localhost:8000/api/v1/products` → retorna `200` |
| CORS restringido | Request desde origen no permitido retorna `403` en preflight |
| `.env` no trackeado | `git status` no muestra `.env` como archivo para commitear |

---

## 7. Fuera de Alcance

- Refactorizar lógica de negocio
- Actualizar versiones de FastAPI, Pydantic o dependencias
- Cambiar estructura de respuestas de la API
- Implementar refresh tokens (puede dejarse para F2)
- Cambios en el frontend
