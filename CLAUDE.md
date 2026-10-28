# Asturias, rumbo al CESA — normas de trabajo

## Publicar siempre al terminar

Cada encargo que cambie la web termina publicado, sin que Rubén tenga que pedirlo:

1. Comprobar en local (servidor estático, consola sin errores de JavaScript).
2. Commit y push a `main`. Si el remoto tiene commits nuevos, `git pull --rebase` y repetir el push.
3. Esperar a que termine el despliegue de GitHub Pages
   (`.github/workflows/deploy-pages.yml`, ~1 min). Está terminado cuando
   https://rubencandasmarketing-gif.github.io/rumboalcesa/ sirve el HTML con
   `?v=<los 7 primeros caracteres del commit>`.
4. Abrir la página cambiada en la web publicada, comprobar que se ve el cambio
   y dar a Rubén el enlace.

No hace falta pedir confirmación para el commit y el push a `main` de estos encargos.

## Caché

GitHub Pages cachea 10 min. El workflow añade `?v=<commit>` al CSS y a los
imports de los módulos JS solo en la copia publicada: en el repositorio las
rutas van sin versión. Un import nuevo debe ir con ruta relativa
(`./archivo.js`) para que se marque solo.
