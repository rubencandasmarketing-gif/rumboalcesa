/* =============================================================================
   APP.JS — Asturias, rumbo al CESA
   Render de plantillas. Lee TODO de datos.js: este archivo no se toca durante
   el campeonato. Cada página declara qué es con <body data-pagina="...">
   (portada | seleccion | patrocinadores) y, si es selección,
   data-seleccion="juvenil-masculina".
   ============================================================================= */

import { CONFIG, SEDES, PATROCINADORES, SELECCIONES } from "./datos.js";

/* --- Utilidades ----------------------------------------------------------- */

const $ = (sel, ctx = document) => ctx.querySelector(sel);

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content;
}

/** Escapa texto que viene de datos.js antes de insertarlo en HTML. */
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function sedeDe(id) {
  return SEDES.find(s => s.id === id) || null;
}

function nombreSeleccion(sel) {
  return `${sel.categoria} ${sel.genero}`;
}

const FMT_FECHA = new Intl.DateTimeFormat("es-ES", {
  weekday: "long", day: "numeric", month: "long"
});

function fechaLarga(iso) {
  const f = FMT_FECHA.format(new Date(iso + "T12:00:00"));
  return f.charAt(0).toUpperCase() + f.slice(1);
}

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* --- Cabecera y pie (comunes a todas las páginas) -------------------------- */

function renderCabecera() {
  const p = CONFIG.patrocinadorPrincipal;
  const franja = p.activo
    ? `<a href="${esc(p.url)}" rel="sponsored noopener" target="_blank">
         <img src="${esc(p.logo)}" alt="${esc(p.nombre)}, patrocinador principal">
       </a>`
    : `<a class="patro-placeholder--franja" href="${esc(CONFIG.contactoPatrocinio)}">
         <b>Este espacio puede ser tuyo</b><span>· Patrocinador principal · Contactar</span>
       </a>`;

  const enlaces = SELECCIONES.map(s =>
    `<li><a href="${s.id}.html">${esc(s.categoria)} ${s.genero === "Masculina" ? "M" : "F"}</a></li>`
  ).join("");

  document.body.prepend(el(`
    <div class="franja-principal"><div class="contenedor">${franja}</div></div>
    <header class="cabecera">
      <div class="contenedor">
        <a class="cabecera__marca" href="index.html" aria-label="${esc(CONFIG.nombreSitio)} — portada">
          <img src="img/marca/fbmpa-blanco.png" alt="FBMPA">
          <span class="cabecera__titulo">Rumbo al <b>CESA</b></span>
        </a>
        <nav class="nav" aria-label="Selecciones">
          <ul>
            <li><a href="index.html">Portada</a></li>
            ${enlaces}
            <li><a href="patrocinadores.html">Patrocinadores</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `));

  // Marca la página actual en la navegación
  const aqui = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    if (a.getAttribute("href") === aqui) a.setAttribute("aria-current", "page");
  });
}

function renderPie() {
  const p = CONFIG.patrocinadorPrincipal;
  const cierre = p.activo
    ? `<a href="${esc(p.url)}" rel="sponsored noopener" target="_blank">
         <img src="${esc(p.logo)}" alt="${esc(p.nombre)}" style="max-height:60px;width:auto">
       </a>`
    : `<a class="patro-placeholder" href="${esc(CONFIG.contactoPatrocinio)}" style="text-decoration:none">
         <strong>Este espacio puede ser tuyo</strong>
         <span>Patrocinador principal de la cobertura — presencia en todas las páginas y junto a cada directo.</span>
       </a>`;

  document.body.append(el(`
    <div class="patro-cierre">
      <div class="contenedor" style="display:grid;place-items:center">${cierre}</div>
    </div>
    <footer class="pie">
      <div class="contenedor">
        <a href="https://www.fbmpa.com" rel="noopener" target="_blank" aria-label="Federación de Balonmano del Principado de Asturias">
          <img src="img/marca/fbmpa-blanco.png" alt="FBMPA">
        </a>
        <p style="margin:0">
          Web oficial de la Federación de Balonmano del Principado de Asturias.<br>
          ${esc(CONFIG.edicion)} · <a href="patrocinadores.html">Patrocinadores</a>
        </p>
      </div>
    </footer>
  `));
}

/* --- Tarjeta de partido ----------------------------------------------------
   El campo `estado` manda:
   programado → fecha, hora, sede, rival
   directo    → distintivo EN DIRECTO + reproductor (fachada)
   finalizado → marcador + repetición + galería
---------------------------------------------------------------------------- */

function tarjetaPartido(partido, sel, { conSeleccion = false } = {}) {
  const sede = sedeDe(partido.sede);
  const sedeHTML = sede
    ? `<span class="partido__sede">📍 <a href="${esc(sede.mapa)}" rel="noopener" target="_blank">${esc(sede.nombre)}, ${esc(sede.municipio)}</a></span>`
    : "";

  const etiquetaSel = conSeleccion
    ? `<span class="partido__fase" style="color:var(--azul-800)">${esc(nombreSeleccion(sel))}</span>`
    : "";

  let cabecera = "";
  let cruce = "";
  let media = "";
  let acciones = "";

  const asturias = `<span class="partido__equipo">Asturias</span>`;
  const rival = `<span class="partido__equipo">${esc(partido.rival)}</span>`;

  if (partido.estado === "directo") {
    cabecera = `<span class="directo-badge"><span><span class="punto" aria-hidden="true"></span>En directo</span></span>`;
    cruce = `${asturias}<span class="vs">–</span>${rival}`;
    media = reproductor(partido);
    if (CONFIG.canalYoutube || partido.youtubeId) {
      const url = partido.youtubeId
        ? `https://www.youtube.com/watch?v=${encodeURIComponent(partido.youtubeId)}`
        : CONFIG.canalYoutube;
      acciones = `<a class="btn btn--ghost" href="${esc(url)}" rel="noopener" target="_blank">Ver en YouTube</a>`;
    }
  } else if (partido.estado === "finalizado") {
    cruce = `${asturias}
      <span class="marcador"><span>${partido.golesAsturias ?? "–"}</span><span>·</span><span>${partido.golesRival ?? "–"}</span></span>
      ${rival}`;
    const btns = [];
    if (partido.youtubeId) {
      btns.push(`<a class="btn btn--ghost" href="https://www.youtube.com/watch?v=${encodeURIComponent(partido.youtubeId)}" rel="noopener" target="_blank">Ver repetición</a>`);
    }
    if (partido.galeria) {
      btns.push(`<a class="btn btn--ghost" href="${esc(partido.galeria)}" rel="noopener" target="_blank">Galería de fotos</a>`);
    }
    acciones = btns.join("");
  } else { // programado
    cruce = `${asturias}<span class="vs">vs</span>${rival}`;
  }

  return `
    <article class="partido ${partido.estado === "directo" ? "partido--directo" : ""}">
      ${media}
      <div class="partido__cuerpo">
        <div class="partido__meta">
          ${etiquetaSel}
          <span class="partido__fase">${esc(partido.fase)}</span>
          <span>${fechaLarga(partido.fecha)} · ${esc(partido.hora)}</span>
          ${sedeHTML}
        </div>
        <div class="partido__cruce">${cabecera}${cruce}</div>
        ${acciones ? `<div class="partido__acciones">${acciones}</div>` : ""}
      </div>
    </article>`;
}

/* Fachada del reproductor: el iframe de YouTube SOLO se carga al pulsar. */
function reproductor(partido) {
  const p = CONFIG.patrocinadorPrincipal;
  const patro = p.activo
    ? `<div class="patro-reproductor"><span>Directo ofrecido por</span>
         <a href="${esc(p.url)}" rel="sponsored noopener" target="_blank"><img src="${esc(p.logo)}" alt="${esc(p.nombre)}"></a>
       </div>`
    : `<div class="patro-reproductor">
         <a class="patro-placeholder--inline patro-placeholder" href="${esc(CONFIG.contactoPatrocinio)}" style="text-decoration:none">
           <strong>Tu marca junto a cada directo</strong> · contactar
         </a>
       </div>`;

  if (!partido.youtubeId) {
    return `<div class="reproductor" data-partido="${esc(partido.id)}">
        <div class="reproductor__fachada" style="cursor:default">
          <span style="position:relative;z-index:1;color:var(--azul-100);font-weight:700">El directo aparecerá aquí</span>
        </div>
      </div>${patro}`;
  }

  const miniatura = `https://i.ytimg.com/vi/${encodeURIComponent(partido.youtubeId)}/hqdefault.jpg`;
  return `
    <div class="reproductor" data-partido="${esc(partido.id)}" data-youtube="${esc(partido.youtubeId)}">
      <button class="reproductor__fachada" type="button" aria-label="Reproducir el directo: Asturias contra ${esc(partido.rival)}">
        <img src="${miniatura}" alt="" loading="lazy">
        <span class="reproductor__play" aria-hidden="true"></span>
      </button>
    </div>${patro}`;
}

/* Delegación: al pulsar una fachada, se sustituye por el iframe con autoplay. */
document.addEventListener("click", e => {
  const btn = e.target.closest(".reproductor__fachada");
  if (!btn) return;
  const caja = btn.closest(".reproductor");
  const id = caja?.dataset.youtube;
  if (!id) return;
  caja.innerHTML = `<iframe
    src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0"
    title="Directo en YouTube" allow="autoplay; encrypted-media; picture-in-picture"
    allowfullscreen></iframe>`;
});

/* --- Portada --------------------------------------------------------------- */

function todosLosPartidos() {
  return SELECCIONES.flatMap(sel =>
    sel.partidos.map(p => ({ partido: p, sel }))
  );
}

function renderPortada() {
  const main = $("main");
  const hoy = hoyISO();
  const todos = todosLosPartidos();

  // --- Hoy juegan ---
  const deHoy = todos
    .filter(({ partido }) => partido.fecha === hoy)
    .sort((a, b) => {
      // El directo manda; después, por hora
      const d = (b.partido.estado === "directo") - (a.partido.estado === "directo");
      return d || a.partido.hora.localeCompare(b.partido.hora);
    });

  let contenidoHoy;
  let tituloHoy = "Hoy juegan";
  if (deHoy.length) {
    contenidoHoy = deHoy.map(({ partido, sel }) =>
      tarjetaPartido(partido, sel, { conSeleccion: true })).join("");
  } else {
    const proximos = todos
      .filter(({ partido }) => partido.estado === "programado" && partido.fecha >= hoy)
      .sort((a, b) => (a.partido.fecha + a.partido.hora).localeCompare(b.partido.fecha + b.partido.hora));
    if (proximos.length) {
      tituloHoy = "Próximo partido";
      const { partido, sel } = proximos[0];
      contenidoHoy = tarjetaPartido(partido, sel, { conSeleccion: true });
    } else {
      contenidoHoy = `<div class="vacio">El calendario se publicará próximamente.</div>`;
    }
  }

  // --- Rejilla de selecciones ---
  const rejilla = SELECCIONES.map(s => `
    <a class="seleccion-card" href="${s.id}.html">
      <img src="${s.escudo ? esc(s.escudo) : "img/marca/simbolo-amarillo.png"}" alt="" loading="lazy">
      <span class="seleccion-card__cat">${esc(s.categoria)}</span>
      <span class="seleccion-card__gen">${esc(s.genero)}</span>
    </a>`).join("");

  // --- Últimos resultados ---
  const finalizados = todos
    .filter(({ partido }) => partido.estado === "finalizado")
    .sort((a, b) => (b.partido.fecha + b.partido.hora).localeCompare(a.partido.fecha + a.partido.hora))
    .slice(0, 6);

  const resultados = finalizados.length
    ? finalizados.map(({ partido, sel }) => `
        <a class="resultado" href="${sel.id}.html">
          <span class="resultado__sel">${esc(sel.categoria)} ${sel.genero === "Masculina" ? "M" : "F"}</span>
          <span>Asturias – ${esc(partido.rival)}</span>
          <span class="marcador"><span>${partido.golesAsturias}</span><span>·</span><span>${partido.golesRival}</span></span>
        </a>`).join("")
    : `<div class="vacio">Aún no hay resultados. Todo empieza en breve.</div>`;

  main.append(el(`
    <div class="heroe">
      <div class="contenedor">
        <div class="heroe__texto anim-entrada">
          <h1>Asturias,<br>rumbo al <span>CESA</span></h1>
          <p>Seis selecciones. Una semana. Toda la cobertura del Campeonato de España
             de Selecciones Autonómicas de balonmano: convocatorias, calendario,
             resultados y todos los partidos en directo.</p>
        </div>
        <img class="heroe__simbolo" src="img/marca/simbolo-amarillo.png" alt="" aria-hidden="true">
      </div>
    </div>

    <section class="hoy-juegan contenedor" aria-labelledby="t-hoy">
      <p class="eyebrow" id="t-hoy">${tituloHoy}</p>
      <div class="hoy-juegan__lista">${contenidoHoy}</div>
    </section>

    <section class="contenedor" aria-labelledby="t-sel">
      <p class="eyebrow">Las seis selecciones</p>
      <h2 id="t-sel">Nuestros equipos</h2>
      <div class="selecciones-grid">${rejilla}</div>
    </section>

    <section class="contenedor" aria-labelledby="t-res">
      <p class="eyebrow">Marcadores</p>
      <h2 id="t-res">Últimos resultados</h2>
      <div class="resultados-lista">${resultados}</div>
    </section>

    ${franjaPatrocinadores()}
  `));
}

/* --- Página de selección --------------------------------------------------- */

function renderSeleccion(id) {
  const sel = SELECCIONES.find(s => s.id === id);
  const main = $("main");
  if (!sel) {
    main.append(el(`<div class="contenedor"><div class="vacio">Selección no encontrada.</div></div>`));
    return;
  }

  document.title = `${nombreSeleccion(sel)} — ${CONFIG.nombreSitio}`;

  const partidos = [...sel.partidos]
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

  const calendario = partidos.length
    ? partidos.map(p => tarjetaPartido(p, sel)).join("")
    : `<div class="vacio">El calendario se publicará próximamente.</div>`;

  const plantilla = sel.plantilla.length
    ? sel.plantilla.map(j => `
        <article class="ficha">
          <div class="ficha__foto">
            ${j.foto ? `<img src="${esc(j.foto)}" alt="${esc(j.nombre)}, dorsal ${j.dorsal}" loading="lazy">` : ""}
            <span class="ficha__dorsal"><span>${j.dorsal}</span></span>
          </div>
          <div class="ficha__datos">
            <div class="ficha__nombre">${esc(j.nombre)}</div>
            <div class="ficha__pos">${esc(j.posicion)}</div>
            <div class="ficha__club">${esc(j.club)}</div>
          </div>
        </article>`).join("")
    : `<div class="vacio">La convocatoria se publicará próximamente.</div>`;

  const staff = sel.staff.length
    ? sel.staff.map(m => `
        <div class="staff-item">
          <div class="staff-item__rol">${esc(m.rol)}</div>
          <div style="font-weight:700">${esc(m.nombre)}</div>
        </div>`).join("")
    : `<div class="vacio">El cuerpo técnico se publicará próximamente.</div>`;

  main.append(el(`
    <div class="seleccion-hero">
      <div class="contenedor anim-entrada">
        <img src="${sel.escudo ? esc(sel.escudo) : "img/marca/simbolo-amarillo.png"}" alt="">
        <h1>${esc(sel.categoria)} <span class="genero">${esc(sel.genero)}</span></h1>
      </div>
    </div>

    <section class="contenedor" aria-labelledby="t-cal">
      <p class="eyebrow">Calendario y directos</p>
      <h2 id="t-cal">Partidos</h2>
      <div style="display:grid;gap:var(--sp-3)">${calendario}</div>
    </section>

    <section class="contenedor" aria-labelledby="t-conv">
      <p class="eyebrow">La convocatoria</p>
      <h2 id="t-conv">Jugadores</h2>
      <div class="plantilla-grid">${plantilla}</div>
    </section>

    <section class="contenedor" aria-labelledby="t-staff">
      <p class="eyebrow">Banquillo</p>
      <h2 id="t-staff">Cuerpo técnico</h2>
      <div class="staff-lista">${staff}</div>
    </section>

    ${franjaPatrocinadores()}
  `));
}

/* --- Franja de patrocinadores (portada y selecciones) ---------------------- */

function franjaPatrocinadores() {
  if (!PATROCINADORES.length) {
    return `
      <section class="contenedor" aria-labelledby="t-patro">
        <p class="eyebrow">Nos apoyan</p>
        <h2 id="t-patro">Patrocinadores</h2>
        <a class="patro-placeholder" href="${esc(CONFIG.contactoPatrocinio)}" style="text-decoration:none">
          <strong>Súmate a la cobertura</strong>
          <span>Tu marca acompañando a las selecciones asturianas durante toda la semana del campeonato.</span>
        </a>
      </section>`;
  }
  const logos = PATROCINADORES.map(p => `
    <a href="${esc(p.url)}" rel="sponsored noopener" target="_blank" aria-label="${esc(p.nombre)}">
      <img src="${esc(p.logo)}" alt="${esc(p.nombre)}" loading="lazy">
    </a>`).join("");
  return `
    <section class="contenedor" aria-labelledby="t-patro">
      <p class="eyebrow">Nos apoyan</p>
      <h2 id="t-patro">Patrocinadores</h2>
      <div class="patro-grid">${logos}</div>
    </section>`;
}

/* --- Página de patrocinadores ---------------------------------------------- */

function renderPatrocinadores() {
  const main = $("main");
  const p = CONFIG.patrocinadorPrincipal;

  const principal = p.activo
    ? `<div class="patro-grid" style="grid-template-columns:1fr;max-width:420px">
         <a href="${esc(p.url)}" rel="sponsored noopener" target="_blank">
           <img src="${esc(p.logo)}" alt="${esc(p.nombre)}" style="max-height:90px">
         </a>
       </div>`
    : `<a class="patro-placeholder" href="${esc(CONFIG.contactoPatrocinio)}" style="text-decoration:none">
         <strong>Patrocinador principal — espacio disponible</strong>
         <span>Presencia en la cabecera de todas las páginas, junto al reproductor de cada
         directo y en el cierre de cada página. La máxima visibilidad de la cobertura.</span>
       </a>`;

  // Agrupa por nivel si los niveles están definidos; si no, rejilla homogénea
  const conNivel = PATROCINADORES.filter(x => x.nivel);
  let resto = "";
  if (PATROCINADORES.length) {
    if (conNivel.length) {
      const niveles = [...new Set(PATROCINADORES.map(x => x.nivel || "Colaboradores"))];
      resto = niveles.map(n => `
        <h2>${esc(n)}</h2>
        <div class="patro-grid">
          ${PATROCINADORES.filter(x => (x.nivel || "Colaboradores") === n).map(x => `
            <a href="${esc(x.url)}" rel="sponsored noopener" target="_blank" aria-label="${esc(x.nombre)}">
              <img src="${esc(x.logo)}" alt="${esc(x.nombre)}" loading="lazy">
            </a>`).join("")}
        </div>`).join("");
    } else {
      resto = `<h2>Colaboradores</h2><div class="patro-grid">
        ${PATROCINADORES.map(x => `
          <a href="${esc(x.url)}" rel="sponsored noopener" target="_blank" aria-label="${esc(x.nombre)}">
            <img src="${esc(x.logo)}" alt="${esc(x.nombre)}" loading="lazy">
          </a>`).join("")}
      </div>`;
    }
  }

  main.append(el(`
    <div class="seleccion-hero">
      <div class="contenedor anim-entrada">
        <h1>Patrocinadores</h1>
      </div>
    </div>
    <section class="contenedor">
      <p class="eyebrow">Principal</p>
      ${principal}
    </section>
    <section class="contenedor">
      ${resto || `<div class="vacio">Los patrocinadores de la cobertura aparecerán aquí.</div>`}
    </section>
  `));
}

/* --- Arranque --------------------------------------------------------------- */

renderCabecera();

const pagina = document.body.dataset.pagina;
if (pagina === "portada") renderPortada();
else if (pagina === "seleccion") renderSeleccion(document.body.dataset.seleccion);
else if (pagina === "patrocinadores") renderPatrocinadores();

renderPie();
