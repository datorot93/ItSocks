---
name: cutover-monitor
description: Monitorea las métricas del sistema durante el cutover de backend (Fase 3) o frontend (Fase 5) de la migración ItSocks. Úsalo cuando el usuario diga "monitorear cutover", "verificar métricas", "cómo va el cutover", "/cutover-monitor", "¿hay errores en producción?", o durante la ejecución del cutover gradual nginx.
---

# Cutover Monitor — Monitoreo de métricas durante el cutover

Ejecuta los comandos de monitoreo definidos en las specs F3 y F5, evalúa las métricas contra los umbrales configurados y emite un diagnóstico de SAFE / WARNING / ROLLBACK con recomendaciones de acción.

## Qué hace este skill

1. Verifica que el usuario confirma estar en servidor de producción (previene ejecución accidental)
2. Ejecuta los 4 comandos de monitoreo de la spec F3
3. Analiza cada métrica contra sus umbrales
4. Emite diagnóstico por categoría de métrica
5. Emite veredicto final con recomendación de acción
6. Si el estado es ROLLBACK: ofrece ejecutar el script de rollback

## Workflow

### Paso 1 — Confirmación de contexto (OBLIGATORIA)

Antes de ejecutar cualquier comando, preguntar:

```
¿Confirmas que estás monitoreando el servidor de PRODUCCIÓN ItSocks?
Escribe "si, producción" para continuar o cualquier otra cosa para cancelar.
```

Si el usuario no confirma explícitamente, cancelar y explicar por qué es importante esta confirmación.

Además, pedir el directorio del proyecto Laravel en producción:
```
Directorio Laravel en producción: [default: /var/www/itsocks-laravel]
```

### Paso 2 — Verificar errores Laravel (últimos 5 minutos)

```bash
# Errores recientes en logs de Laravel
tail -n 200 /var/www/itsocks-laravel/storage/logs/laravel.log | grep -E "ERROR|CRITICAL|Exception" | tail -20
```

Evaluar:
- 0 errores → ✅ NORMAL
- 1-4 errores → 🟡 WARNING: reportar los mensajes
- 5+ errores en 10 min → 🔴 ROLLBACK

### Paso 3 — Error rate en nginx

```bash
# Último 1000 requests — contar 4xx y 5xx
tail -n 1000 /var/log/nginx/access.log | awk '{print $9}' | sort | uniq -c | sort -rn
```

Calcular:
```
total_requests = sum de todos los códigos
error_4xx = count de códigos 400-499
error_5xx = count de códigos 500-599
error_rate = (error_4xx + error_5xx) / total_requests * 100
```

Evaluar:
- < 1% → ✅ NORMAL
- 1-2% → 🟡 WARNING
- > 2% sostenido → 🔴 ROLLBACK

### Paso 4 — Estado de la queue de Laravel

```bash
# Jobs pendientes y fallidos
cd /var/www/itsocks-laravel && php artisan queue:monitor 2>/dev/null || \
php artisan tinker --execute="echo 'Pending: ' . DB::table('jobs')->count() . ' | Failed: ' . DB::table('failed_jobs')->count();"
```

Evaluar:
- 0-10 jobs pendientes → ✅ NORMAL
- 11-100 jobs acumulados → 🟡 WARNING
- > 100 jobs acumulados → 🔴 ROLLBACK
- Cualquier job fallido relacionado con emails de órdenes → 🔴 ROLLBACK

### Paso 5 — Latencia promedio (últimos 5 minutos)

```bash
# Tiempo de respuesta promedio en nginx (último campo del log)
tail -n 500 /var/log/nginx/access.log | awk '{print $NF}' | awk '{sum+=$1; count++} END {if(count>0) printf "%.0f ms promedio\n", sum/count*1000; else print "No hay datos"}'
```

Evaluar:
- < 800ms → ✅ NORMAL
- 800-2000ms → 🟡 WARNING
- > 2000ms sostenido → 🔴 ROLLBACK

### Paso 6 — Verificar procesamiento de órdenes

```bash
# Órdenes fallidas en los últimos 30 minutos (sin email de confirmación)
cd /var/www/itsocks-laravel && php artisan tinker --execute="
\$recientes = App\Models\Order::where('created_at', '>=', now()->subMinutes(30))->get();
echo 'Órdenes últimos 30min: ' . \$recientes->count() . PHP_EOL;
\$sinEmail = \$recientes->where('confirmation_sent', false);
echo 'Sin email de confirmación: ' . \$sinEmail->count() . PHP_EOL;
"
```

Evaluar:
- Todas las órdenes tienen email enviado → ✅ NORMAL
- Cualquier orden sin confirmación → 🔴 ROLLBACK INMEDIATO

### Paso 7 — Reportar diagnóstico

```
CUTOVER MONITOR — [timestamp]
==============================
Peso actual: FastAPI 50% / Laravel 50%

Métrica                    | Valor          | Umbral    | Estado
---------------------------|----------------|-----------|--------
Errores Laravel (10 min)   | 0              | < 5       | ✅ NORMAL
Error rate nginx           | 0.3%           | < 1%      | ✅ NORMAL
Jobs en queue              | 3 pendientes   | < 100     | ✅ NORMAL
Latencia p95               | 420ms          | < 800ms   | ✅ NORMAL
Órdenes sin email          | 0              | 0         | ✅ NORMAL

VEREDICTO: 🟢 SAFE
Recomendación: Continuar monitoreando. Si esto persiste 1h más, escalar a 100% Laravel.
```

### Paso 8 — Acción según veredicto

**SAFE:** Mostrar cuándo fue el último escalado y cuándo se recomienda el próximo.

**WARNING:** Mostrar las métricas en alerta, recomendar seguir monitoreando cada 15 min. No escalar.

**ROLLBACK:** Mostrar causa específica y preguntar:
```
🔴 ROLLBACK REQUERIDO: [causa]

¿Deseas ejecutar el rollback ahora?
Esto ejecutará: bash /var/www/scripts/rollback-backend.sh
y devolverá FastAPI al 100% del tráfico.

Escribe "ejecutar rollback" para confirmar, o cualquier cosa para revisar primero.
```

Si el usuario confirma, ejecutar el script de rollback y verificar que nginx reloaded correctamente.

## Casos especiales

**"Nginx log no existe en esa ruta"**: Preguntar al usuario la ruta correcta del log de nginx.

**"php artisan no encuentra la BD"**: Puede ser un problema de conexión a la BD. Verificar si la BD está accesible antes de escalar.

**"El script de rollback no existe todavía"**: Mostrar el comando nginx equivalente:
```bash
cat > /etc/nginx/sites-available/itsocks-backend << 'EOF'
upstream backend_api { server 127.0.0.1:8888; }
server { listen 80; location /api/v1/ { proxy_pass http://backend_api; } }
EOF
nginx -t && systemctl reload nginx
```

## Dependencias

- SSH acceso al servidor de producción
- `nginx`, `php` disponibles en el servidor
- Laravel corriendo en el servidor de producción
- Permisos para leer logs de nginx y de Laravel

## Notas técnicas

- Este skill solo debe ejecutarse desde un terminal conectado al servidor de producción
- Los umbrales vienen de la spec F3 — cualquier cambio a los umbrales debe reflejarse en la spec primero
- El tiempo de respuesta de nginx usa el formato `$request_time` — verificar que el log format lo incluye antes de ejecutar
