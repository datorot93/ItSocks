# Guía de Referencia: Uso de MCPs

## MCP de GitHub

### Listar herramientas disponibles
Primero, verifica qué herramientas están disponibles en el MCP de GitHub:
```
tool_search(query="github pull request")
```

### Obtener información de un PR
```
# Típicamente la herramienta se llamará algo como:
github:get_pull_request(
    owner="mi-org",
    repo="mi-repo",
    pull_number=42
)
```

### Listar archivos modificados en un PR
```
github:list_pr_files(
    owner="mi-org",
    repo="mi-repo",
    pull_number=42
)
```

### Obtener commits de un PR
```
github:list_pr_commits(
    owner="mi-org",
    repo="mi-repo",
    pull_number=42
)
```

### Obtener diff de un archivo
```
github:get_file_diff(
    owner="mi-org",
    repo="mi-repo",
    pull_number=42,
    file_path="src/components/Auth.jsx"
)
```

## MCP de Google Drive

### Buscar una carpeta
```
tool_search(query="google drive folder")

# Luego usar la herramienta encontrada:
gdrive:search_files(
    query="name='Control de cambios' and mimeType='application/vnd.google-apps.folder'"
)
```

### Crear carpeta si no existe
```
gdrive:create_folder(
    name="Control de cambios",
    parent_id="[ID de la carpeta Claude]"
)
```

### Crear un Google Doc
```
gdrive:create_document(
    title="Control de Cambios - mi-repo - v1.2.0",
    content="[Contenido en formato Google Docs API]",
    parent_id="[ID de carpeta Control de cambios]"
)
```

### Actualizar contenido de un documento
```
gdrive:update_document(
    document_id="[ID del doc]",
    content="[Nuevo contenido]"
)
```

## Estructura de contenido para Google Docs

Google Docs acepta contenido en formato estructurado. Aquí un ejemplo:

```json
{
  "requests": [
    {
      "insertText": {
        "text": "Control de Cambios (Changelog)\n",
        "location": {"index": 1}
      }
    },
    {
      "updateParagraphStyle": {
        "range": {"startIndex": 1, "endIndex": 32},
        "paragraphStyle": {"namedStyleType": "HEADING_1"},
        "fields": "namedStyleType"
      }
    }
  ]
}
```

### Alternativa: Usar HTML/Markdown → Google Docs

Algunas versiones del MCP permiten:
```
gdrive:create_document_from_html(
    title="Control de Cambios - mi-repo - v1.2.0",
    html_content="<h1>Control de Cambios</h1><p>Contenido...</p>",
    parent_id="[ID carpeta]"
)
```

## Workflow completo de ejemplo

```python
# 1. Buscar herramientas de GitHub
tool_search(query="github pull request files")

# 2. Obtener info del PR
pr_data = github:get_pull_request(owner="company", repo="api", pull_number=123)

# 3. Obtener archivos modificados
files = github:list_pr_files(owner="company", repo="api", pull_number=123)

# 4. Para cada archivo importante, obtener diff
for file in files:
    diff = github:get_file_diff(
        owner="company", 
        repo="api", 
        pull_number=123,
        file_path=file.filename
    )
    # Analizar diff para categorización

# 5. Buscar carpeta en Google Drive
tool_search(query="google drive search folder")

folders = gdrive:search_files(
    query="name='Control de cambios' and mimeType='application/vnd.google-apps.folder'"
)

# 6. Si no existe, crear estructura de carpetas
# Mi unidad > Claude > Control de cambios

# 7. Crear el documento
doc = gdrive:create_document(
    title=f"Control de Cambios - api - v{version}",
    content=changelog_content,
    parent_id=folders[0].id
)

# 8. Retornar enlace
print(f"✅ Documento creado: {doc.webViewLink}")
```

## Notas importantes

1. **Nombres de herramientas**: Los nombres exactos de las herramientas MCP pueden variar. SIEMPRE usa `tool_search()` primero para descubrir los nombres reales.

2. **Autenticación**: Los MCPs requieren que el usuario haya autenticado las conexiones en Claude.ai

3. **Rate limits**: GitHub API tiene límites de tasa. Para PRs muy grandes, considera hacer llamadas por lotes.

4. **Formatos de fecha**: GitHub usa ISO 8601. Conviértelas a formato legible para humanos.

5. **IDs de carpetas**: Puedes cachear el ID de la carpeta "Control de cambios" en la primera ejecución para ejecuciones futuras más rápidas (pero siempre verifica que exista).
