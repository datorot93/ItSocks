---
nombre: "Fase 5 — Cutover Frontend (React → Vue 3)"
version: "1.0"
fecha: "2026-04-23"
propietario: "daaltoto@gmail.com"
estado: "aprobado"
tipo: "spec-deployment"
alcance: "producción S3/CloudFront — migración de tráfico del frontend React al Vue 3"
agente: "agente-devops-cutover"
rama: "feature/fase-5-cutover-frontend"
---

# Spec Fase 5: Cutover Frontend

## 1. Objetivo

Migrar el 100% del tráfico de usuarios del storefront React 18 (S3 estático) al nuevo storefront Vue 3 sin pérdida de conversión, usando una estrategia A/B con escalamiento gradual. Configurar todos los redirects 301 necesarios para URLs que cambiaron de estructura.

**Tiempo estimado:** 2 semanas  
**Prerrequisito:** F4 completada (Vue 3 con Lighthouse ≥ 80 y E2E verde)

---

## 2. Checklist Pre-Cutover

- [ ] Build de producción Vue 3 generado sin errores (`npm run build`)
- [ ] Lighthouse ≥ 80 en mobile verificado en staging
- [ ] Tests E2E del flujo de compra verde en staging con dominio de producción
- [ ] Redirects 301 configurados y verificados (tabla en sección 4)
- [ ] Plan de rollback documentado y probado
- [ ] Métricas baseline de conversión del frontend React documentadas (últimos 30 días)
- [ ] Analytics configurado en Vue 3 (mismo GTM/GA4 que React)
- [ ] Horario de cutover definido (martes/miércoles, 2AM–6AM Colombia)

---

## 3. Deploy a S3/CloudFront

### Build y subida del bundle Vue 3

```bash
cd /Users/datorot/Documents/Projects/ItSocks/itsocks-vue

# Build de producción
npm run build

# Verificar tamaño del bundle
du -sh dist/

# Subir a bucket S3 dedicado para Vue 3
aws s3 sync dist/ s3://itsocks-vue-storefront/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# index.html con cache corto (para actualizaciones)
aws s3 cp dist/index.html s3://itsocks-vue-storefront/index.html \
  --cache-control "public, max-age=300"

echo "Deploy de Vue 3 completado"
```

### Configuración de la distribución CloudFront para Vue 3

```json
{
  "Origins": [{
    "DomainName": "itsocks-vue-storefront.s3-website.us-east-1.amazonaws.com",
    "S3OriginConfig": {}
  }],
  "DefaultCacheBehavior": {
    "ForwardedValues": { "QueryString": false },
    "ViewerProtocolPolicy": "redirect-to-https"
  },
  "CustomErrorResponses": [{
    "ErrorCode": 404,
    "ResponseCode": 200,
    "ResponsePagePath": "/index.html"
  }]
}
```

---

## 4. Tabla de Redirects 301 (URLs que cambian de estructura)

Estas URLs del frontend React deben redirigir a sus equivalentes en Vue 3. Configurar en CloudFront o nginx **antes** del cutover.

| URL React | URL Vue 3 | Tipo |
|-----------|----------|------|
| `/medias/pantorrilleras/estampadas` | `/medias/pantorrilleras/estampadas` | Sin cambio |
| `/medias/pantorrilleras/estampadas/:disenio` | `/medias/pantorrilleras/estampadas/:disenio` | Sin cambio |
| `/medias/pantorrilleras/estampadas/:disenio/:nombre` | `/medias/pantorrilleras/estampadas/sin-compresion/:disenio/:nombre` | Con compresión |
| `/product/:id` (si existe) | `/medias/:subcategoria/:tipo/:disenio/:compresion/:nombre` | Reconstruir desde API |
| `/carrito-de-compras` (si era diferente) | `/carrito` | Simplificado |
| `/orden/:id` | `/order/:id` | Verificar exactitud |

**Nota:** La mayoría de las rutas del catálogo mantienen la misma estructura en Vue Router porque se diseñaron para ser compatibles. Verificar con `grep -rn "path=" frontend/src/itsocks/routes/ItSocksRoutes.jsx` antes del cutover.

### Configurar redirects en CloudFront (Lambda@Edge o CloudFront Functions)

```javascript
// cloudfront-redirects.js (CloudFront Function)
function handler(event) {
  const request = event.request;
  const uri = request.uri;

  const redirects = {
    '/carrito-de-compras': '/carrito',
    // Agregar todas las URLs que cambien
  };

  if (redirects[uri]) {
    return {
      statusCode: 301,
      headers: {
        location: { value: redirects[uri] }
      }
    };
  }

  return request;
}
```

---

## 5. Estrategia A/B: Escalamiento Gradual

### Paso 1: 10% Vue 3 (inicio del cutover)

Usar Cookie-based routing con CloudFront:

```python
# Lambda@Edge: distribución por cookie
import json
import random

def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    headers = request.get('headers', {})

    # Leer cookie de versión si existe
    cookies = headers.get('cookie', [{}])[0].get('value', '')
    has_vue_cookie = 'frontend_version=vue3' in cookies

    if has_vue_cookie:
        # Redirigir a Vue 3
        request['origin']['s3']['domainName'] = 'itsocks-vue-storefront.s3.amazonaws.com'
    elif random.random() < 0.10:  # 10% de nuevos usuarios → Vue 3
        request['headers']['set-cookie'] = [{'key': 'Set-Cookie', 'value': 'frontend_version=vue3; Path=/; Max-Age=86400'}]
        request['origin']['s3']['domainName'] = 'itsocks-vue-storefront.s3.amazonaws.com'
    # else: React (default)

    return request
```

### Paso 2: 50% Vue 3 (después de 48h sin incidentes)
Cambiar `0.10` por `0.50` en el Lambda.

### Paso 3: 100% Vue 3 (después de 72h totales sin incidentes)
Actualizar CloudFront para que todos los requests vayan al bucket Vue 3.

---

## 6. Métricas de Monitoreo

### Métricas baseline (documentar del React antes del cutover)

| Métrica | Valor baseline (React) | Umbral de rollback |
|---------|----------------------|-------------------|
| Tasa de checkout iniciado | X% de visitas | < X% - 10% por 24h |
| Tasa de órdenes completadas | X% de checkouts | < X% - 10% por 24h |
| Bounce rate homepage | X% | > X% + 15% por 24h |
| Tiempo hasta primera interacción (TTI) | Xms | > X*1.5ms por 24h |
| Errores JavaScript (por 1000 sesiones) | X | > X*3 por 24h |

### Herramientas de monitoreo
- Google Analytics 4: comparar conversiones React vs Vue
- CloudWatch: errores 4xx/5xx por distribución CloudFront
- Sentry (si está configurado): errores JavaScript por versión

---

## 7. Procedimiento de Rollback

**Tiempo máximo de ejecución: 5 minutos**

### Trigger de rollback
- Conversión cae más de 10% vs baseline de React durante 24 horas
- Tasa de errores JavaScript > 3x el baseline durante 2 horas
- Reporte de clientes sobre flujo de compra roto

### Comandos de rollback

```bash
#!/bin/bash
# rollback-frontend.sh

echo "[$(date)] INICIANDO ROLLBACK FRONTEND"

# Opción 1: Si se usa Lambda@Edge, actualizar para enviar 100% a React
aws lambda update-function-code \
  --function-name itsocks-frontend-router \
  --zip-file fileb://lambda-react-100.zip

# Opción 2: Si se usa DNS, cambiar CNAME de vuelta al bucket React
aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file://route53-react-rollback.json

echo "[$(date)] ROLLBACK FRONTEND COMPLETADO"
echo "Verificar: curl -I https://itsocks.co"
```

---

## 8. Post-Cutover (Desmantelar React)

Solo ejecutar después de 14 días sin incidentes:

```bash
# Archivar el bucket de React (NO eliminar)
aws s3 sync s3://itsocks-react-storefront/ s3://itsocks-archive-react-$(date +%Y%m%d)/

# Documentar
echo "Frontend React archivado el $(date)" >> /var/www/MIGRATION_LOG.txt

# La carpeta frontend/ del repositorio puede marcarse como deprecated en README
```

---

## 9. Criterios de Éxito

| Criterio | Métrica |
|----------|---------|
| Tasa de conversión | ≥ 95% del baseline React (máximo 5% de caída) |
| Errores 404 | 0 en URLs que tenían redirects configurados |
| Lighthouse en producción | ≥ 80 mobile (verificar con PageSpeed Insights) |
| Tiempo de carga (LCP) | ≤ LCP del frontend React |
| Rollback no necesario | No se ejecutó ningún rollback |

---

## 10. Fuera de Alcance

- Cambios en el backend
- SEO avanzado (schema.org, structured data)
- Internacionalización (i18n)
- Optimizaciones de Core Web Vitals más allá de Lighthouse 80
