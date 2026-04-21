---
name: github-pr-changelog
description: Genera documentos de Control de Cambios profesionales a partir de Pull Requests de GitHub y los sube automáticamente a Google Drive. Úsalo cuando el usuario mencione "changelog", "control de cambios", "documentar PR", "documentar pull request", "generar changelog desde PR", o cuando quiera crear documentación de cambios desde GitHub. También actívalo si el usuario dice "documenta los cambios de este PR" o pide documentación estructurada de modificaciones en código.
---

# GitHub PR Changelog Generator

Este skill automatiza la creación de documentos de Control de Cambios (Changelog) a partir de Pull Requests de GitHub, siguiendo el formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [SemVer](https://semver.org/lang/es/).

## Qué hace este skill

1. **Extrae información del PR**: Obtiene todos los detalles del Pull Request incluyendo archivos modificados, commits, diffs y metadatos
2. **Categoriza cambios inteligentemente**: Analiza los cambios y los clasifica en:
   - **Añadido**: Nuevas funcionalidades
   - **Cambiado**: Modificaciones en funcionalidad existente
   - **Corregido**: Corrección de bugs
   - **Eliminado**: Código o features removidos
   - **Otros**: Cambios que no encajan en las categorías anteriores
3. **Genera documento formateado**: Crea un Google Doc profesional con formato rich text
4. **Sube a Google Drive**: Lo guarda automáticamente en la carpeta "Control de cambios" dentro de "Claude"

## Workflow

### Paso 1: Conectar con GitHub MCP

Primero, verifica que tengas acceso al MCP de GitHub. Si no está disponible, solicítalo.

### Paso 2: Obtener información del PR

Usa las herramientas del MCP de GitHub para obtener:

```
Información necesaria:
- URL o número del PR
- Repositorio (owner/repo)
- Título del PR
- Descripción del PR
- Lista de archivos modificados (agregados, modificados, eliminados)
- Commits con mensajes
- Diffs de cada archivo
- Fecha de creación/merge
- Autor y reviewers
- Labels del PR
```

### Paso 3: Inferir la versión

Extrae el número de versión del PR usando estas reglas en orden de prioridad:

1. **Del título del PR**: Busca patrones como:
   - `v1.2.3`, `V1.2.3`
   - `[1.2.3]`
   - `Release 1.2.3`
   - `Version 1.2.3`

2. **De los labels**: Busca labels como:
   - `release-1.2.3`
   - `v1.2.3`
   - `version:1.2.3`

3. **De la descripción del PR**: Busca menciones de versión en el cuerpo del PR

4. **Si no se encuentra**: Pregunta al usuario qué versión asignar

### Paso 4: Categorizar cambios automáticamente

Para cada archivo modificado y cada commit, analiza:

#### A. Por mensaje de commit (Conventional Commits)
```
feat: → Añadido
fix: → Corregido
refactor: → Cambiado
perf: → Cambiado
docs: → Otros
style: → Otros
test: → Otros
chore: → Otros
build: → Otros
ci: → Otros
revert: → Eliminado
```

#### B. Por tipo de cambio en archivos
```
Archivos nuevos → Añadido
Archivos eliminados → Eliminado
Modificaciones en archivos existentes → Analizar diff
```

#### C. Por análisis de diffs
Analiza el contenido de los cambios:
- Nuevas funciones/clases/métodos → Añadido
- Código eliminado (más líneas - que +) → Eliminado
- Cambios en funciones existentes → Cambiado
- Fixes de bugs (busca palabras clave: fix, bug, error, issue) → Corregido
- Si no es claro → Otros

#### D. Por palabras clave en commits/PR
```
Añadido: "add", "new", "feature", "implement", "create", "añadir", "nuevo", "crear"
Cambiado: "change", "update", "modify", "improve", "optimize", "cambiar", "actualizar", "modificar", "optimizar"
Corregido: "fix", "bug", "error", "issue", "resolve", "corregir", "arreglar", "resolver"
Eliminado: "remove", "delete", "drop", "eliminar", "borrar", "quitar"
```

### Paso 5: Generar el contenido del changelog

Lee la plantilla desde `references/changelog_template.md` y complétala:

1. **Fecha**: Usa la fecha del PR (creación o merge, la más relevante)
2. **Versión**: La inferida en el Paso 3
3. **Entradas por categoría**:
   - Escribe descripciones claras y concisas
   - Una entrada por cambio significativo
   - Usa lenguaje profesional y técnico
   - Incluye nombres de archivos o módulos cuando sea relevante

**Formato de cada entrada:**
```markdown
- Descripción clara del cambio [contexto adicional si es necesario].
```

**Ejemplo:**
```markdown
### Añadido
- Nueva funcionalidad para la exportación de diagramas de secuencia en formato SVG.
- Soporte para autenticación mediante tokens JWT en el módulo de API (`auth/jwt.py`).
- Endpoint `/api/v2/users` para gestión de usuarios con paginación.

### Cambiado
- Se optimizó la latencia en el procesamiento de eventos del LMAX Disruptor (reducción del 15%).
- Actualización de la documentación del flujo de CI/CD para AWS S3.
- Refactorización del módulo de cache para mejorar rendimiento (`cache/redis_manager.py`).

### Corregido
- Error de desbordamiento en el cálculo de métricas de disponibilidad.
- Typo en la configuración del balanceador de carga de Kubernetes (`k8s/load-balancer.yaml`).
- Bug que causaba memory leak en el servicio de notificaciones.

### Eliminado
- Soporte para versiones heredadas de la API v1.
- Dependencia obsoleta de `legacy-http-client`.

### Otros
- Actualización de dependencias de seguridad en `package.json`.
- Mejoras en la configuración de linting con ESLint.
```

### Paso 6: Crear el Google Doc

Usa el MCP de Google Drive para:

1. **Crear un nuevo Google Doc** con el título:
   ```
   Control de Cambios - [Nombre del Repo] - v[VERSION]
   ```
   
2. **Aplicar formato rich text**:
   - Título principal (H1): "Control de Cambios (Changelog)"
   - Párrafo introductorio con enlaces a Keep a Changelog y SemVer
   - Sección de versión (H2): "[VERSION] - FECHA"
   - Subsecciones (H3): Añadido, Cambiado, Corregido, Eliminado, Otros
   - Lista con viñetas para cada entrada
   - **Elimina secciones vacías** (si no hay cambios en "Eliminado", no incluyas esa sección)

3. **Guardar en la carpeta correcta**:
   - Ruta: `Mi unidad/Claude/Control de cambios/`
   - Si la carpeta no existe, créala
   - Usa la API de Google Drive para navegar y ubicar/crear la carpeta

### Paso 7: Confirmar y compartir

1. Muestra un resumen al usuario:
   ```
   ✅ Changelog generado exitosamente
   
   📄 Documento: Control de Cambios - [repo] - v[VERSION]
   📁 Ubicación: Mi unidad/Claude/Control de cambios/
   🔗 [Enlace al documento]
   
   Resumen de cambios:
   - X cambios añadidos
   - X cambios modificados
   - X correcciones
   - X eliminaciones
   - X otros
   ```

2. Proporciona el enlace directo al documento en Google Drive

## Manejo de casos especiales

### PR sin versión clara
Si no se puede inferir la versión:
```
"No pude detectar una versión en el PR. ¿Qué versión quieres asignar? 
(Formato SemVer: MAJOR.MINOR.PATCH, ej: 1.2.0)"
```

### PR muy grande (>50 archivos)
```
"Este PR tiene [N] archivos modificados. ¿Quieres que:
1. Genere un changelog resumido con los cambios más importantes
2. Genere un changelog completo (puede ser muy largo)
3. Te pregunte qué archivos incluir"
```

### Categorización ambigua
Si un cambio no encaja claramente en ninguna categoría, úsalo en "Otros" y menciona:
```
### Otros
- Cambio en [archivo/módulo]: [descripción] (categorización manual recomendada).
```

### Sin acceso a MCP de GitHub
```
"Para usar este skill necesito acceso al MCP de GitHub. 
Por favor, conéctalo en la configuración de herramientas y vuelve a intentarlo."
```

### Sin acceso a MCP de Google Drive
```
"Para subir el documento necesito acceso al MCP de Google Drive. 
Por favor, conéctalo en la configuración de herramientas y vuelve a intentarlo."
```

## Tips para mejores resultados

1. **Usa Conventional Commits** en tu proyecto para categorización más precisa
2. **Incluye versión en el título del PR** (ej: "Release v1.2.0")
3. **Escribe descripciones claras de PR** - serán usadas como contexto
4. **Usa labels** para marcar tipo de release (major, minor, patch)

## Ejemplo de uso

```
Usuario: "Genera el changelog del PR #123 del repositorio company/api-service"

Claude:
1. [Busca el PR en GitHub]
2. [Extrae información]
3. [Infiere versión: v2.1.0 del título]
4. [Categoriza 15 archivos modificados]
5. [Genera documento]
6. [Sube a Google Drive]

"✅ Changelog generado exitosamente
📄 Documento: Control de Cambios - api-service - v2.1.0
📁 Ubicación: Mi unidad/Claude/Control de cambios/
🔗 https://docs.google.com/document/d/[ID]

Resumen de cambios:
- 5 funcionalidades añadidas
- 7 cambios en funcionalidad existente
- 3 correcciones de bugs
- 0 eliminaciones
- 2 otros cambios"
```

## Dependencias

- **MCP de GitHub**: Para acceder a información de Pull Requests
- **MCP de Google Drive**: Para crear y subir documentos
- Permisos de lectura en el repositorio de GitHub
- Permisos de escritura en Google Drive

## Notas técnicas

- El skill usa la API de Google Docs para crear documentos con formato rich text, no archivos Markdown simples
- La categorización es automática pero el usuario puede revisar y editar el documento después
- Se preserva el formato Keep a Changelog incluyendo enlaces a la documentación oficial
- Las secciones vacías se eliminan automáticamente para mantener el documento limpio
