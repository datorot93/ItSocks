# Reporte de UX / UI / Performance — ItSocks Frontend
**Fecha:** 2026-04-20  
**URL analizada:** http://localhost:5173/  
**Páginas revisadas:** Home, /medias, /packs, /carrito, /lista_de_favoritos, detalle de producto  
**Viewport:** Desktop (1280×800) y Mobile (390×844)

---

## Resumen ejecutivo

El frontend presenta problemas críticos en tres áreas: (1) el backend no estaba respondiendo durante el análisis, lo que reveló que **ninguna página tiene manejo de errores o estados vacíos adecuados**; (2) hay inconsistencias visuales entre breakpoints; y (3) varias secciones tienen problemas de accesibilidad y jerarquía de contenido.

---

## 🔴 Crítico — Performance / Errores de red

### 1. El backend no levanta errores visibles al usuario
**Screenshots:** `03_medias.png`, `04_producto_detalle.png`, `08_packs_mobile.png`

Cuando el backend (localhost:8000) no responde, todas las páginas de productos muestran contenido completamente en blanco sin ningún mensaje. Los errores en consola son:

```
TypeError: Failed to fetch
  at getFiltersAccesorios (getProductsByCategory.js:137)
  at getContactInfo (getContactInfo.js:6)
  at getSliders (CarruselProductos.jsx:34)
```

**Impacto:** Un cliente que llega a `/medias` ve una página vacía sin saber si el sitio está roto o no hay productos.  
**Recomendación:** Agregar estados de error explícitos en cada componente que haga fetch. Ejemplo: "No pudimos cargar los productos. Intenta de nuevo."

### 2. Tiempos de respuesta de API muy altos
Cuando el backend sí responde, se registraron tiempos de ~3800ms para:
- `subcategories?skip=0&limit=100`
- `contact_info?skip=0&limit=100`
- `accesorios_designs?category=accesorios`

**Recomendación:** Agregar cache en el cliente (SWR o React Query), reducir llamadas redundantes por ruta.

### 3. Sin skeleton screens / loading states
Las páginas no muestran ningún indicador de carga mientras esperan la API. El usuario no sabe si el contenido está por llegar o simplemente no existe.

**Recomendación:** Implementar placeholders/skeletons en tarjetas de producto y secciones de contenido dinámico.

---

## 🔴 Crítico — UX

### 4. Estado vacío del carrito muestra formulario de envío completo
**Screenshot:** `05_carrito.png`, `07_carrito_mobile.png`

Cuando el carrito no tiene productos, se muestra el formulario completo de "Datos de Envío" con País, Departamento, Ciudad, dirección, etc. No hay ningún mensaje indicando que el carrito está vacío.

**Impacto:** Confusión total. El usuario no entiende si debe llenar el formulario antes de agregar productos.  
**Recomendación:** Mostrar un estado vacío claro: ilustración + texto "Tu carrito está vacío" + botón "Explorar productos".

### 5. Estado vacío de Lista de Deseos muestra botones de acción sin contenido
**Screenshot:** `09_favoritos.png`

La wishlist vacía muestra las cabeceras de tabla (PRODUCTO / PRECIO / CANTIDAD / TOTAL), el botón "COMPRAR LISTA" y "COMPARTIR LISTA DE DESEOS" sin ningún producto. Presionar "COMPRAR LISTA" sin ítems es una acción sin sentido.

**Recomendación:** Ocultar acciones y tabla cuando la lista está vacía. Mostrar CTA para explorar productos.

### 6. Popup de descuento aparece inmediatamente al entrar
**Screenshot:** `01_home.png`

El modal del 10% de descuento se lanza sin delay al cargar la página, bloqueando el contenido del hero. No recuerda si el usuario ya lo vio (no usa `localStorage`).

**Recomendación:**  
- Agregar un delay de 3-5 segundos antes de mostrarlo.  
- Guardarlo en `localStorage` para no mostrarlo a usuarios recurrentes.  
- El botón de cierre es un texto "X" plano, no un elemento `<button>` con `aria-label`.

### 7. Sección "Estilos de Vida" completamente vacía
**Screenshot:** `02_home_sin_popup.png`

Existe el heading "ESTILOS DE VIDA" pero no hay ningún contenido debajo. Hay un gap grande vacío que se ve como un bug de layout.

**Recomendación:** Agregar contenido real o eliminar la sección mientras no tiene datos.

---

## 🟡 Importante — UI / Consistencia visual

### 8. Precio del producto: color diferente en mobile vs desktop
**Screenshots:** `02_home_sin_popup.png` (desktop, negro) vs `06_home_mobile.png` (mobile, verde)

En el carousel de "Productos más vendidos", el precio se muestra en negro en desktop y en verde en mobile. Inconsistencia de estilos.

### 9. Nombre del producto truncado en el carousel
**Screenshots:** `02_home_sin_popup.png`

Los nombres de producto bajo las tarjetas del carousel se cortan con "ESTA ES UNA MEDIA" en mayúsculas (all caps) y se truncan en el borde. No hay tooltip ni forma de ver el nombre completo.

**Recomendación:** Usar `text-overflow: ellipsis` controlado o limitar el número de caracteres con `title` attribute para accesibilidad.

### 10. Gran espacio vacío en la sección de reseñas
**Screenshots:** `02_home_sin_popup.png`

Entre el texto de la reseña y el nombre del autor/estrellas hay un espacio vertical muy grande (~200px), como si hubiera un elemento invisible o una imagen faltante entre ellos.

### 11. Inconsistencia en el nombre de "Lista de deseos"
- URL: `/lista_de_favoritos`
- Breadcrumb: "Lista de favoritos"
- Heading H1: "LISTA DE DESEOS"

Tres nombres distintos para la misma funcionalidad. Elegir uno y ser consistente.

### 12. "Seguir comprando" cortado en la página de favoritos
**Screenshot:** `09_favoritos.png`

El link "Seguir comprando" aparece cortado en el borde izquierdo (overflow hidden). También carece de ícono o flecha que indique que es navegable.

### 13. Breadcrumb con demasiados niveles en detalle de producto
**Screenshot:** `04_producto_detalle.png`

El breadcrumb muestra: `Inicio | Medias | Media caña | Media caña | Diseño | Medias de compresion | Esta es una media`

"Media caña" aparece duplicado. La profundidad excesiva (7 niveles) fragmenta la navegación.

---

## 🟡 Importante — Accesibilidad

### 14. Logo del footer sin atributo `alt`
El `<img>` del logo de ItSocks en el footer no tiene texto alternativo (`alt=""`). Los lectores de pantalla no pueden identificarlo.

### 15. Inputs sin `<label>` asociado
Los campos de texto en el formulario del popup (Nombre, Correo) no tienen labels vinculadas con `for`/`id`. Afecta lectores de pantalla y usabilidad en mobile (tap en el label para focus).

### 16. Sin H1 en la página de inicio
El heading más alto en home es `<h2>` ("LOS PRODUCTOS MÁS VENDIDOS"). La página carece de `<h1>`. Esto perjudica SEO y accesibilidad.

### 17. Heading duplicado en sección de beneficios
"BENEFICIOS DE NUESTRAS" y "MEDIAS DE COMPRESIÓN" son dos `<h2>` separados que forman una sola frase. Deben ser un solo `<h2>` o usar `<br>`.

---

## 🟢 Menor — Detalles técnicos

### 18. URLs de producto con espacios sin encodear en el código fuente
Los links de producto usan paths con espacios literales en el código:
```
/medias/media caña/media_cania/diseño/medias_de_compresion/esta es una media
```
Aunque el navegador los encodea, es mejor práctica usar slugs limpios (guiones, sin caracteres especiales) desde el origen para SEO y compatibilidad.

### 19. Página de `/packs` no muestra filtros activos ni estado de carga
**Screenshot:** `08_packs_mobile.png`

Muestra el botón "Filtros" pero ningún contenido ni indicador de que está cargando. Igual que el problema #3.

### 20. El botón "Suscribir" no tiene validación visual
El campo de suscripción acepta cualquier texto sin validar formato de email antes del envío. No hay feedback de éxito/error tras enviar.

---

## Screenshots incluidos

| Archivo | Descripción |
|---|---|
| `01_home.png` | Home con popup activo (desktop) |
| `02_home_sin_popup.png` | Home sin popup (desktop) |
| `03_medias.png` | Página /medias vacía sin backend |
| `04_producto_detalle.png` | Detalle de producto vacío sin backend |
| `05_carrito.png` | Carrito vacío con formulario de envío visible (desktop) |
| `06_home_mobile.png` | Home en mobile (390px) |
| `07_carrito_mobile.png` | Carrito vacío en mobile |
| `08_packs_mobile.png` | /packs vacío en mobile |
| `09_favoritos.png` | Lista de deseos vacía (desktop) |

---

## Priorización sugerida

| Prioridad | Ítem | Esfuerzo estimado |
|---|---|---|
| P0 | Manejo de errores de API (páginas en blanco) | Medio |
| P0 | Estado vacío del carrito | Bajo |
| P0 | Estado vacío de wishlist | Bajo |
| P1 | Loading skeletons | Medio |
| P1 | Popup: delay + localStorage | Bajo |
| P1 | Sección "Estilos de vida" vacía | Bajo |
| P2 | Inconsistencia de nombres (favoritos/deseos) | Muy bajo |
| P2 | H1 faltante en home | Muy bajo |
| P2 | Labels en formularios | Muy bajo |
| P3 | Espaciado reseñas / precio mobile | Bajo |
| P3 | Slugs de URL limpios | Medio |
