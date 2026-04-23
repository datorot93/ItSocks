---
nombre: "Fase 3 — Cutover Backend (FastAPI → Laravel)"
version: "1.0"
fecha: "2026-04-23"
propietario: "daaltoto@gmail.com"
estado: "aprobado"
tipo: "spec-deployment"
alcance: "producción AWS EC2 — migración de tráfico de FastAPI a Laravel sin downtime"
agente: "agente-devops-cutover"
rama: "feature/fase-3-cutover-backend"
---

# Spec Fase 3: Cutover Backend

## 1. Objetivo

Migrar el 100% del tráfico de producción del backend FastAPI (puerto 8888) al nuevo backend Laravel sin downtime, usando una estrategia de cutover gradual con nginx upstream ponderado. El frontend React sigue funcionando sin cambios durante todo el proceso.

**Tiempo estimado:** 1 semana  
**Prerrequisito:** F2 completada y suite de paridad verde en staging durante 72h mínimo

---

## 2. Checklist Pre-Cutover (Obligatorio)

Completar TODOS estos puntos antes de iniciar el cutover:

- [ ] Backup completo de la base de datos de producción
- [ ] Suite de paridad en staging verde durante 72h consecutivas
- [ ] Laravel corriendo en servidor de staging con datos reales copiados de producción
- [ ] Plan de rollback documentado y probado (tiempo de reversión < 15 min)
- [ ] Horario de cutover definido (preferiblemente martes o miércoles, 2AM–6AM hora Colombia)
- [ ] Notificación a stakeholders del negocio
- [ ] Monitor de uptime configurado (UptimeRobot o equivalente)
- [ ] Logs de Laravel configurados con retención de 30 días
- [ ] Variables de entorno de producción configuradas en servidor Laravel

---

## 3. Arquitectura Durante el Cutover

```
[Clientes]
    ↓
[nginx :80/:443]
    ↓
[upstream backend — ponderado]
    ├── [FastAPI :8888]   weight=90 → 0 (decrementando)
    └── [Laravel :8000]   weight=10 → 100 (incrementando)
    ↓
[PostgreSQL]  ← misma BD para ambos sistemas durante el cutover
```

---

## 4. Configuración nginx — Fase de Cutover Gradual

### Paso 1: 10% Laravel (inicio del cutover)
```nginx
# /etc/nginx/sites-available/itsocks-backend
upstream backend_api {
    server 127.0.0.1:8888 weight=9;   # FastAPI
    server 127.0.0.1:8000 weight=1;   # Laravel (10%)
    keepalive 32;
}

server {
    listen 80;
    server_name api.itsocks.co;

    location /api/v1/ {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }
}
```

```bash
nginx -t && systemctl reload nginx
```

### Paso 2: 50% Laravel (después de 24h sin incidentes)
```nginx
server 127.0.0.1:8888 weight=5;   # FastAPI
server 127.0.0.1:8000 weight=5;   # Laravel (50%)
```

### Paso 3: 100% Laravel (después de 48h totales sin incidentes)
```nginx
server 127.0.0.1:8000;             # Laravel 100%
# server 127.0.0.1:8888 backup;   # FastAPI en standby
```

---

## 5. Métricas de Monitoreo

### Umbrales de Alerta (verificar cada hora)

| Métrica | Umbral normal | Umbral de rollback |
|---------|--------------|-------------------|
| Error rate (4xx + 5xx) | < 1% | > 2% sostenido 15 min |
| Latencia p95 | < 800ms | > 2000ms sostenido 15 min |
| Errores 500 en Laravel | 0 | > 5 en 10 min |
| Procesamiento de órdenes | Normal | Cualquier orden fallida |
| Jobs de Queue (emails) | Procesados en < 2 min | Jobs acumulados > 100 |

### Comandos de Monitoreo

```bash
# Errores en tiempo real de Laravel
tail -f /var/www/itsocks-laravel/storage/logs/laravel.log | grep -E "ERROR|CRITICAL|Exception"

# Error rate en nginx
tail -n 1000 /var/log/nginx/access.log | awk '{print $9}' | sort | uniq -c | sort -rn

# Estado de la queue
cd /var/www/itsocks-laravel && php artisan queue:monitor

# Tiempo de respuesta promedio últimos 5 min
tail -n 500 /var/log/nginx/access.log | awk '{print $NF}' | awk '{sum+=$1; count++} END {print sum/count "ms promedio"}'
```

---

## 6. Procedimiento de Rollback

**Tiempo máximo de ejecución: 5 minutos**

### Trigger de rollback
Cualquiera de estas condiciones:
- Error rate > 2% durante 15 minutos consecutivos
- Más de 5 errores 500 en un período de 10 minutos
- Una o más órdenes fallidas durante el procesamiento
- Latencia p95 > 2 segundos durante 15 minutos

### Comandos de rollback

```bash
#!/bin/bash
# /var/www/scripts/rollback-backend.sh

echo "[$(date)] INICIANDO ROLLBACK - FastAPI recupera 100% del tráfico"

# Reactivar FastAPI al 100% en nginx
cat > /etc/nginx/sites-available/itsocks-backend << 'EOF'
upstream backend_api {
    server 127.0.0.1:8888;  # FastAPI 100%
}
server {
    listen 80;
    server_name api.itsocks.co;
    location /api/v1/ {
        proxy_pass http://backend_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

nginx -t && systemctl reload nginx

echo "[$(date)] ROLLBACK COMPLETADO - FastAPI al 100%"
echo "[$(date)] Verificar: curl http://api.itsocks.co/api/v1/products"
```

---

## 7. Plan de Acción por Día

### Día 1 (Inicio)
- Activar 10% Laravel
- Monitorear cada hora durante 8 horas
- Si sin incidentes: dejar 10% overnight

### Día 2
- Si Día 1 sin incidentes: escalar a 50% Laravel
- Monitorear cada 2 horas
- Verificar que órdenes procesadas en Laravel tienen emails enviados correctamente

### Día 3
- Si Día 2 sin incidentes: escalar a 100% Laravel
- Monitorear cada hora durante 8 horas
- FastAPI pasa a modo standby (no recibe tráfico pero sigue corriendo)

### Días 4–7 (Período de Standby)
- Monitorear métricas diariamente
- FastAPI disponible para rollback inmediato
- Al final del Día 7: desmantelar FastAPI si no hay incidentes

---

## 8. Post-Cutover (Desmantelar FastAPI)

Solo ejecutar después de 7 días sin incidentes:

```bash
# Detener el proceso FastAPI
systemctl stop itsocks-fastapi
systemctl disable itsocks-fastapi

# Archivar el código FastAPI (NO eliminar)
cd /var/www
tar -czf itsocks-fastapi-archived-$(date +%Y%m%d).tar.gz itsocks-fastapi/
# Subir el archivo a S3 como backup histórico

# Documentar la fecha de desmantelamiento
echo "FastAPI desmantelado el $(date)" >> /var/www/MIGRATION_LOG.txt
```

---

## 9. Criterios de Éxito

| Criterio | Métrica |
|----------|---------|
| Uptime durante cutover | ≥ 99.9% (máximo 43 segundos de downtime en 48h) |
| Error rate en Laravel | < 0.1% de requests |
| Órdenes procesadas correctamente | 100% de órdenes reciben email de confirmación |
| Tiempo de respuesta | p95 < 800ms (comparable a FastAPI) |
| Rollback no necesario | No se ejecutó ningún rollback |

---

## 10. Fuera de Alcance

- Migración del frontend (F5)
- Cambios en la base de datos de producción
- Configuración de CloudFront o CDN
- Migración de PostgreSQL a RDS (puede hacerse en paralelo, es infraestructura separada)
