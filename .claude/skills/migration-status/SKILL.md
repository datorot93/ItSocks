---
name: migration-status
description: Muestra el estado actual de la migración ItSocks (FastAPI+React → Laravel+Vue3) fase por fase. Úsalo cuando el usuario diga "estado de la migración", "qué fases están listas", "resumen del proyecto", "/migration-status", "¿en qué fase estamos?", o cuando quiera un overview del progreso de la migración.
---

# Migration Status — Dashboard del estado de la migración

Muestra una vista rápida del progreso de todas las fases del plan de migración ItSocks, detectando automáticamente qué está completado, en progreso o pendiente usando el estado de las ramas git.

## Qué hace este skill

1. Lee el estado de las ramas git para detectar qué fases existen
2. Verifica cuáles están mergeadas a main (completadas)
3. Lee las specs para extraer los agentes responsables y estimaciones de tiempo
4. Calcula fechas estimadas basándose en las semanas del plan maestro
5. Imprime tabla de estado + recomendación de próximo paso

## Workflow

### Paso 1 — Leer estado de ramas git

```bash
# Ramas feature/fase-* existentes
git branch -a | grep "feature/fase-"

# Cuáles están mergeadas a main
git branch --merged main | grep "feature/fase-"

# Rama activa actual
git branch --show-current

# Último commit por rama
git log --oneline --all --decorate | grep "feature/fase-"
```

### Paso 2 — Leer plan maestro

Leer `.claude/plan-migracion-laravel-vue.md` para obtener:
- Semanas estimadas por fase
- Agentes responsables
- Criterios de entrada/salida

### Paso 3 — Determinar estado por fase

Para cada fase F0–F6:

| Condición | Estado |
|-----------|--------|
| Rama mergeada a main | ✅ Completada |
| Rama existe, no mergeada, es la activa | 🔄 En progreso |
| Rama existe, no mergeada, no activa | 🟡 Iniciada / En pausa |
| Rama no existe | ⏳ Pendiente |

### Paso 4 — Calcular progreso temporal

Usando la fecha de inicio del plan (2026-04-23) y las semanas estimadas por fase:
- F0: semanas 1-2
- F1: semanas 3-8
- F2: semanas 9-18
- F3: semana 19
- F4: semanas 20-30
- F5: semanas 31-32
- F6: semanas 33-36

Calcular qué semana del plan es la actual y qué fase debería estar activa según el cronograma.

### Paso 5 — Mostrar tabla de estado

```
ESTADO DE MIGRACIÓN ITSOCKS
============================
Plan iniciado: 2026-04-23 | Hoy: [fecha actual]
Semana del plan: [N] / 36

Fase | Nombre                    | Estado       | Agente                          | Semanas
-----|---------------------------|--------------|----------------------------------|--------
F0   | Saneamiento Seguridad     | ✅ Completada | agente-seguridad-fase0          | 1-2
F1   | Scaffolding Laravel       | 🔄 En progreso| agente-laravel-arquitecto-fase1 | 3-8
F2   | API Laravel Completa      | ⏳ Pendiente  | agente-laravel-api-fase2        | 9-18
F3   | Cutover Backend           | ⏳ Pendiente  | agente-devops-cutover           | 19
F4   | Frontend Vue 3            | ⏳ Pendiente  | agente-vue3-frontend-fase4      | 20-30
F5   | Cutover Frontend          | ⏳ Pendiente  | agente-devops-cutover           | 31-32
F6   | Admin Filament            | ⏳ Pendiente  | agente-filament-admin-fase6     | 33-36

PROGRESO: 1/7 fases completadas (14%)

PRÓXIMA ACCIÓN:
  Fase 1 en progreso. Para continuar, iniciar el agente:
  "Lee tu spec en .claude/specs/fase-1-scaffolding-laravel.spec.md y continúa la implementación"

ADVERTENCIAS:
  ⚠️  La Fase 1 debería completarse en la semana 8. Actualmente en semana 6 — dentro del cronograma.
```

### Paso 6 — Revisar criterios de entrada de la siguiente fase

Leer los prerrequisitos de la siguiente fase pendiente y verificar si están cumplidos.

## Casos especiales

**"No hay ramas feature/fase-*"**: Indicar que la migración no ha comenzado formalmente y sugerir iniciar con F0.

**"Hay múltiples ramas en progreso"**: Puede ser que F6 corra en paralelo con F4 (según el plan). Mostrar ambas como "En progreso" y aclarar que es intencional.

**"Una rama fue eliminada"**: Si hay un PR mergeado pero la rama local fue borrada, aún se puede detectar vía `git log --all`.

## Ejemplo de uso

```
Usuario: /migration-status

Claude: [ejecuta git commands]
[muestra tabla de estado completa]
[indica próxima acción recomendada]
```

## Dependencias

- Git configurado en el repositorio
- Archivo `.claude/plan-migracion-laravel-vue.md` presente
- Specs en `.claude/specs/` presentes

## Notas técnicas

- La detección de "mergeado a main" usa `git branch --merged main` — si el usuario usa squash merge, puede no detectar correctamente. En ese caso buscar el PR cerrado via MCP GitHub.
- Las fechas estimadas son aproximadas — el plan es una guía, no un contrato.
