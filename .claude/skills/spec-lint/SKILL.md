---
name: spec-lint
description: Audita los archivos de especificación (.spec.md) del proyecto de migración ItSocks para detectar secciones faltantes o criterios de aceptación incompletos. Úsalo cuando el usuario diga "auditar spec", "revisar spec", "spec lint", "/spec-lint", "¿el spec está completo?", o antes de comenzar a implementar una fase.
---

# Spec Lint — Auditor de especificaciones de migración

Verifica que los archivos `.spec.md` del proyecto tienen todas las secciones necesarias para que un agente pueda implementar la fase sin ambigüedades: seeders, mocks de integraciones externas, criterios de aceptación verificables y configuración de entorno de testing.

## Qué hace este skill

1. Lee una spec o todas las specs del directorio `.claude/specs/`
2. Verifica un checklist de 8 criterios de completitud por spec
3. Reporta ✅/❌ por criterio con descripción del problema
4. Sugiere el texto de relleno para los ítems faltantes
5. Emite una puntuación de completitud (X/8)

## Workflow

### Paso 1 — Seleccionar specs a auditar

Si el usuario especificó una fase (`/spec-lint fase-2` o `/spec-lint F2`), auditar solo esa spec.
Si no especificó, auditar todas las specs en `.claude/specs/`.

Mapeo de fases a archivos:
- F0 → `fase-0-saneamiento-seguridad.spec.md`
- F1 → `fase-1-scaffolding-laravel.spec.md`
- F2 → `fase-2-api-laravel-completa.spec.md`
- F3 → `fase-3-cutover-backend.spec.md`
- F4 → `fase-4-frontend-vue3.spec.md`
- F5 → `fase-5-cutover-frontend.spec.md`
- F6 → `fase-6-filament-admin.spec.md`

### Paso 2 — Leer spec y aplicar checklist

Para cada spec, verificar los 8 criterios:

**Criterio 1: Frontmatter YAML válido**
- La spec comienza con `---` y tiene campos `nombre`, `version`, `estado`
- ✅ si están presentes y bien formateados

**Criterio 2: Tiene estimación de tiempo**
- Contiene "Tiempo estimado:" o "semanas" en la sección de objetivo
- ✅ si está presente

**Criterio 3: Tiene prerrequisitos de fase**
- Menciona qué fases o condiciones deben estar completas antes de iniciar
- ✅ si hay sección "Prerrequisito:" o "Prerequisito:"

**Criterio 4: Criterios de aceptación verificables**
- La sección "Criterios de Aceptación" tiene comandos concretos (`php artisan`, `curl`, `grep`) o describe pasos de verificación específicos
- ❌ si solo dice "funciona correctamente" sin cómo verificarlo

**Criterio 5: Estrategia de mocks para integraciones externas**
- Para fases que usan S3, SMTP, MercadoPago, Redis: menciona `Storage::fake`, `Mail::fake`, `Http::fake`, `Queue::fake`, o equivalentes Vue/Playwright
- ✅ si las integraciones no aplican a la fase (F0, F3, F5)

**Criterio 6: Seeders o datos de prueba definidos**
- Para fases Laravel (F1, F2, F6): menciona los seeders necesarios con datos concretos
- Para fases Vue (F4): menciona fixtures de Playwright o datos del seeder de F1
- ✅ si la fase no requiere datos de BD (F0, F3, F5)

**Criterio 7: Referencia a .env.testing**
- Para fases Laravel con tests: menciona `FILESYSTEM_DISK=local`, `QUEUE_CONNECTION=sync`, `MAIL_MAILER=log`
- ✅ si la fase no tiene tests de Laravel (F0, F4, F5)

**Criterio 8: Sección "Fuera de Alcance"**
- Tiene sección que delimita explícitamente qué NO se implementa en esta fase
- ✅ si está presente

### Paso 3 — Reportar resultados

```
SPEC LINT: fase-2-api-laravel-completa.spec.md
=============================================
Puntuación: 7/8

✅ Frontmatter YAML válido
✅ Tiene estimación de tiempo (10 semanas)
✅ Tiene prerrequisitos (F1 completada)
✅ Criterios de aceptación verificables (comandos PHP/bash)
✅ Mocks de integraciones (Mail::fake, Http::fake, Queue::fake, Storage::fake)
✅ Seeders definidos (factories Eloquent en sección 6)
✅ .env.testing referenciado
❌ Sección "Fuera de Alcance" no encontrada

Sugerencia para criterio faltante:
---
## N. Fuera de Alcance
- Construcción del frontend Vue 3 (F4)
- Cutover de tráfico a producción (F3)
- Funcionalidades avanzadas del panel Filament (F6)
---
```

Si se auditan todas las specs:
```
SPEC LINT: Reporte Completo
===========================
F0: 6/8 — ❌ Mocks no aplica pero falta .env.testing
F1: 8/8 — ✅ Completo
F2: 8/8 — ✅ Completo
F3: 7/8 — ❌ Seeders no aplica pero falta referencia a fixtures
F4: 8/8 — ✅ Completo
F5: 7/8 — ❌ Mocks de Lambda@Edge no especificados
F6: 8/8 — ✅ Completo

Specs con issues: F0, F3, F5
Ejecutar /spec-lint F0 para ver sugerencias detalladas.
```

## Casos especiales

**"La spec tiene un criterio ambiguo como 'funciona correctamente'"**: Marcar como ❌ y sugerir reemplazarlo con un comando verificable.

**"La spec es nueva y está vacía"**: Reportar 0/8 y mostrar template completo de spec.

## Ejemplo de uso

```
Usuario: /spec-lint
Claude: [audita todas las specs y muestra reporte]

Usuario: /spec-lint F1
Claude: [audita solo la spec de Fase 1]

Usuario: /spec-lint fase-4
Claude: [audita solo la spec de Fase 4]
```

## Dependencias

- Archivos `.claude/specs/fase-*.spec.md` presentes
- No requiere herramientas externas

## Notas técnicas

- Los criterios 5, 6, 7 son contextuales — si la fase no tiene tests de BD (F0, F3, F5), se marcan automáticamente como ✅ N/A
- La detección de "comandos verificables" busca patrones: `php artisan`, `curl`, `grep`, `bash`, `npm run`, `python3`
- El frontmatter YAML se valida buscando el bloque `---...---` al inicio del archivo
