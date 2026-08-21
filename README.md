# Asturias, rumbo al CESA

Web oficial de la FBMPA para la cobertura de las selecciones asturianas de
balonmano en el Campeonato de España de Selecciones Autonómicas.

Sitio estático. Sin build, sin dependencias, sin CMS.

## La regla de oro

**Durante el campeonato solo se toca `js/datos.js`.** Todo lo demás es diseño
y no debería cambiar con prisa desde un pabellón.

### Chuleta de actualización rápida

| Qué ha pasado | Qué cambias en `datos.js` |
|---|---|
| Empieza un partido | `estado: "directo"` + pega el `youtubeId` |
| Termina | `estado: "finalizado"` + `golesAsturias` y `golesRival` |
| Llega la galería | pega la URL en `galeria` |
| Entra el patrocinador principal | `patrocinadorPrincipal: { activo: true, ... }` |

`youtubeId` es solo el ID: de `youtube.com/watch?v=ABC123` copias `ABC123`.

## Estructura

```
index.html                  Portada (héroe + hoy juegan + selecciones + resultados)
{seleccion}.html            6 páginas idénticas: solo cambia data-seleccion
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
- Niveles de patrocinio → campo `nivel` de `PATROCINADORES` (la página ya agrupa sola)
- Escudos propios por selección si los hay → campo `escudo`
