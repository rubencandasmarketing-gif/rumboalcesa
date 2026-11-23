# Asturias, rumbo al CESA

Web oficial de la FBMPA para la cobertura de las selecciones asturianas de
balonmano en el CESA.

**Nombres:** el torneo se llama siempre **CESA** («CESA 2027» cuando se cita
el año). Tiene dos divisiones: «Campeonato de España» (primera) y «Copa de
España» (segunda, la que juegan las selecciones asturianas). No usar
«Campeonato de España» para referirse al torneo entero.

Sitio estático. Sin build, sin dependencias, sin CMS.

## La regla de oro

**Durante el campeonato solo se toca `js/datos.js`.** Todo lo demás es diseño
y no debería cambiar con prisa desde un pabellón.

### Chuleta de actualización rápida

| Cuándo | Qué haces en `datos.js` |
|---|---|
| Días antes | Calendario completo + `youtubeId` de cada directo ya programado en YouTube |
| Hora del partido | **Nada**: el reproductor se enciende solo (el enlace ya está) |
| Termina | `estado: "finalizado"` + `golesAsturias` y `golesRival` |
| Llega la galería | pega la URL en `galeria` |
| Forzar emisión fuera de hora | `estado: "directo"` (partido adelantado, prórroga...) |
| Entra el patrocinador principal | `patrocinadorPrincipal: { activo: true, ... }` |

`youtubeId` es solo el ID: de `youtube.com/watch?v=ABC123` copias `ABC123`.

### Actualización automática

La web comprueba cada minuto si `datos.js` cambió en el servidor. Al publicar
un cambio (push → deploy de Cloudflare), los espectadores con la pestaña
abierta lo ven solos en ~1 minuto, sin refrescar. Si alguien está viendo un
directo no se le corta: le aparece un aviso «Hay novedades» para actualizar
cuando quiera.

Además, cuando pasa la hora de un partido `programado`, se muestra un chip
**«En juego»** calculado por reloj (durante 2h30). El estado `directo` con
reproductor sigue siendo manual a propósito: solo se anuncia emisión cuando
hay enlace real.

## Estructura

```
index.html                  Portada (héroe + directos + selecciones + agenda día a día)
{seleccion}.html            6 páginas idénticas: solo cambia data-seleccion
directo.html                Sala del directo: reproductor + banners del patrocinador
proximamente/               Lo que se ve en rumboalcesa.es hasta el lanzamiento: el juego
                            arcade "Asturias rumbo al CESA" (7 metros). Autocontenido.
tienda.html                 Tienda oficial (catálogo; pedidos por correo a la federación)
patrocinadores.html
js/datos.js                 ← EL archivo
js/app.js                   Render (no tocar en caliente)
js/tienda-datos.js          Catálogo, precios (sin IVA), disponibilidad y correo de la tienda
js/tienda.js                Lógica de la tienda (solo se carga en tienda.html)
img/tienda/                 Fotos de producto 4:5, WebP: «<id>.webp» (ver LEEME.md)
css/estilo.css              Tokens FBMPA + componentes
img/marca/                  Logos transparentes generados, favicon, OG
img/jugadores/{seleccion}/  Fotos 4:5, WebP, 600×750, «nombre-apellido1-apellido2.webp»
img/staff/                 Fotos del cuerpo técnico, mismo formato (se muestran en círculo)
_headers                    noindex de las fotos de jugadores (Cloudflare Pages)
```

## Datos de ejemplo

`datos.js` incluye datos marcados **EJEMPLO** (una sede, dos jugadores y tres
partidos en juvenil masculina, uno por estado). Sirven para enseñar la web a
patrocinadores con la interfaz viva. **Bórralos antes de cargar datos reales.**
El partido "en directo" tiene fecha 2026-08-19 para que salga en «hoy juegan»
durante la demo; caducará solo.

## Publicar en Cloudflare Pages

1. Sube esta carpeta a un repositorio (GitHub).
2. Cloudflare Pages → Create project → conecta el repo.
3. Framework preset: **None**. Build command: vacío. Output: `/`.
4. Custom domain: `rumboalcesa.es` cuando esté registrado.

El archivo `_headers` aplica `X-Robots-Tag: noindex` a `/img/jugadores/*`
automáticamente (decisión nº 11: las caras de los menores no se indexan).

## Fotos de jugadores

Encuadre único de pecho para arriba, 4:5 vertical. Exportar:

```bash
# con ImageMagick, desde la carpeta de originales:
magick foto.jpg -resize 600x750^ -gravity north -extent 600x750 -quality 82 07-garcia.webp
```

Objetivo: 80–120 KB por foto. La web reserva el hueco con `aspect-ratio`,
así que da igual que la foto tarde: no hay saltos de maquetación.

## Pendiente (no bloquea)

- Confirmar registro de `rumboalcesa.es` (y valorar `.com` redirigido)
- Fechas y edición reales del CESA → `CONFIG.edicion`
- Canal de YouTube → `CONFIG.canalYoutube`
- Enlaces de redes de la federación → `CONFIG.redes` (X, Instagram, Facebook; el pie los muestra solo)
- Los 6 patrocinadores habituales → rellenar `nombre`, `logo` y `url` en `PATROCINADORES` (logos a `img/patrocinadores/`)
- Escudos propios por selección si los hay → campo `escudo`

## Tienda

Solo ropa: siete prendas (chaquetón, chándal, sudadera de calentamiento,
camiseta de juego Selección, camiseta de juego Playa, camiseta de paseo y
bufanda) en una sola rejilla. Catálogo, precios, disponibilidad («disponible»,
«bajo pedido», «próximamente») y forma de compra salen de la página "Tienda
FBMPA" del BOASBA nº 14/26-27; los precios se guardan **sin IVA** en
`js/tienda-datos.js` y la web los enseña igual que el boletín («+ IVA»).
Cómo comprar: elegir talla y
cantidad, hacer el pedido por correo (fbmpa@fbmpa.com) y recoger en la
federación (C/ Espronceda 19, bajo, Gijón). Lo «bajo pedido» se encarga al
reunir las reservas. La camiseta de juego Selección (nuevo modelo CESA 2027)
sale como «Próximamente» y no se puede pedir hasta que tenga precio.

Las fotos de `img/tienda/` están sacadas del propio boletín (baja resolución):
conviene cambiarlas por fotos de producto reales cuando las haya.

La web no recoge pedidos: todo se pide por correo a la federación. Cada prenda
tiene un botón «Pedir por correo» que abre un correo a `TIENDA.email` con la
prenda y el precio ya escritos, y huecos para talla, cantidad, nombre y teléfono.

## Pendientes (auditoría del 20 de noviembre de 2026)

Lista acordada con Rubén para ir resolviendo. Tachar o borrar cada punto al
hacerlo. Los números son los que se le dieron a él.

**Errores y cosas que pueden confundir**

5. Faltan 7 fotos del cuerpo técnico: Jorge Martínez, Sergio Bao, Rubén Rozada, Eduardo Valdés, Francisco Cimadevilla, Ana García Blanco y Samuel Tang Martínez (mientras, salen con el símbolo de la federación).
6. Juvenil masculina: falta la foto de Mauro Castaño Pérez.
8. `directo.html?demo` enseña un partido de ejemplo del año pasado: quitar antes de lanzar.

**Contenido que falta**

9. Horas y sedes de los 14 partidos. EN ESPERA: lo irá pasando la organización; no preguntar, cargarlo cuando Rubén lo mande.
10. Partidos del 5 al 8 de enero (cruces y fase final) y enlaces a los directos. EN ESPERA: igual que el 9.
17. Camiseta de juego Selección: sigue «Próximamente», sin precio. APARCADO: la tienda se queda como está hasta que haya más información.

**Mejoras**

19. Bloque «próximo partido» o cuenta atrás en portada y selecciones.
20. Imagen al compartir propia para la tienda y cada selección.
21. Logo de Deporte Asturiano en mejor resolución. Las fotos de la tienda, APARCADAS con el resto de la tienda.
22. Alojar las tipografías en la web en vez de cargarlas de Google.
24. Decidir qué pasa con el juego al lanzar (¿página propia?).

**Para el lanzamiento**

25. Mapa del sitio, dirección canónica por página y decidir si las fotos de menores se indexan.
26. Las estadísticas cuentan también las visitas a la vista previa.
27. Cloudflare delante del dominio (cabeceras de seguridad): decisión pendiente.
28. Verificación en dos pasos en GitHub e IONOS.

**Mantenimiento interno**

29. Este README está desactualizado en varias partes (datos de ejemplo, `_headers`, Cloudflare Pages).
