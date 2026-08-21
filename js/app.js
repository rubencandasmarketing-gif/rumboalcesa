/* =============================================================================
   APP.JS — Asturias, rumbo al CESA
   Render de plantillas. Lee TODO de datos.js: este archivo no se toca durante
   el campeonato. Cada página declara qué es con <body data-pagina="...">
   (portada | seleccion | patrocinadores) y, si es selección,
   data-seleccion="juvenil-masculina".
   ============================================================================= */

import { CONFIG, SEDES, PATROCINADORES, SELECCIONES } from "./datos.js";

/* Modo estático: con ?static en la URL no se arranca ningún temporizador, para
   herramientas de revisión y captura que exigen la página en reposo. El render,
   los datos y los enlaces funcionan igual; solo se desactivan los relojes. */
const MODO_ESTATICO = new URLSearchParams(location.search).has("static");

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

/** Programado cuya hora ya pasó (ventana de 2h30). */
function enJuegoPorHorario(p) {
  if (p.estado !== "programado") return false;
  const inicio = new Date(`${p.fecha}T${p.hora}:00`);
  const ms = Date.now() - inicio.getTime();
  return ms >= 0 && ms <= 150 * 60000;
}

/** Emisión activa: directo manual, o programado con youtubeId cuya hora llegó.
    Como los directos se programan en YouTube con días de antelación, el
    reproductor se enciende solo a la hora del partido sin tocar datos.js.
    El estado "directo" queda como interruptor manual para forzarlo. */
function emisionActiva(p) {
  return p.estado === "directo" ||
    (p.estado === "programado" && p.youtubeId && enJuegoPorHorario(p));
}

/** ¿Hay algún partido que justifique estar pendiente? Uno en emisión, uno
    cuya hora ya entró, o uno con youtubeId que empieza dentro de 2 h. */
function hayAlgoQueVigilar() {
  const ahora = Date.now();
  const margen = 120 * 60000;
  return SELECCIONES.some(s => s.partidos.some(p => {
    if (emisionActiva(p) || enJuegoPorHorario(p)) return true;
    if (p.estado !== "programado" || !p.youtubeId) return false;
    const faltan = new Date(`${p.fecha}T${p.hora}:00`).getTime() - ahora;
    return faltan > 0 && faltan <= margen;
  }));
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
    : `<span class="patro-placeholder--franja">
         <b>Este espacio puede ser tuyo</b><span>· Patrocinador principal</span>
       </span>`;

  const enlaces = SELECCIONES.map(s =>
    `<li><a href="${s.id}.html">${esc(s.categoria)} ${s.genero === "Masculina" ? "M" : "F"}</a></li>`
  ).join("");

  document.body.prepend(el(`
    <div class="franja-principal"><div class="contenedor">${franja}</div></div>
    <header class="cabecera">
      <div class="contenedor">
        <a class="cabecera__marca" href="index.html" aria-label="${esc(CONFIG.nombreSitio)} — portada">
          <img src="img/marca/simbolo-amarillo.png" alt="FBMPA">
          <span class="cabecera__titulo">Rumbo al <b>CESA</b></span>
        </a>
        <nav class="nav" aria-label="Selecciones">
          <ul>
            <li><a href="index.html">Portada</a></li>
            ${SELECCIONES.some(s => s.partidos.some(p => emisionActiva(p)))
              ? `<li><a class="nav__directo" href="directo.html"><span class="punto" aria-hidden="true"></span>Directo</a></li>` : ""}
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

const ICONOS_REDES = {
  twitter: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.9.9h3.68l-8.04 9.19L24 22.6h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 .9h7.59l5.25 6.93L18.9.9Zm-1.29 19.5h2.04L6.49 2.99H4.3l13.31 17.41Z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.8 3.8 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.74 3.74 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.8.72 1.48 1.38 2.13a5.87 5.87 0 0 0 2.13 1.38c.77.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.3-.77.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.89 5.89 0 0 0-1.38-2.13A5.85 5.85 0 0 0 19.86.63c-.77-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.45 18.63.07 12 .07S0 5.45 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.52c-1.49 0-1.95.93-1.95 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.03 24 18.06 24 12.07z"/></svg>`
};
const NOMBRES_REDES = { twitter: "X (Twitter)", instagram: "Instagram", facebook: "Facebook" };

function redesHTML() {
  const redes = CONFIG.redes || {};
  const enlaces = ["twitter", "instagram", "facebook"]
    .filter(k => redes[k])
    .map(k => `<a class="pie__red" href="${esc(redes[k])}" rel="noopener" target="_blank" aria-label="FBMPA en ${NOMBRES_REDES[k]}">${ICONOS_REDES[k]}</a>`)
    .join("");
  return enlaces ? `<div class="pie__redes">${enlaces}</div>` : "";
}

function renderPie() {
  const p = CONFIG.patrocinadorPrincipal;
  const cierre = p.activo
    ? `<a href="${esc(p.url)}" rel="sponsored noopener" target="_blank">
         <img src="${esc(p.logo)}" alt="${esc(p.nombre)}" style="max-height:60px;width:auto">
       </a>`
    : `<div class="patro-placeholder">
         <strong>Este espacio puede ser tuyo</strong>
         <span>Patrocinador principal de la cobertura — presencia en todas las páginas y junto a cada directo.</span>
       </div>`;

  document.body.append(el(`
    <div class="patro-cierre">
      <div class="contenedor" style="display:grid;place-items:center">${cierre}</div>
    </div>
    <footer class="pie">
      <div class="contenedor">
        <a href="https://www.fbmpa.es" rel="noopener" target="_blank" aria-label="Federación de Balonmano del Principado de Asturias">
          <img src="img/marca/fbmpa-blanco.png" alt="FBMPA">
        </a>
        <p style="margin:0">
          Web de la Federación de Balonmano del Principado de Asturias dedicada al seguimiento del ${esc(CONFIG.edicion)}.<br>
          Web oficial de la federación: <a href="https://www.fbmpa.es" rel="noopener" target="_blank">fbmpa.es</a> · <a href="patrocinadores.html">Patrocinadores</a>
        </p>
        ${redesHTML()}
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

function tarjetaPartido(partido, sel, { conSeleccion = false, sinReproductor = false } = {}) {
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

  if (emisionActiva(partido)) {
    cabecera = partido.estado === "directo"
      ? `<span class="directo-badge"><span><span class="punto" aria-hidden="true"></span>En directo</span></span>`
      : `<span class="directo-badge"><span><span class="punto" aria-hidden="true"></span>En juego</span></span>`;
    cruce = `${asturias}<span class="vs">–</span>${rival}`;
    media = sinReproductor ? "" : reproductor(partido);
    if (sinReproductor) {
      acciones = `<a class="btn" href="directo.html">Ver el directo</a>`;
    }
    if (CONFIG.canalYoutube || partido.youtubeId) {
      const url = partido.youtubeId
        ? `https://www.youtube.com/watch?v=${encodeURIComponent(partido.youtubeId)}`
        : CONFIG.canalYoutube;
      acciones += `<a class="btn btn--ghost" href="${esc(url)}" rel="noopener" target="_blank">Ver en YouTube</a>`;
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
  } else { // programado, aún sin emisión
    if (enJuegoPorHorario(partido)) {
      // Hora cumplida pero sin youtubeId: aviso honesto sin reproductor
      cabecera = `<span class="badge-enjuego">En juego</span>`;
    }
    cruce = `${asturias}<span class="vs">vs</span>${rival}`;
    if (partido.youtubeId) {
      // El directo ya está programado en YouTube: enlace para activar recordatorio
      acciones = `<a class="btn btn--ghost" href="https://www.youtube.com/watch?v=${encodeURIComponent(partido.youtubeId)}" rel="noopener" target="_blank">Recordatorio en YouTube</a>`;
    }
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
         <span class="patro-placeholder--inline patro-placeholder">
           <strong>Tu marca junto a cada directo</strong>
         </span>
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

const FMT_DIA_CORTO = new Intl.DateTimeFormat("es-ES", {
  weekday: "short", day: "numeric", month: "short"
});
function diaCorto(iso) {
  return FMT_DIA_CORTO.format(new Date(iso + "T12:00:00")).replace(/\./g, "");
}

/* Fila compacta de la agenda: el estado decide la última columna */
function filaAgenda({ partido, sel }) {
  const sede = sedeDe(partido.sede);
  let estado;
  if (partido.estado === "finalizado") {
    estado = `<span class="marcador marcador--mini"><span>${partido.golesAsturias ?? "–"}</span><span>·</span><span>${partido.golesRival ?? "–"}</span></span>`;
  } else if (emisionActiva(partido)) {
    estado = `<span class="directo-badge directo-badge--mini"><span><span class="punto" aria-hidden="true"></span>Directo</span></span>`;
  } else if (enJuegoPorHorario(partido)) {
    estado = `<span class="badge-enjuego">En juego</span>`;
  } else {
    estado = sede ? `<span class="agenda-fila__sede">${esc(sede.municipio)}</span>` : "<span></span>";
  }
  return `
    <a class="agenda-fila ${emisionActiva(partido) ? "agenda-fila--directo" : ""}" href="${sel.id}.html">
      <span class="agenda-fila__hora">${esc(partido.hora)}</span>
      <span class="agenda-fila__sel">${esc(sel.categoria)} ${sel.genero === "Masculina" ? "M" : "F"}</span>
      <span class="agenda-fila__cruce">Asturias <span class="vs">–</span> ${esc(partido.rival)}</span>
      ${estado}
    </a>`;
}

let AGENDA = new Map();

function renderAgendaDia(fecha) {
  const cont = document.querySelector("#agenda-cuerpo");
  if (!cont) return;
  const filas = (AGENDA.get(fecha) || []).map(filaAgenda).join("");
  cont.innerHTML = filas || `<div class="vacio">Sin partidos este día.</div>`;
  document.querySelectorAll(".agenda-dia").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.fecha === fecha)));
}

document.addEventListener("click", e => {
  const b = e.target.closest(".agenda-dia");
  if (b) renderAgendaDia(b.dataset.fecha);
});

function renderPortada() {
  const main = $("main");
  const hoy = hoyISO();
  const todos = todosLosPartidos();

  // --- En emisión: directos manuales + programados cuya hora llegó con enlace ---
  const enDirecto = todos.filter(t => emisionActiva(t.partido));
  const directoHTML = enDirecto.length ? `
    <section class="contenedor solapa" aria-labelledby="t-dir">
      <p class="eyebrow" id="t-dir">Ahora mismo</p>
      <div class="hoy-juegan__lista">
        ${enDirecto.map(({ partido, sel }) => tarjetaPartido(partido, sel, { conSeleccion: true, sinReproductor: true })).join("")}
      </div>
    </section>` : "";

  // --- Agenda: todos los partidos agrupados por día ---
  AGENDA = new Map();
  [...todos]
    .sort((a, b) => (a.partido.fecha + a.partido.hora).localeCompare(b.partido.fecha + b.partido.hora))
    .forEach(t => {
      if (!AGENDA.has(t.partido.fecha)) AGENDA.set(t.partido.fecha, []);
      AGENDA.get(t.partido.fecha).push(t);
    });
  const fechas = [...AGENDA.keys()];

  // Día inicial: el del directo > hoy > el próximo con partidos > el último jugado
  let fechaInicial = null;
  if (enDirecto.length) fechaInicial = enDirecto[0].partido.fecha;
  else if (AGENDA.has(hoy)) fechaInicial = hoy;
  else fechaInicial = fechas.find(f => f >= hoy) ?? fechas[fechas.length - 1] ?? null;

  const agendaHTML = `
    <section class="contenedor" aria-labelledby="t-agenda">
      <p class="eyebrow">Día a día</p>
      <h2 id="t-agenda">Agenda del campeonato</h2>
      ${fechas.length ? `
        <div class="agenda-dias" role="group" aria-label="Elegir día">
          ${fechas.map(f => `<button class="agenda-dia" type="button" data-fecha="${f}" aria-pressed="false">${diaCorto(f)}</button>`).join("")}
        </div>
        <div class="agenda-lista" id="agenda-cuerpo"></div>`
      : `<div class="vacio">El calendario se publicará próximamente.</div>`}
    </section>`;

  // --- Franja de selecciones ---
  const cintas = SELECCIONES.map(s => `
    <a class="cinta-sel" href="${s.id}.html">
      <span class="cinta-sel__cat">${esc(s.categoria)}</span>
      <span class="cinta-sel__gen">${esc(s.genero)}</span>
    </a>`).join("");

  main.append(el(`
    <div class="heroe">
      <div class="contenedor">
        <div class="heroe__texto anim-entrada">
          <h1>Asturias,<br>rumbo al <span>CESA</span></h1>
          <p>Toda la cobertura de las selecciones asturianas en el Campeonato de España: convocatorias, calendario, resultados y directos.</p>
        </div>
      </div>
    </div>

    ${directoHTML}

    <section class="${enDirecto.length ? "" : "solapa"}" aria-labelledby="t-sel">
      <div class="contenedor">
        <p class="eyebrow">Las seis selecciones</p>
        <h2 id="t-sel">Nuestros equipos</h2>
      </div>
      <div class="cintas-selecciones">${cintas}</div>
    </section>

    ${agendaHTML}

    ${franjaPatrocinadores()}
  `));

  if (fechaInicial) renderAgendaDia(fechaInicial);
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

  // Convocatoria: siempre 16 huecos. Los cubiertos, con ficha; el resto, en espera.
  const PLAZAS = 16;
  const convocados = [...sel.plantilla].sort((a, b) => (a.dorsal ?? 99) - (b.dorsal ?? 99));
  const huecos = Math.max(0, PLAZAS - convocados.length);

  const plantilla = convocados.map(j => `
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
    + Array.from({ length: huecos }, () => `
      <article class="ficha ficha--vacia" aria-label="Plaza pendiente de convocatoria">
        <div class="ficha__foto"></div>
        <div class="ficha__datos">
          <div class="ficha__nombre">Por convocar</div>
        </div>
      </article>`).join("");

  // Cuerpo técnico: tres cargos fijos (Seleccionador/a, Entrenador/a, Delegado/a).
  // Se cubren buscando el rol en datos.js; el resto de roles (fisio, etc.) se añade detrás.
  const norm = s => String(s ?? "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cargoDe = m => {
    const r = norm(m.rol);
    if (r.startsWith("seleccionador")) return "seleccionador";
    if (r.startsWith("delegad")) return "delegado";
    if (r.startsWith("entrenador") && !r.includes("segund")) return "entrenador";
    return null;
  };
  const CARGOS = [
    { clave: "seleccionador", etiqueta: "Seleccionador/a" },
    { clave: "entrenador",    etiqueta: "Entrenador/a" },
    { clave: "delegado",      etiqueta: "Delegado/a" }
  ];
  const asignados = new Set();
  const tarjetaStaff = m => `
      <div class="staff-item">
        ${m.foto ? `<img class="staff-item__foto" src="${esc(m.foto)}" alt="" loading="lazy">` : ""}
        <div>
          <div class="staff-item__rol">${esc(m.rol)}</div>
          <div style="font-weight:700">${esc(m.nombre)}</div>
        </div>
      </div>`;

  const fijos = CARGOS.map(c => {
    const m = sel.staff.find(x => cargoDe(x) === c.clave && !asignados.has(x));
    if (m) { asignados.add(m); return tarjetaStaff(m); }
    return `
      <div class="staff-item staff-item--vacio">
        <div class="staff-item__foto staff-item__foto--hueco" aria-hidden="true"></div>
        <div>
          <div class="staff-item__rol">${c.etiqueta}</div>
          <div style="font-weight:700;color:var(--muted)">Por confirmar</div>
        </div>
      </div>`;
  }).join("");

  const extra = sel.staff.filter(m => !asignados.has(m)).map(tarjetaStaff).join("");
  const staff = fijos + extra;

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

/* --- Sala del directo -------------------------------------------------------
   Página propia (directo.html): reproductor grande + banners del patrocinador
   principal arriba y abajo. Si hay varios partidos en emisión, chips para
   cambiar. Sin emisión, muestra los partidos del día.
---------------------------------------------------------------------------- */

function bannerPatrocinador() {
  const p = CONFIG.patrocinadorPrincipal;
  if (p.activo) {
    const creatividad = p.banner || p.logo;
    return `
    <a class="banner-patro" href="${esc(p.url)}" rel="sponsored noopener" target="_blank">
      <img src="${esc(creatividad)}" alt="${esc(p.nombre)}">
    </a>`;
  }
  return `
    <div class="banner-patro banner-patro--hueco">
      <strong>Tu marca aquí</strong>
      <span>Banner del patrocinador principal durante cada directo</span>
    </div>`;
}

let SALA_ACTIVOS = [];
let salaIds = null;

function pintarPartidoSala(id) {
  const t = SALA_ACTIVOS.find(x => x.partido.id === id) || SALA_ACTIVOS[0];
  const caja = document.querySelector("#sala-partido");
  if (!caja || !t) return;
  caja.innerHTML = tarjetaPartido(t.partido, t.sel, { conSeleccion: true });
  document.querySelectorAll(".sala-chip").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.id === t.partido.id)));
}

document.addEventListener("click", e => {
  const b = e.target.closest(".sala-chip");
  if (b) pintarPartidoSala(b.dataset.id);
});

function renderSalaDirecto() {
  const main = $("main");
  const todos = todosLosPartidos();
  SALA_ACTIVOS = todos
    .filter(t => emisionActiva(t.partido))
    .sort((a, b) => (b.partido.estado === "directo") - (a.partido.estado === "directo"));

  document.title = `En directo — ${CONFIG.nombreSitio}`;

  const hoy = hoyISO();
  const restoHoy = todos
    .filter(t => t.partido.fecha === hoy && !emisionActiva(t.partido))
    .sort((a, b) => a.partido.hora.localeCompare(b.partido.hora));

  const chips = SALA_ACTIVOS.length > 1 ? `
    <div class="agenda-dias" role="group" aria-label="Elegir partido">
      ${SALA_ACTIVOS.map(t => `<button class="agenda-dia sala-chip" type="button" data-id="${esc(t.partido.id)}" aria-pressed="false">${esc(t.sel.categoria)} ${t.sel.genero === "Masculina" ? "M" : "F"}</button>`).join("")}
    </div>` : "";

  const cuerpo = SALA_ACTIVOS.length ? `
      ${bannerPatrocinador()}
      ${chips}
      <div id="sala-partido"></div>
      ${bannerPatrocinador()}`
    : `
      <div class="vacio">Ahora mismo no hay ningún partido en emisión.<br>
      En cuanto empiece uno, se verá aquí.</div>`;

  main.append(el(`
    <div class="seleccion-hero">
      <div class="contenedor anim-entrada">
        <h1>${SALA_ACTIVOS.length ? `<span class="genero">En directo</span>` : "Directos"}</h1>
      </div>
    </div>
    <section class="contenedor sala">${cuerpo}</section>
    ${restoHoy.length ? `
    <section class="contenedor" aria-labelledby="t-mas">
      <p class="eyebrow">Hoy también</p>
      <h2 id="t-mas">Más partidos del día</h2>
      <div class="agenda-lista">${restoHoy.map(filaAgenda).join("")}</div>
    </section>` : ""}
    ${franjaPatrocinadores()}
  `));

  if (SALA_ACTIVOS.length) pintarPartidoSala(SALA_ACTIVOS[0].partido.id);
  salaIds = SALA_ACTIVOS.map(t => t.partido.id).join(",");
}

/* --- Franja de patrocinadores (portada y selecciones) ---------------------- */

/* Celda de patrocinador habitual: con logo → enlace a su web; vacía → reservada */
function huecoPatrocinador(p) {
  if (p && p.logo) {
    return `
    <a href="${esc(p.url)}" rel="sponsored noopener" target="_blank" aria-label="${esc(p.nombre)}">
      <img src="${esc(p.logo)}" alt="${esc(p.nombre)}" loading="lazy">
    </a>`;
  }
  return `<div class="patro-hueco" aria-hidden="true"></div>`;
}

function franjaPatrocinadores() {
  const celdas = Array.from({ length: 6 }, (_, i) => huecoPatrocinador(PATROCINADORES[i])).join("");
  return `
    <section class="contenedor" aria-labelledby="t-patro">
      <p class="eyebrow">Nos apoyan</p>
      <h2 id="t-patro">Patrocinadores</h2>
      <div class="patro-grid patro-grid--seis">${celdas}</div>
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
    : `<div class="patro-placeholder">
         <strong>Patrocinador principal — espacio disponible</strong>
         <span>Presencia en la cabecera de todas las páginas, junto al reproductor de cada
         directo y en el cierre de cada página. La máxima visibilidad de la cobertura.</span>
       </div>`;

  // Los 6 patrocinadores habituales de la federación
  const celdas = Array.from({ length: 6 }, (_, i) => huecoPatrocinador(PATROCINADORES[i])).join("");
  const resto = `
    <h2>Patrocinadores de la federación</h2>
    <div class="patro-grid patro-grid--seis">${celdas}</div>`;

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
      ${resto}
    </section>
  `));
}

/* --- Actualización automática ----------------------------------------------
   Mientras hay partidos que vigilar se comprueba cada 60 s (solo con la
   pestaña visible) si datos.js cambió en el servidor. Si cambió y no hay
   ningún directo reproduciéndose, la página se recarga sola; si hay un
   reproductor abierto, no se corta la emisión: aparece un aviso para
   actualizar cuando el espectador quiera.

   Fuera de campeonato no se sondea: el temporizador pasa a mirar el reloj
   cada 5 min, solo para detectar cuándo entra el siguiente partido.
---------------------------------------------------------------------------- */

let ultimaVersionDatos = null;

async function comprobarNovedades() {
  try {
    const r = await fetch("js/datos.js?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) return;
    const txt = await r.text();
    if (ultimaVersionDatos === null) { ultimaVersionDatos = txt; return; }
    if (txt === ultimaVersionDatos) return;
    ultimaVersionDatos = txt;
    if (document.querySelector(".reproductor iframe")) {
      mostrarAvisoNovedades();
    } else {
      location.reload();
    }
  } catch { /* sin red o vista local: se reintenta en el siguiente ciclo */ }
}

function mostrarAvisoNovedades() {
  if (document.querySelector(".aviso-novedades")) return;
  const b = document.createElement("button");
  b.type = "button";
  b.className = "aviso-novedades";
  b.textContent = "Hay novedades — toca para actualizar";
  b.addEventListener("click", () => location.reload());
  document.body.append(b);
}

const MS_VIGILANDO = 60000;      // con partidos en juego: sondeo cada minuto
const MS_EN_ESPERA = 5 * 60000;  // sin nada que vigilar: solo se mira el reloj

let temporizadorSondeo = null;
let vigilando = null;

/** Ajusta el ritmo al estado del campeonato. Solo toca el temporizador
    cuando el estado cambia, así nunca se acumulan dos a la vez. */
function ajustarSondeo() {
  if (MODO_ESTATICO) return;
  const toca = hayAlgoQueVigilar();
  if (toca === vigilando) return;
  vigilando = toca;
  clearInterval(temporizadorSondeo);
  temporizadorSondeo = toca
    ? setInterval(cicloVigilando, MS_VIGILANDO)
    : setInterval(cicloEnEspera, MS_EN_ESPERA);
}

function cicloVigilando() {
  if (document.hidden) return;
  comprobarNovedades();
  ajustarSondeo();
}

function cicloEnEspera() {
  if (document.hidden) return;
  ajustarSondeo();
}

/* Congelado absoluto: con ?static no se registra el listener ni se hace la
   petición de arranque, así la página no toca la red tras pintarse. */
if (!MODO_ESTATICO) {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    comprobarNovedades();
    ajustarSondeo();
  });
  comprobarNovedades();
  ajustarSondeo();
}

/* La sala del directo vigila el reloj: si un partido entra o sale de emisión,
   se refresca sola — salvo que haya un reproductor abierto (entonces, aviso). */
if (!MODO_ESTATICO) setInterval(() => {
  if (document.body.dataset.pagina !== "directo" || document.hidden) return;
  const ids = SELECCIONES.flatMap(s => s.partidos).filter(p => emisionActiva(p)).map(p => p.id).join(",");
  if (salaIds !== null && ids !== salaIds) {
    salaIds = ids;
    if (document.querySelector(".reproductor iframe")) mostrarAvisoNovedades();
    else location.reload();
  }
}, 60000);

/* Los chips "En juego" dependen del reloj: se refrescan solos cada minuto
   re-renderizando la agenda visible (sin tocar reproductores). */
if (!MODO_ESTATICO) setInterval(() => {
  const activo = document.querySelector('.agenda-dia[aria-pressed="true"]');
  if (activo && !document.hidden) renderAgendaDia(activo.dataset.fecha);
}, 60000);

/* --- Arranque --------------------------------------------------------------- */

renderCabecera();

const pagina = document.body.dataset.pagina;
if (pagina === "portada") renderPortada();
else if (pagina === "seleccion") renderSeleccion(document.body.dataset.seleccion);
else if (pagina === "directo") renderSalaDirecto();
else if (pagina === "patrocinadores") renderPatrocinadores();

renderPie();
