# Asturias, rumbo al CESA — normas de trabajo

## Publicar siempre al terminar

Cada encargo que cambie la web termina publicado, sin que Rubén tenga que pedirlo:

1. Comprobar en local (servidor estático, consola sin errores de JavaScript).
2. Commit y push a `main`. Si el remoto tiene commits nuevos, `git pull --rebase` y repetir el push.
3. Esperar a que termine el despliegue de GitHub Pages
   (`.github/workflows/deploy-pages.yml`, ~1 min). Está terminado cuando
   https://rumboalcesa.es/ sirve el HTML con `?v=<los 7 primeros caracteres del commit>`.
4. Abrir la página cambiada en la web publicada, comprobar que se ve el
   cambio y dar a Rubén el enlace.

No hace falta pedir confirmación para el commit y el push a `main` de estos encargos.

## Web lanzada (25 de noviembre de 2026)

La web real está publicada en la raíz del dominio: https://rumboalcesa.es/
El workflow copia todo el repositorio menos lo interno (`CLAUDE.md`,
`README.md`, `.git`, `.github`). Ya no hay vista previa: cada push a `main` se
publica directamente a la vista de todo el mundo, así que hay que comprobar
bien en local antes de subir.

- **Página de error:** `404.html` (con `<base href="/">`). Quien llegue con un
  enlace de la antigua vista previa (`/vista-previa-.../pagina`) es redirigido
  a la misma página en su sitio real.
- **Buscadores:** `robots.txt` deja indexar la web y excluye `img/jugadores/`
  e `img/staff/` (fotos de menores: decisión de Rubén, no cambiar).
  `sitemap.xml` lista las 10 páginas; una página nueva debe añadirse ahí y
  llevar su `<link rel="canonical">`.
- **El juego** "Asturias rumbo al CESA" (recreativa de 7 metros) vive en
  `juego/` → https://rumboalcesa.es/juego/ . Está oculto: no se enlaza desde
  ninguna página, lleva `noindex` y no está en el mapa del sitio. Es un único
  archivo (`juego/index.html`) con su CSS y su JS dentro; las reglas y la
  dificultad están ajustadas a propósito, no tocarlo sin que Rubén lo pida. La
  carpeta es autocontenida (favicon, fuentes, imagen de enlace).

Todas las páginas HTML (incluidas `404.html` y `juego/index.html`) llevan el
fragmento de Cloudflare Web Analytics justo antes de `</body>`. Una página
nueva debe llevarlo también.

## Lista de pendientes

La lista de errores y mejoras acordada con Rubén (auditoría del 20 de
noviembre de 2026, 30 puntos numerados) está al final de `README.md`, en
"Pendientes". Cuando él pida seguir con "la lista", es esa. Al resolver un
punto, quitarlo de ahí.

## Seguridad

Todas las páginas HTML llevan una política de seguridad de contenido (meta
`Content-Security-Policy`) y `referrer`. Solo se cargan recursos de la propia
web y de: Cloudflare Web Analytics, miniaturas de YouTube (`i.ytimg.com`) y el
reproductor `youtube-nocookie.com`. Las tipografías están alojadas en la
propia web (`fuentes/`), no en Google Fonts. Consecuencias:

- Nada de JavaScript en línea en la web real (ni `<script>` con código ni
  atributos `onclick`/`onerror`): se bloquea. Todo va en `js/*.js`.
- Un servicio externo nuevo (otro vídeo, mapa, widget, fuente) hay que añadirlo
  a la política de TODAS las páginas o no cargará.
- Una página nueva debe copiar las dos etiquetas meta de las demás.
- El juego (`juego/index.html`) tiene su propia política, que sí
  permite su script en línea.
- Los datos de `datos.js` se pintan siempre con `esc()`.

GitHub Pages no deja enviar cabeceras propias (HSTS, X-Frame-Options): si se
quieren, hay que poner Cloudflare delante del dominio.

## Caché

GitHub Pages cachea 10 min. El workflow añade `?v=<commit>` al CSS y a los
imports de los módulos JS solo en la copia publicada: en el repositorio las
rutas van sin versión. Un import nuevo debe ir con ruta relativa
(`./archivo.js`) para que se marque solo.

## Entorno de la sesión

Para el paso 4 hace falta abrir la web publicada (rumboalcesa.es o
rubencandasmarketing-gif.github.io). Solo lo permite el entorno en la nube
**"rumboalcesa"** (env_01K9fAib1gJH4fu4K25SkdwN).
Si la sesión arranca en otro entorno y el proxy bloquea esa web, no le pidas
a Rubén que lo cambie a mano: llama a get_environment con ese id y propón
switch_environment. Él solo tiene que aprobar la tarjeta.
