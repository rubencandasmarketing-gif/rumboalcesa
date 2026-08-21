# Asturias, rumbo al CESA

Web oficial de la FBMPA para la cobertura de las selecciones asturianas de
balonmano en el Campeonato de España de Selecciones Autonómicas.

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
patrocinadores.html
js/datos.js                 ← EL archivo
js/app.js                   Render (no tocar en caliente)
css/estilo.css              Tokens FBMPA + componentes
img/marca/                  Logos transparentes generados, favicon, OG
img/jugadores/{seleccion}/  Fotos 4:5, WebP, ~600×750, 80-120 KB, «07-garcia.webp»
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
