# Asturias, rumbo al CESA — normas de trabajo

## Publicar siempre al terminar

Cada encargo que cambie la web termina publicado, sin que Rubén tenga que pedirlo:

1. Comprobar en local (servidor estático, consola sin errores de JavaScript).
2. Commit y push a `main`. Si el remoto tiene commits nuevos, `git pull --rebase` y repetir el push.
3. Esperar a que termine el despliegue de GitHub Pages
   (`.github/workflows/deploy-pages.yml`, ~1 min). Está terminado cuando la
   **vista previa** sirve el HTML con `?v=<los 7 primeros caracteres del commit>`.
4. Abrir la página cambiada en la vista previa publicada, comprobar que se ve
   el cambio y dar a Rubén el enlace.

No hace falta pedir confirmación para el commit y el push a `main` de estos encargos.

## Modo "Próximamente" (hasta el lanzamiento)

El workflow publica la carpeta `proximamente/` en la raíz del dominio y la web
real en una carpeta de vista previa, con `noindex`:

- Raíz: https://rumboalcesa.es/ (juego "Asturias rumbo al CESA", ver abajo)
- Web real: https://rumboalcesa.es/vista-previa-p623z9u80x/
- Mientras el dominio no esté conectado, las mismas rutas cuelgan de
  https://rubencandasmarketing-gif.github.io/rumboalcesa/

La raíz enseña el juego arcade "Asturias rumbo al CESA" (recreativa de
lanzamientos de 7 metros) con el aviso "Próximamente": es el gancho hasta el
lanzamiento. Todo el juego es `proximamente/index.html`, un único archivo con
su CSS y su JS dentro; las reglas y la dificultad están ajustadas a propósito,
no tocarlo sin que Rubén lo pida. La carpeta es autocontenida (favicon, fuentes
Barlow y Press Start 2P, `img/og-juego.png` para la vista previa del enlace) y
no hace peticiones externas. El workflow genera `404.html` a partir de ese
index, así que su `<head>` debe seguir en una línea propia.

No enlazar la vista previa desde ningún sitio. Para lanzar la web real, ver
el comentario "PARA LANZAR" en el workflow.

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
