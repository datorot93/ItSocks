---
name: fase-cierre
description: Cierra una fase de la migración ItSocks ejecutando tests, verificando criterios de aceptación, haciendo commit+push y creando el PR a main. Úsalo cuando el usuario diga "cerrar fase", "terminar fase", "fase lista", "hacer PR de la fase", "/fase-cierre", o cuando una fase de la migración esté lista para integrarse.
---

# Fase Cierre — Automatización de cierre de fase de migración

Automatiza el flujo completo de cierre de una fase del plan de migración ItSocks: tests → verificación de criterios → commit → push → PR a main → changelog.

## Qué hace este skill

1. Detecta automáticamente qué fase está activa por la rama git actual
2. Lee la spec de la fase para obtener los criterios de aceptación
3. Ejecuta el suite de tests correspondiente a la fase
4. Verifica los criterios de aceptación con el usuario
5. Crea el commit con el formato del proyecto (español + co-autoría Claude)
6. Hace push a la rama actual
7. Crea el PR a main via MCP GitHub
8. Ejecuta `/github-pr-changelog` para documentar los cambios

## Workflow

### Paso 1 — Detectar fase activa

Ejecutar: `git branch --show-current`

Mapeo de ramas a fases y specs:
| Rama | Fase | Spec | Tests |
|------|------|------|-------|
| `feature/fase-0-*` | F0 | `fase-0-saneamiento-seguridad.spec.md` | `grep` / `curl` manual |
| `feature/fase-1-*` | F1 | `fase-1-scaffolding-laravel.spec.md` | `cd itsocks-laravel && php artisan test` |
| `feature/fase-2-*` | F2 | `fase-2-api-laravel-completa.spec.md` | `cd itsocks-laravel && php artisan test --coverage` |
| `feature/fase-3-*` | F3 | `fase-3-cutover-backend.spec.md` | `bash tests/parity/verify_data_parity.sh` |
| `feature/fase-4-*` | F4 | `fase-4-frontend-vue3.spec.md` | `cd itsocks-vue && npm run test:all` |
| `feature/fase-5-*` | F5 | `fase-5-cutover-frontend.spec.md` | Métricas de conversión manuales |
| `feature/fase-6-*` | F6 | `fase-6-filament-admin.spec.md` | `cd itsocks-laravel && php artisan test --filter=Filament` |

Si la rama no corresponde a ninguna fase, preguntar al usuario qué fase está cerrando.

### Paso 2 — Ejecutar tests

Ejecutar el comando de tests correspondiente a la fase detectada. Reportar:
- Total de tests
- Tests pasando / fallando
- Cobertura (si aplica)

Si los tests fallan, **detener el proceso** y reportar los errores. No crear el PR con tests en rojo.

Excepción: si el usuario indica explícitamente "ignorar tests fallidos", continuar con advertencia visible.

### Paso 3 — Verificar criterios de aceptación

Leer la sección "Criterios de Aceptación" del spec de la fase. Para cada criterio:

1. Si el criterio tiene un comando verificable: ejecutarlo y mostrar resultado
2. Si el criterio requiere verificación manual: preguntar al usuario "¿Este criterio está cumplido? [s/n]"

Mostrar tabla de estado:
```
Criterio                              | Estado
--------------------------------------|--------
Migraciones corren sin error          | ✅ Verificado (php artisan migrate:fresh OK)
Filament accesible en /admin          | ✅ Confirmado por usuario
CRUD básico funciona                  | ✅ Confirmado por usuario
```

Si algún criterio crítico no está cumplido, detener y reportar qué falta.

### Paso 4 — Crear commit

Revisar qué archivos están modificados: `git status`

Crear el commit con:
- Mensaje en español, tiempo presente
- Co-autoría de Claude
- Formato: descripción concisa de lo que implementa la fase

```bash
git add -A
git commit -m "$(cat <<'EOF'
Implementar [descripción de la fase N]

[Bullet points de los cambios principales]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### Paso 5 — Push y PR

```bash
git push origin $(git branch --show-current)
```

Crear PR via `mcp__github__create_pull_request`:
- **title:** "Fase N: [nombre corto de la fase]"
- **base:** `main`
- **body:** incluir criterios de aceptación cumplidos, lista de cambios, instrucciones de verificación

### Paso 6 — Changelog

Ejecutar `/github-pr-changelog` con el número del PR recién creado.

## Casos especiales

**"Los tests de F0 no son automatizables"**: F0 tiene verificaciones con `grep` y `curl`. Ejecutar los comandos de la sección "Criterios de Aceptación" del spec F0 y mostrar su output. Pedir confirmación al usuario.

**"No existe el directorio itsocks-laravel/"**: El proyecto Laravel todavía no está creado (F1 no completada). Indicar al usuario que primero debe ejecutar el agente `agente-laravel-arquitecto-fase1`.

**"Tests pasan pero cobertura < 90%"**: Advertir al usuario y preguntar si desea continuar de todas formas. No bloquear si el usuario confirma.

## Ejemplo de uso

```
Usuario: /fase-cierre

Claude: Detecté que estás en la rama feature/fase-1-laravel-scaffolding (Fase 1).
Ejecutando tests...

✅ php artisan test: 24/24 tests pasando
✅ php artisan migrate:fresh --seed: sin errores

Revisando criterios de aceptación:
✅ Migraciones sin typos (billing_address, payment_id, gift_from, gift_to)
✅ Seeders populan datos
❓ ¿Filament es accesible en /admin? [s/n]: s
✅ CRUD básico funciona
❓ ¿Tests de relaciones verdes? [s/n]: s

Todos los criterios cumplidos. Creando commit...
[Commit creado]
[Push realizado]
[PR #42 creado: "Fase 1: Scaffolding y Modelado Laravel"]
Ejecutando /github-pr-changelog...
[Changelog generado]

Fase 1 cerrada exitosamente. PR: https://github.com/...
```

## Dependencias

- `mcp__github__create_pull_request` — para crear el PR
- Skill `/github-pr-changelog` — para documentar el PR
- Git configurado con acceso al repositorio remoto
- Directorio del proyecto Laravel (`itsocks-laravel/`) para fases 1, 2, 6
- Directorio del proyecto Vue (`itsocks-vue/`) para fase 4

## Notas técnicas

- Los criterios de aceptación de cada spec están en la sección con ese nombre
- El commit NO debe incluir archivos `.env` ni credenciales
- Si hay cambios sin commitear en el working tree, preguntar si deben incluirse
- El PR siempre va a `main`, nunca a otra rama
