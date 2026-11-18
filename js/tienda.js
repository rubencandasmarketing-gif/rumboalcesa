/* =============================================================================
   TIENDA.JS — Asturias, rumbo al CESA
   Catálogo de la tienda FBMPA. Los pedidos se hacen por correo a la
   federación: cada prenda abre un correo ya rellenado con su nombre y precio.
   app.js lo importa solo en tienda.html.
   Nada que editar aquí: lo variable (precios, tallas, estados, correo) vive
   en tienda-datos.js.
   ============================================================================= */
import { TIENDA as CFG, CATALOGO } from './tienda-datos.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const eur = n => n.toFixed(2).replace('.', ',') + ' €';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lista = xs => xs.length > 1 ? xs.slice(0, -1).join(', ') + ' y ' + xs.at(-1) : xs.join('');

/* Disponibilidad, tal como la publica la federación en el boletín */
const ESTADOS = {
  'disponible':   { txt: 'Disponible',   cls: 't-tag--ok' },
  'bajo-pedido':  { txt: 'Bajo pedido',  cls: 't-tag--pedido' },
  'proximamente': { txt: 'Próximamente', cls: 't-tag--pronto' }
};
const pedible = p => p.estado !== 'proximamente' && p.precio != null;

/* Precios SIN IVA, como en el boletín («21,50 € + IVA») */
const IVA = 1 + CFG.iva / 100;
const sinIva = n => CFG.preciosConIva ? +(n / IVA).toFixed(2) : n;

/* Tallas de un producto normalizadas a [{n, p?}] */
function tallasDe(p) {
  const t = p.tallas;
  if (t === 'todas') return [...CFG.tallajes.nino, ...CFG.tallajes.adulto].map(n => ({ n }));
  if (typeof t === 'string') return CFG.tallajes[t].map(n => ({ n }));
  return t.map(x => typeof x === 'string' ? { n: x } : x);
}
function textoTallas(p) {
  if (p.tallas === 'todas') return 'Todas las tallas (niño/a y adulto)';
  const ts = tallasDe(p);
  if (ts.length === 1) return ts[0].n === 'Única' ? 'Talla única' : `Talla ${ts[0].n}`;
  return 'Tallas ' + lista(ts.map(t => t.p != null ? `${t.n} (${eur(sinIva(t.p))} + IVA)` : t.n));
}
function precioTexto(p) {
  const ps = [...new Set(tallasDe(p).map(t => sinIva(t.p != null ? t.p : p.precio)))].sort((a, b) => a - b);
  return (ps.length > 1 ? 'desde ' : '') + eur(ps[0]);
}

/* Correo ya rellenado para pedir una prenda (o vacío, para el botón general) */
function mailto(p) {
  const asunto = p ? `Pedido tienda FBMPA: ${p.nombre}` : 'Pedido tienda FBMPA';
  const lineas = ['Hola,', '', 'Quiero hacer este pedido:', ''];
  if (p) {
    lineas.push(`- ${p.nombre} (${precioTexto(p)} + IVA)`);
    if (tallasDe(p).length > 1) lineas.push('  Talla: ');
    if (p.colores && p.colores.length > 1) lineas.push(`  Color (${p.colores.join(' / ')}): `);
    lineas.push('  Cantidad: ');
  } else {
    lineas.push('- Prenda, talla y cantidad: ');
  }
  lineas.push('', 'Nombre y apellidos: ', 'Teléfono: ', '', 'Gracias.');
  return `mailto:${CFG.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(lineas.join('\n'))}`;
}

/* ---------- Catálogo ---------- */
function card(p) {
  const est = ESTADOS[p.estado];
  const ok = pedible(p);
  return `<article class="t-card${ok ? '' : ' t-card--pronto'}" id="c-${p.id}">
    <div class="t-card__fig">
      <img src="${esc(p.foto)}" alt="${esc(p.nombre)}" width="600" height="750" loading="lazy" decoding="async">
      ${est ? `<span class="t-tag ${est.cls}">${est.txt}</span>` : ''}
    </div>
    <div class="t-card__body">
      <div class="t-card__head">
        <h4>${esc(p.nombre)}</h4>
        ${p.colores ? `<p class="t-card__meta">${esc(lista(p.colores))}</p>` : ''}
      </div>
      <p class="t-card__desc">${esc(p.descripcion)}</p>
      ${ok ? `
      <div class="t-price">
        <span class="t-price__now">${precioTexto(p)}</span>
        <span class="t-price__iva">+ IVA</span>
      </div>
      <p class="t-card__tallas">${esc(textoTallas(p))}${p.guia ? ` · <a href="#" class="t-link" data-guia>Guía de tallas</a>` : ''}</p>
      <a class="btn btn--azul btn--bloque" href="${esc(mailto(p))}">Pedir por correo</a>`
      : `
      <div class="t-price"><span class="t-price__now">Próximamente</span></div>
      <span class="btn btn--bloque t-btn-off" aria-disabled="true">Aún no disponible</span>`}
    </div>
  </article>`;
}

/* ---------- Guía de tallas ---------- */
function openGuide() {
  $('#mBody').innerHTML = Object.entries(CFG.guiaTallas).map(([k, g]) => `<h4 class="t-modal__h">${CFG.nombreTallaje[k]}</h4>
    <table><tr>${g.cols.map(c => `<th>${c}</th>`).join('')}</tr>${g.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`).join('') +
    `<p class="t-note">Medidas orientativas. Se sustituirán por la tabla oficial del proveedor.</p>`;
  $('#modal').classList.add('is-on'); $('#mx').focus();
}
const closeGuide = () => $('#modal').classList.remove('is-on');

/* ---------- Marcado de la página ---------- */
function marcado() {
  const tel = CFG.telefono.replace(/\s/g, '');
  return `
  <div class="seleccion-hero tienda-hero">
    <div class="contenedor anim-entrada">
      <div class="tienda-hero__texto">
        <p class="eyebrow eyebrow--claro">Tienda oficial</p>
        <h1>Viste la <span class="genero">selección</span></h1>
        <p class="tienda-hero__lead">Equipación oficial de la Federación de Balonmano del Principado de Asturias. Pídela por correo y recógela en la Federación, en Gijón.</p>
      </div>
      <ol class="t-steps" aria-label="Cómo comprar">
        <li><div><b>Elige tu producto</b><span>Talla y cantidad.</span></div></li>
        <li><div><b>Haz tu pedido</b><span>Por correo a ${esc(CFG.email)}.</span></div></li>
        <li><div><b>Recoge en la Federación</b><span>${esc(CFG.sedeDetalle)}.</span></div></li>
      </ol>
    </div>
  </div>

  <div class="contenedor t-layout">
    <section class="t-pedido" aria-labelledby="t-pedido-h">
      <div class="t-pedido__texto">
        <h2 id="t-pedido-h">Todos los pedidos, por correo</h2>
        <p>Escribe a la Federación con la prenda, la talla y la cantidad, tu nombre y un teléfono. Pulsa <b>Pedir por correo</b> en cualquier prenda y el correo sale ya preparado.</p>
        <p class="t-pedido__nota">Recogida en la Federación, ${esc(CFG.sedeDetalle)}. Los artículos «bajo pedido» se encargan al reunir las reservas. Precios sin IVA; disponibilidad sujeta a existencias.</p>
      </div>
      <div class="t-pedido__acciones">
        <a class="btn" href="${esc(mailto())}">${esc(CFG.email)}</a>
        <a class="t-pedido__tel" href="tel:${esc(tel)}">Dudas: ${esc(CFG.telefono)}</a>
      </div>
    </section>
    <h2 class="visually-hidden">Catálogo</h2>
    <div class="t-grid">${CATALOGO.map(card).join('')}</div>
  </div>

  <div class="t-modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle"><div class="t-modal__box"><button type="button" class="t-modal__x" id="mx" aria-label="Cerrar">×</button><h3 id="mTitle">Guía de tallas</h3><div id="mBody"></div></div></div>`;
}

/* ---------- Punto de entrada: app.js lo llama en tienda.html ---------- */
export function renderTienda(main) {
  main.classList.add('tienda');
  main.innerHTML = marcado();
  // Foto que no carga: se oculta y la tarjeta enseña el marcador «Foto pendiente»
  $$('.t-card__fig img', main).forEach(img => {
    const pendiente = () => { img.style.display = 'none'; img.parentElement.classList.add('is-pendiente'); };
    img.addEventListener('error', pendiente);
    if (img.complete && !img.naturalWidth) pendiente();
  });
  $$('[data-guia]', main).forEach(a => a.addEventListener('click', e => { e.preventDefault(); openGuide(); }));
  $('#mx').onclick = closeGuide;
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeGuide(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGuide(); });
}
