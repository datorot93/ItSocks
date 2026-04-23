# Test Cases para GitHub PR Changelog Skill

## Test Case 1: PR básico con versión en título
**Input:** "Genera el changelog del PR #42 de mi-org/mi-repo (título: 'Release v1.2.0 - Nueva API')"

**Expected Output:**
- Detecta versión 1.2.0 del título
- Categoriza cambios automáticamente
- Crea documento en Google Drive en "Mi unidad/Claude/Control de cambios/"
- Documento tiene formato correcto con H1, H2, H3
- Secciones vacías eliminadas

## Test Case 2: PR sin versión clara
**Input:** "Documenta los cambios del PR #99 en company/backend"

**Expected Output:**
- No encuentra versión en título/labels
- Pregunta al usuario: "¿Qué versión quieres asignar?"
- Usuario responde: "2.0.0"
- Continúa con el flujo normal

## Test Case 3: PR con Conventional Commits
**Input:** PR con commits como:
- "feat: add user authentication"
- "fix: resolve memory leak in cache"
- "refactor: optimize database queries"

**Expected Output:**
- "feat:" → Añadido
- "fix:" → Corregido
- "refactor:" → Cambiado
- Documento refleja estas categorizaciones

## Test Case 4: PR muy grande (>50 archivos)
**Input:** "Genera changelog del PR #500 (tiene 120 archivos modificados)"

**Expected Output:**
- Detecta que tiene >50 archivos
- Pregunta al usuario qué opción prefiere:
  1. Changelog resumido
  2. Changelog completo
  3. Selección manual de archivos

## Test Case 5: Sin acceso a MCP de GitHub
**Input:** "Crea el changelog del PR #10" (MCP GitHub no conectado)

**Expected Output:**
- Mensaje claro: "Para usar este skill necesito acceso al MCP de GitHub..."
- Instrucciones para conectar la herramienta
- No falla silenciosamente

## Test Case 6: Categorización mixta
**Input:** PR con:
- 3 archivos nuevos (componentes React)
- 5 archivos modificados (bugs + refactor)
- 1 archivo eliminado (legacy code)

**Expected Output:**
- Archivos nuevos → Añadido
- Bugs → Corregido
- Refactor → Cambiado
- Archivo eliminado → Eliminado
- Documento organizado por categorías

## Test Case 7: PR con labels de versión
**Input:** PR #77 con label "release-3.0.0" pero título sin versión

**Expected Output:**
- Detecta versión del label: 3.0.0
- Usa esta versión en el documento

## Test Case 8: Descripción en español
**Input:** PR con descripción:
"Este PR añade soporte para JWT y elimina la autenticación legacy"

**Expected Output:**
- Palabras clave "añade" → categoría Añadido
- "elimina" → categoría Eliminado
- Entradas en español en el changelog
