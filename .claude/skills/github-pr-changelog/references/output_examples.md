# Ejemplos de Output Esperado

## Ejemplo 1: Changelog completo típico

```markdown
# Control de Cambios (Changelog)

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) 
y este proyecto adhiere a [SemVer](https://semver.org/lang/es/).

## [2.1.0] - 2026-04-21

### Añadido
- Nueva funcionalidad para la exportación de reportes en formato PDF desde el módulo de analytics.
- Soporte para autenticación mediante tokens JWT en la API REST (`src/auth/jwt_handler.py`).
- Endpoint `/api/v2/notifications` para gestión de notificaciones push con WebSockets.
- Validación de esquemas JSON en requests usando JSON Schema Draft 7.

### Cambiado
- Se optimizó el rendimiento de las queries de búsqueda mediante índices compuestos en MongoDB (mejora del 40%).
- Actualización de la documentación de la API en Swagger/OpenAPI 3.0.
- Refactorización del módulo de cache Redis para soportar clusterización (`cache/redis_cluster.py`).
- Migración de configuración de variables de entorno de `.env` a AWS Secrets Manager.

### Corregido
- Error de race condition en el procesamiento concurrente de tareas del worker pool.
- Bug que causaba memory leak en el servicio de procesamiento de imágenes (issue #245).
- Validación incorrecta de emails en el formulario de registro de usuarios.
- Typo en la respuesta de error 404 del endpoint de búsqueda.

### Eliminado
- Soporte para la API v1 deprecada (EOL: 2026-03-01).
- Dependencia heredada de `old-http-client` reemplazada por `axios`.

### Otros
- Actualización de dependencias de seguridad: `lodash@4.17.21`, `moment@2.29.4`.
- Configuración de pipeline de CI/CD en GitHub Actions para deploys automáticos.
- Mejoras en el linting con ESLint 8.0 y Prettier 3.0.
```

## Ejemplo 2: Changelog con categorías limitadas

```markdown
# Control de Cambios (Changelog)

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) 
y este proyecto adhiere a [SemVer](https://semver.org/lang/es/).

## [1.0.1] - 2026-04-15

### Corregido
- Error de cálculo en métricas de disponibilidad que mostraba valores superiores al 100%.
- Bug crítico en el sistema de autenticación que permitía bypass con tokens expirados (CVE-2026-12345).
- Formato incorrecto de timestamps en logs del servicio de auditoría.

### Otros
- Actualización de la documentación README con instrucciones de instalación mejoradas.
- Bump de versiones de dependencias según reporte de Dependabot.
```

## Ejemplo 3: Release mayor con breaking changes

```markdown
# Control de Cambios (Changelog)

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) 
y este proyecto adhiere a [SemVer](https://semver.org/lang/es/).

## [3.0.0] - 2026-04-20

### Añadido
- Nueva arquitectura basada en microservicios con comunicación event-driven usando Apache Kafka.
- Sistema de autenticación SSO con soporte para SAML 2.0 y OAuth 2.0.
- Dashboard administrativo completamente rediseñado en React 18 con TypeScript.
- Soporte para deployment en Kubernetes con Helm charts incluidos.

### Cambiado
- **BREAKING**: Migración de REST API a GraphQL - los endpoints REST legacy están deprecados.
- **BREAKING**: Cambio en el esquema de base de datos - requiere migración manual (ver `docs/migrations/v3.md`).
- **BREAKING**: Modificación de formato de respuesta de errores para consistencia con RFC 7807.
- Reescritura completa del motor de procesamiento de pagos para cumplir con PCI DSS 4.0.

### Eliminado
- **BREAKING**: Eliminación de soporte para Python 3.7 y 3.8 (EOL).
- **BREAKING**: Remoción de endpoints deprecados de API v1 y v2.
- Eliminación de feature flags experimentales que ya están en GA.

### Otros
- Documentación completamente renovada con ejemplos interactivos en GitBook.
- Actualización de la guía de contribución con nuevos estándares de código.
```

## Ejemplo 4: Resumen corto para el usuario

Después de generar el changelog, mostrar al usuario:

```
✅ Changelog generado exitosamente

📄 Documento: Control de Cambios - api-service - v2.1.0
📁 Ubicación: Mi unidad/Claude/Control de cambios/
🔗 https://docs.google.com/document/d/1a2b3c4d5e6f7g8h9i0j/edit

📊 Resumen de cambios:
   • 4 funcionalidades añadidas
   • 4 cambios en funcionalidad existente
   • 4 correcciones de bugs
   • 2 elementos eliminados
   • 3 otros cambios

📝 Total: 17 entradas documentadas

💡 Tip: Revisa el documento y ajusta manualmente las descripciones si es necesario.
    Puedes compartirlo con tu equipo directamente desde Google Drive.
```

## Formato en Google Docs (estructura visual)

El documento final en Google Docs debe verse así:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Control de Cambios (Changelog)       [H1]     │
│                                                 │
│  Todos los cambios notables...        [Normal] │
│                                                 │
│  El formato está basado en...         [Normal] │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━           │
│                                                 │
│  [2.1.0] - 2026-04-21              [H2]        │
│                                                 │
│  Añadido                               [H3]     │
│                                                 │
│  • Nueva funcionalidad para...        [Bullet] │
│  • Soporte para autenticación...      [Bullet] │
│                                                 │
│  Cambiado                              [H3]     │
│                                                 │
│  • Se optimizó el rendimiento...      [Bullet] │
│                                                 │
│  Corregido                             [H3]     │
│                                                 │
│  • Error de race condition...         [Bullet] │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Mensaje cuando no hay cambios en una categoría

Si una categoría está vacía, **no incluirla** en el documento. Por ejemplo:

```markdown
## [1.0.2] - 2026-04-18

### Corregido
- Fix de seguridad en validación de inputs.

### Otros
- Actualización de dependencias.

<!-- NO incluir secciones vacías como "Añadido", "Cambiado", "Eliminado" -->
```
