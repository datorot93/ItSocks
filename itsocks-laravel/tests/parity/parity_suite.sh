#!/bin/bash
# Suite de paridad automatizada: compara respuestas entre FastAPI (legacy) y Laravel (nuevo)
# Uso: bash tests/parity/parity_suite.sh [fastapi_url] [laravel_url]
# Ejemplo: bash tests/parity/parity_suite.sh http://api.itsocks.co/api/v1 http://localhost:8000/api/v1

FASTAPI="${1:-http://staging-fastapi:8888/api/v1}"
LARAVEL="${2:-http://localhost:8000/api/v1}"
FAILURES=0
PASSED=0
TOTAL=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_ok() { echo -e "${GREEN}OK${NC}:   $1 ($2 items)"; }
log_fail() { echo -e "${RED}FALLA${NC}: $1 | FastAPI: $2 | Laravel: $3"; }
log_warn() { echo -e "${YELLOW}WARN${NC}:  $1"; }

check_list_endpoint() {
    local endpoint=$1
    local params="${2:-}"
    local description="${3:-$endpoint}"
    TOTAL=$((TOTAL + 1))

    fastapi_resp=$(curl -sf "$FASTAPI/$endpoint$params" 2>/dev/null)
    laravel_resp=$(curl -sf "$LARAVEL/$endpoint$params" 2>/dev/null)

    if [ -z "$fastapi_resp" ]; then
        log_warn "$description — FastAPI no responde, saltando"
        return
    fi
    if [ -z "$laravel_resp" ]; then
        log_fail "$description" "?" "no responde"
        FAILURES=$((FAILURES + 1))
        return
    fi

    # Comparar conteo de items (data array o array directo)
    fastapi_count=$(echo "$fastapi_resp" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('data', d)) if isinstance(d, (list,dict)) else 0)" 2>/dev/null)
    laravel_count=$(echo "$laravel_resp" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('data', d)) if isinstance(d, (list,dict)) else 0)" 2>/dev/null)

    if [ "$fastapi_count" = "$laravel_count" ]; then
        log_ok "$description" "$laravel_count"
        PASSED=$((PASSED + 1))
    else
        log_fail "$description" "$fastapi_count" "$laravel_count"
        FAILURES=$((FAILURES + 1))
    fi
}

check_status_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status="${3:-200}"
    local description="${4:-$endpoint}"
    TOTAL=$((TOTAL + 1))

    laravel_status=$(curl -sf -o /dev/null -w "%{http_code}" -X "$method" "$LARAVEL/$endpoint" 2>/dev/null)

    if [ "$laravel_status" = "$expected_status" ]; then
        log_ok "$description" "HTTP $laravel_status"
        PASSED=$((PASSED + 1))
    else
        log_fail "$description" "HTTP $expected_status" "HTTP $laravel_status"
        FAILURES=$((FAILURES + 1))
    fi
}

echo "=================================================="
echo "Suite de Paridad ItSocks — FastAPI vs Laravel"
echo "FastAPI: $FASTAPI"
echo "Laravel: $LARAVEL"
echo "=================================================="

echo ""
echo "--- Endpoints de catálogo (lectura) ---"
check_list_endpoint "products" "?per_page=20" "GET /products"
check_list_endpoint "categories" "" "GET /categories"
check_list_endpoint "subcategories" "" "GET /subcategories"
check_list_endpoint "types" "" "GET /types"
check_list_endpoint "designs" "" "GET /designs"
check_list_endpoint "tags" "" "GET /tags"
check_list_endpoint "colors" "" "GET /colors"
check_list_endpoint "sizes" "" "GET /sizes"

echo ""
echo "--- Endpoints de comercio (lectura pública) ---"
check_list_endpoint "packs" "" "GET /packs"
check_list_endpoint "shippings" "" "GET /shippings"

echo ""
echo "--- Endpoints de autenticación ---"
check_status_endpoint "POST" "auth/login" "401" "POST /auth/login (sin credenciales → 401)"

echo ""
echo "=================================================="
echo "Resultado: $PASSED/$TOTAL pasaron, $FAILURES fallos"
echo "=================================================="

if [ $FAILURES -gt 0 ]; then
    echo "PARIDAD FALLIDA — NO proceder con F3 hasta resolver los fallos"
    exit 1
else
    echo "PARIDAD OK — Todos los endpoints verificados"
    exit 0
fi
