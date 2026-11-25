# Asturias, rumbo al CESA

Web oficial de la FBMPA para seguir a las selecciones asturianas de balonmano
en el CESA 2027 (del 3 al 8 de enero de 2027, Cataluña): convocatorias,
calendario, resultados, directos, tienda y patrocinadores.

**Nombres:** el torneo se llama siempre **CESA** («CESA 2027» cuando se cita
el año). Tiene dos divisiones: «Campeonato de España» (primera) y «Copa de
España» (segunda, la que juegan las selecciones asturianas). No usar
«Campeonato de España» para referirse al torneo entero.

Sitio estático: HTML, CSS y JavaScript sin compilación, sin dependencias y sin
gestor de contenidos. Las normas de trabajo (publicar, vista previa, seguridad,
caché) están en `CLAUDE.md`.

## Cómo se publica

Se aloja en **GitHub Pages**, con el dominio `rumboalcesa.es` (registrado en
IONOS). Cada `push` a `main` lanza `.github/workflows/deploy-pages.yml`, que
publica en un minuto.

Hasta el lanzamiento la web está en **modo "Próximamente"**:

- `https://rumboalcesa.es/` enseña la carpeta `proximamente/` (el juego arcade
  de 7 metros).
- La web real sale en `https://rumboalcesa.es/vista-previa-p623z9u80x/`, con
  `noindex`. No enlazarla desde ningún sitio.

Para lanzar la web real, ver el comentario "PARA LANZAR" del workflow.

## La regla de oro

**Durante el campeonato solo se toca `js/datos.js`.** Todo lo demás es diseño
y no debería cambiar con prisa desde un pabellón.

### Chuleta de actualización rápida

| Cuándo | Qué haces en `datos.js` |
|---|---|
| Llegan hora y sede | Rellenar `hora` y `sede` del partido (y la sede en `SEDES`) |
| Días antes | `youtubeId` de cada directo ya programado en YouTube |
| Hora del partido | **Nada**: el reproductor se enciende solo (el enlace ya está) |
| Termina | `estado: "finalizado"` + `golesAsturias` y `golesRival` |
| Llega la galería | pega la URL en `galeria` |
| Cruces y fase final | Añadir el partido nuevo a `partidos` de su selección |
| Forzar emisión fuera de hora | `estado: "directo"` (partido adelantado, prórroga...) |
| Entra el patrocinador principal | `patrocinadorPrincipal: { activo: true, ... }` |

`youtubeId` es solo el ID: de `youtube.com/watch?v=ABC123` copias `ABC123`.

Mientras un partido no tenga hora o sede, la web pone «Hora por confirmar» y
«Sede por confirmar». El botón de directo solo aparece cuando el partido tiene
`youtubeId`.

### Actualización automática

La web comprueba cada minuto si `datos.js` cambió en el servidor. Al publicar
un cambio, quien tenga la pestaña abierta lo ve solo en ~1 minuto, sin
refrescar. Si alguien está viendo un directo no se le corta: le aparece un
aviso «Hay novedades» para actualizar cuando quiera.

Cuando pasa la hora de un partido `programado`, se muestra un chip **«En
juego»** calculado por reloj (durante 2h30). La portada y cada selección
enseñan además el **próximo partido con cuenta atrás**, calculado solo a
partir de las fechas.

## Estructura

```
index.html                  Portada (héroe, próxima jornada, selecciones, agenda día a día)
{seleccion}.html            6 páginas idénticas: solo cambia data-seleccion
directo.html                Sala del directo: reproductor + banners del patrocinador
tienda.html                 Tienda (catálogo; pedidos por correo a la federación)
patrocinadores.html
proximamente/               Lo que se ve en rumboalcesa.es hasta el lanzamiento: el juego
                            arcade "Asturias rumbo al CESA" (7 metros). Autocontenido.
js/datos.js                 ← EL archivo: configuración, sedes, patrocinadores y selecciones
js/app.js                   Render de todas las páginas (no tocar en caliente)
js/tienda-datos.js          Catálogo de la tienda, tal cual el boletín
js/tienda.js                Render de la tienda (solo se carga en tienda.html)
css/estilo.css              Tokens FBMPA + componentes
fuentes/                    Tipografías Barlow alojadas en la web (licencia OFL)
img/marca/                  Logos, favicon e imágenes para compartir (og-*.jpg)
img/jugadores/{seleccion}/  Fotos 4:5, WebP, 600×750, «nombre-apellido1-apellido2.webp»
img/staff/                  Fotos del cuerpo técnico, mismo formato (se muestran en círculo)
img/patrocinadores/         Logos de patrocinadores
img/tienda/                 Fotos de producto 4:5, WebP: «<id>.webp» (ver LEEME.md)
img/ambiente/               Fotos de ambiente de la portada
.github/workflows/          Publicación en GitHub Pages
```

## Datos (`js/datos.js`)

- **`CONFIG`**: nombre, edición, fechas y lugar, contacto y textos legales de
  la federación (los del pie), redes, correo de patrocinio y patrocinador
  principal.
- **`SEDES`**: vacío hasta que la organización las publique.
- **`PATROCINADORES`**: se muestran en este orden. `fondo` para logos con
  color propio; `alto: true` para logos casi cuadrados.
- **`SELECCIONES`**: grupo del sorteo, cuerpo técnico, plantilla y partidos de
  cada una. Los cargos van ya en masculino o femenino según la persona.

Todo lo que se pinta desde `datos.js` pasa por `esc()`.

## Fotos de jugadores y cuerpo técnico

Encuadre único de pecho para arriba, 4:5 vertical, 600×750 en WebP (unos
30–40 KB), con la cara centrada y el mismo aire sobre la cabeza en todas. El
archivo se llama como la persona, sin acentos y con guiones, y se enlaza en el
campo `foto`. Quien no tiene foto sale con el símbolo de la federación.

Los originales están en la carpeta de Drive «FOTOS WEB CESA», una subcarpeta
por selección (IM, IF, CM, CF, JM, JF) y otra para el cuerpo técnico, con el
nombre de la persona en cada archivo.

## Imágenes para compartir

Cada selección y la tienda tienen su propia imagen de vista previa del enlace
(`img/marca/og-<página>.jpg`, 1200×630); el resto de páginas usa
`og-default.jpg`. Ninguna lleva fotos de jugadores.

## Tienda

Solo ropa: siete prendas en una rejilla. Nombres, tallas, disponibilidad
(«disponible», «bajo pedido», «próximamente»), precios y forma de compra son
los de la página "Tienda FBMPA" del BOASBA nº 14/26-27, sin añadir nada que el
boletín no diga. Los precios van **sin IVA** («+ IVA»), como en el boletín.

La web no recoge pedidos: cada prenda tiene un botón «Pedir por correo» que
abre un correo a `TIENDA.email` con la prenda y el precio ya escritos. Se
recoge en la federación (C/ Espronceda 19, bajo, Gijón).

Las fotos de `img/tienda/` están sacadas del propio boletín (baja resolución).

## Pendientes (auditoría del 20 de noviembre de 2026)

Lista acordada con Rubén para ir resolviendo. Tachar o borrar cada punto al
hacerlo. Los números son los que se le dieron a él.

**Errores y cosas que pueden confundir**

5. Faltan 7 fotos del cuerpo técnico: Jorge Martínez, Sergio Bao, Rubén Rozada, Eduardo Valdés, Francisco Cimadevilla, Ana García Blanco y Samuel Tang Martínez (mientras, salen con el símbolo de la federación). EN ESPERA: ya están avisados; no preguntar, subirlas cuando Rubén las mande.
6. Juvenil masculina: falta la foto de Mauro Castaño Pérez. EN ESPERA: igual que el 5.
8. `directo.html?demo` enseña un partido de ejemplo del año pasado. DECIDIDO: se deja hasta que empiece el torneo (sirve para enseñar la web a patrocinadores); quitarlo el 3 de enero de 2027 o antes.

**Contenido que falta**

9. Horas y sedes de los 14 partidos. EN ESPERA: lo irá pasando la organización; no preguntar, cargarlo cuando Rubén lo mande.
10. Partidos del 5 al 8 de enero (cruces y fase final) y enlaces a los directos. EN ESPERA: igual que el 9.
17. Camiseta de juego Selección: sigue «Próximamente», sin precio. APARCADO: la tienda se queda como está hasta que haya más información.

**Mejoras**

21. Logo de Deporte Asturiano en mejor resolución. Las fotos de la tienda, APARCADAS con el resto de la tienda.
24. DECIDIDO: al lanzar, el juego pasa a una página propia oculta (sin enlaces desde la web y sin indexar), accesible solo con su enlace.

31. Más presencia de los patrocinadores (pedido por Rubén el 23 de noviembre, aplazado). Opciones que se le dieron: (1) cinta de logos en movimiento en todas las páginas, también en la tienda; (2) «ofrecido por» con logos que rotan junto a la cuenta atrás, el próximo partido y la agenda; (3) banda de logos junto al reproductor en directo; (4) tira de logos en las imágenes al compartir; (5) vallas con logos en el juego; (6) un patrocinador por selección. Recomendación dada: 1 y 2. Falta que diga cuáles quiere y si todos pesan igual. Ojo: no restar valor al hueco del patrocinador principal.

**Para el lanzamiento**

25. DECIDIDO: las fotos de jugadores y cuerpo técnico NO se indexan en buscadores. Al lanzar: mapa del sitio, dirección canónica por página y exclusión de `img/jugadores/` e `img/staff/`.
26. Las estadísticas cuentan también las visitas a la vista previa.
27. Cloudflare delante del dominio (cabeceras de seguridad y protección contra saturación). DECIDIDO: sí, pero DESPUÉS del lanzamiento, con calma. Es un cambio de DNS en IONOS, guiado paso a paso.
28. Verificación en dos pasos en IONOS (en GitHub ya está activada).

