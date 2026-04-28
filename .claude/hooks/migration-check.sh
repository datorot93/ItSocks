#!/usr/bin/env bash
# Hook Stop: verificación de completitud por fase de migración ItSocks
# Activado solo en ramas feature/fase-*. Output inyectado como user-prompt-submit-hook.

PROJECT_DIR="/Users/datorot/Documents/Projects/ItSocks"
BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo "")

# Silencio total fuera de ramas de migración
echo "$BRANCH" | grep -qE '^feature/fase-[0-9]+' || exit 0

PHASE_NUM=$(echo "$BRANCH" | grep -oE '[0-9]+' | head -1)

case "$PHASE_NUM" in
  0)
    TESTS='grep -rn "APP_USR\|access_token\s*=" backend/app/api/api_v1/routers/payments.py'
    CRITERIOS="Sin secrets en código | CORS solo a itsocks.co y localhost | Endpoints de escritura devuelven 401 sin token"
    ;;
  1)
    TESTS="cd itsocks-laravel && php artisan migrate:fresh --seed && php artisan test"
    CRITERIOS="27 modelos Eloquent | billing_address/payment_id/gift_from/gift_to sin typos | Filament accesible en /admin"
    ;;
  2)
    TESTS="cd itsocks-laravel && php artisan test --coverage && bash tests/parity/parity_suite.sh"
    CRITERIOS="Cobertura ≥ 90% controllers y services | parity_suite.sh = 0 fallos | Todos los endpoints de FastAPI implementados"
    ;;
  3)
    TESTS="bash tests/parity/verify_data_parity.sh"
    CRITERIOS="Error rate < 0.1% | p95 latency < 800ms | 100% emails confirmación | Uptime ≥ 99.9%"
    ;;
  4)
    TESTS="cd itsocks-vue && npm run test:unit && npm run test:e2e && npm run test:lighthouse"
    CRITERIOS="Cobertura stores ≥ 90% | 8 tests E2E verdes | Lighthouse mobile ≥ 80 | tsc --noEmit sin errores"
    ;;
  5)
    TESTS="npm run build && aws s3 sync dist/ s3://itsocks-vue-storefront/ --dryrun"
    CRITERIOS="Conversión ≥ 95% baseline React | 0 errores 404 con redirects | Lighthouse ≥ 80"
    ;;
  6)
    TESTS="cd itsocks-laravel && php artisan test --filter=Filament"
    CRITERIOS="Dashboard de ventas funcional | Exportación Excel | Importación masiva async | S3 imágenes | Emails con guía"
    ;;
  *)
    exit 0
    ;;
esac

printf '\n[MIGRACIÓN F%s | %s] Verificación obligatoria:\n' "$PHASE_NUM" "$BRANCH"
printf '  1. ¿Corriste los tests? → %s\n' "$TESTS"
printf '  2. ¿Cuál fue el resultado? (pass/fail — si fail, qué falló)\n'
printf '  3. ¿Criterios de aceptación cumplidos? → %s\n' "$CRITERIOS"
printf '  4. ¿Esta respuesta cierra una tarea completa de la fase? Si sí: ¿ejecutaste /fase-cierre o queda trabajo pendiente?\n'
printf 'Responde ✓/✗ por cada punto antes de continuar.\n'
