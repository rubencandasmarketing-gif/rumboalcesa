/* =============================================================================
   TIENDA.JS — Asturias, rumbo al CESA
   Catálogo de la tienda FBMPA, tal como lo publica el boletín. Los pedidos se
   hacen por correo a la federación: cada prenda abre un correo ya rellenado
   con su nombre y precio. app.js lo importa solo en tienda.html.
   Nada que editar aquí: lo variable (catálogo, precios, correo) vive en
   tienda-datos.js.
   ============================================================================= */
import { TIENDA as CFG, CATALOGO } from './tienda-datos.js';

const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const eur = n => n.toFixed(2).replace('.', ',') + ' €';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Disponibilidad, tal como la publica la federación en el boletín */
const ESTADOS = {
  'disponible':   { txt: 'Disponible',   cls: 't-tag--ok' },
  'bajo-pedido':  { txt: 'Bajo pedido',  cls: 't-tag--pedido' },
  'proximamente': { txt: 'Próximamente', cls: 't-tag--pronto' }
};
const pedible = p => p.estado !== 'proximamente' && p.precio != null;

/* Correo ya rellenado para pedir una prenda (o vacío, para el botón general) */
function mailto(p) {
  const asunto = p ? `Pedido tienda FBMPA: ${p.nombre}` : 'Pedido tienda FBMPA';
  const lineas = ['Hola,', '', 'Quiero hacer este pedido:', ''];
  if (p) {
    lineas.push(`- ${p.nombre} (${eur(p.precio)} + IVA)`);
    if (p.talla) lineas.push('  Talla: ');
    lineas.push('  Cantidad: ');
  } else {
    lineas.push('- Producto, talla y cantidad: ');
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
        <h3>${esc(p.nombre)}</h3>
      </div>
      <p class="t-card__desc">${esc(p.detalle)}</p>
      ${ok ? `
      <div class="t-price">
        <span class="t-price__now">${eur(p.precio)}</span>
        <span class="t-price__iva">+ IVA</span>
      </div>
      <a class="btn btn--azul btn--bloque" href="${esc(mailto(p))}">Pedir por correo</a>`
      : `
      <div class="t-price"><span class="t-price__now">Próximamente</span></div>
      <span class="btn btn--bloque t-btn-off" aria-disabled="true">Aún no disponible</span>`}
    </div>
  </article>`;
}

/* ---------- Marcado de la página ---------- */
function marcado() {
  const tel = CFG.telefono.replace(/\s/g, '');
  return `
  <div class="seleccion-hero tienda-hero">
    <div class="contenedor anim-entrada">
      <div class="tienda-hero__texto">
        <p class="eyebrow eyebrow--claro">Tienda FBMPA</p>
        <h1>Viste los colores de <span class="genero">Asturias</span></h1>
        <p class="tienda-hero__lead">Equipación oficial de la Federación de Balonmano del Principado de Asturias.</p>
      </div>
      <ol class="t-steps" aria-label="¿Cómo comprar?">
        <li><div><b>Elige tu producto</b><span>Talla y cantidad.</span></div></li>
        <li><div><b>Haz tu pedido</b><span>${esc(CFG.email)} · ${esc(CFG.telefono)}</span></div></li>
        <li><div><b>Recoge en la Federación</b><span>${esc(CFG.sedeDetalle)}</span></div></li>
      </ol>
    </div>
  </div>

  <div class="contenedor t-layout">
    <section class="t-pedido" aria-labelledby="t-pedido-h">
      <div class="t-pedido__texto">
        <h2 id="t-pedido-h">¿Cómo comprar?</h2>
        <p>Elige tu producto, haz tu pedido a la Federación y recógelo en ${esc(CFG.sedeDetalle)}. Pulsa <b>Pedir por correo</b> en cualquier producto y el correo sale ya preparado.</p>
        <p class="t-pedido__nota">Los artículos «bajo pedido» se encargan al reunir las reservas. Precios sin IVA. Disponibilidad sujeta a existencias.</p>
      </div>
      <div class="t-pedido__acciones">
        <a class="btn" href="${esc(mailto())}">${esc(CFG.email)}</a>
        <a class="t-pedido__tel" href="tel:${esc(tel)}">${esc(CFG.telefono)}</a>
      </div>
    </section>
    <h2 class="visually-hidden">Catálogo</h2>
    <div class="t-grid">${CATALOGO.map(card).join('')}</div>
  </div>`;
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
}
