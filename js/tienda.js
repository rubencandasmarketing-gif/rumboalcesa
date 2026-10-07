/* =============================================================================
   TIENDA.JS — Asturias, rumbo al CESA
   Catálogo, pedido y hoja de pedido. app.js lo importa solo en tienda.html.
   Nada que editar aquí: lo variable (precios, tallas, IBAN, endpoint) vive
   en tienda-datos.js.
   ============================================================================= */
import { TIENDA as CFG, CATALOGO } from './tienda-datos.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const eur = n => n.toFixed(2).replace('.', ',') + ' €';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const byId = id => CATALOGO.find(p => p.id === id);
const IVA = 1 + CFG.iva / 100;
const conIva = n => CFG.preciosConIva ? n : +(n * IVA).toFixed(2);

/* Tallas de un producto normalizadas a [{n, p?, g?}] */
function tallasDe(p) {
  const t = p.tallas;
  if (t === 'todas') return [...CFG.tallajes.nino.map(n => ({ n, g: CFG.nombreTallaje.nino })), ...CFG.tallajes.adulto.map(n => ({ n, g: CFG.nombreTallaje.adulto }))];
  if (typeof t === 'string') return CFG.tallajes[t].map(n => ({ n }));
  return t.map(x => typeof x === 'string' ? { n: x } : x);
}
/* Precio con IVA de un producto para una talla */
function precioDe(p, sz) {
  const t = tallasDe(p).find(x => x.n === sz);
  return conIva(t && t.p != null ? t.p : p.precio);
}
function rangoPrecio(p) {
  const ps = [...new Set(tallasDe(p).map(t => conIva(t.p != null ? t.p : p.precio)))].sort((a, b) => a - b);
  return ps.length > 1 ? `desde ${eur(ps[0])}` : eur(ps[0]);
}

let cart = store.get('fbmpa.tienda.cart', []);
let form = store.get('fbmpa.tienda.form', {});
let lastOrder = null;
const sel = {}; // estado por tarjeta

/* ---------- Lote mensual ---------- */
const nextLote = (d = new Date()) => new Date(d.getFullYear(), d.getMonth() + (d.getDate() >= CFG.corte ? 1 : 0), CFG.corte);
const fmtDate = d => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---------- Catálogo ---------- */
function renderCatalog() {
  const grupos = [...new Set(CATALOGO.map(p => p.grupo))];
  $('#catalogo').innerHTML = grupos.map((g, i) => `
    <section class="t-grupo" aria-labelledby="g${i}">
      <h3 id="g${i}" class="t-grupo__h">${esc(g)}<span class="t-grupo__n">${CATALOGO.filter(p => p.grupo === g).length} artículos</span></h3>
      <div class="t-grid">${CATALOGO.filter(p => p.grupo === g).map(card).join('')}</div>
    </section>`).join('');
  bindCards($('#catalogo'));
  $('#nav-grupos') && ($('#nav-grupos').innerHTML = grupos.map((g, i) => `<a href="#g${i}">${esc(g)}</a>`).join(''));
}

function card(p) {
  const tallas = tallasDe(p);
  const s = sel[p.id] || (sel[p.id] = { sz: tallas.length === 1 ? tallas[0].n : '', color: p.colores ? p.colores[0] : '', q: 1, nombre: '', dorsal: '', perso: false });
  const perso = CFG.personalizacion.activa && p.personalizable;
  const precio = s.sz ? eur(precioDe(p, s.sz)) : rangoPrecio(p);
  const grupos = [...new Set(tallas.map(t => t.g).filter(Boolean))];
  const opt = t => `<option value="${esc(t.n)}" ${s.sz === t.n ? 'selected' : ''}>${esc(t.n)}${t.p != null ? ` · ${eur(conIva(t.p))}` : ''}</option>`;
  const opciones = grupos.length
    ? grupos.map(g => `<optgroup label="${esc(g)}">${tallas.filter(t => t.g === g).map(opt).join('')}</optgroup>`).join('')
    : tallas.map(opt).join('');
  return `<article class="t-card${p.destacado ? ' is-destacado' : ''}" id="c-${p.id}">
    <div class="t-card__fig">
      <img src="${p.foto}" alt="${esc(p.nombre)}" width="600" height="750" loading="lazy" decoding="async">
      ${p.etiqueta ? `<span class="t-tag">${esc(p.etiqueta)}</span>` : ''}
    </div>
    <div class="t-card__body">
      <div class="t-card__head">
        <h4>${esc(p.nombre)}</h4>
        ${p.colores && p.colores.length === 1 ? `<p class="t-card__meta">${esc(p.colores[0])}</p>` : ''}
      </div>
      <p class="t-card__desc">${esc(p.descripcion)}</p>
      <div class="t-price">
        <span class="t-price__now" id="pr-${p.id}">${precio}</span>
        <span class="t-price__iva">IVA incluido</span>
      </div>
      ${p.colores && p.colores.length > 1 ? `
      <div class="t-chips" role="radiogroup" aria-label="Color">
        ${p.colores.map(c => `<button type="button" role="radio" aria-checked="${s.color === c}" data-act="color" data-c="${esc(c)}" data-id="${p.id}">${esc(c)}</button>`).join('')}
      </div>` : ''}
      <div class="t-row${tallas.length === 1 ? ' t-row--solo' : ''}">
        ${tallas.length > 1 ? `
        <div class="t-field">
          <label for="sz-${p.id}">${esc(p.etiquetaTalla || 'Talla')}</label>
          <select id="sz-${p.id}" data-sz="${p.id}"><option value="">Elige</option>${opciones}</select>
        </div>` : ''}
        <div class="t-qty" aria-label="Cantidad">
          <button type="button" data-act="dec" data-id="${p.id}" aria-label="Menos">−</button>
          <output id="q-${p.id}">${s.q}</output>
          <button type="button" data-act="inc" data-id="${p.id}" aria-label="Más">+</button>
        </div>
      </div>
      ${p.guia ? `<a href="#" class="t-link" data-act="guide" data-id="${p.id}">Guía de tallas</a>` : ''}
      ${perso ? `
      <details class="t-perso" ${s.perso ? 'open' : ''}>
        <summary>Nombre y dorsal <span>+${eur(CFG.personalizacion.precio)}</span></summary>
        <div class="t-perso__fields">
          <div class="t-field"><label for="nm-${p.id}">Nombre</label><input id="nm-${p.id}" type="text" maxlength="${CFG.personalizacion.maxNombre}" value="${esc(s.nombre)}" data-perso="nombre" data-id="${p.id}" autocapitalize="characters" placeholder="GARCÍA"></div>
          <div class="t-field"><label for="dr-${p.id}">Dorsal</label><input id="dr-${p.id}" type="text" inputmode="numeric" maxlength="2" value="${esc(s.dorsal)}" data-perso="dorsal" data-id="${p.id}" placeholder="7"></div>
        </div>
      </details>` : ''}
      <button type="button" class="btn btn--azul btn--bloque" data-act="add" data-id="${p.id}">Añadir al pedido</button>
    </div>
  </article>`;
}

function bindCards(root) {
  $$('[data-act]', root).forEach(el => el.addEventListener('click', onCardAction));
  $$('select[data-sz]', root).forEach(s => s.addEventListener('change', () => {
    const id = s.dataset.sz, p = byId(id); sel[id].sz = s.value;
    s.closest('.t-row').classList.remove('is-bad');
    $('#pr-' + id).textContent = s.value ? eur(precioDe(p, s.value)) : rangoPrecio(p);
  }));
  $$('[data-perso]', root).forEach(i => i.addEventListener('input', () => { sel[i.dataset.id][i.dataset.perso] = i.value.trim(); }));
  $$('.t-perso', root).forEach(d => d.addEventListener('toggle', () => { sel[d.closest('.t-card').id.slice(2)].perso = d.open; }));
}

function onCardAction(e) {
  const el = e.currentTarget, id = el.dataset.id, s = sel[id], p = byId(id);
  switch (el.dataset.act) {
    case 'guide': e.preventDefault(); openGuide(); break;
    case 'color': s.color = el.dataset.c; $$('[data-act="color"]', el.parentElement).forEach(b => b.setAttribute('aria-checked', b === el)); break;
    case 'inc': s.q = Math.min(10, s.q + 1); $('#q-' + id).value = s.q; break;
    case 'dec': s.q = Math.max(1, s.q - 1); $('#q-' + id).value = s.q; break;
    case 'add': add(p, s); break;
  }
}

function add(p, s) {
  const szEl = $('#sz-' + p.id);
  if (szEl && !szEl.value) { szEl.focus(); szEl.closest('.t-row').classList.add('is-bad'); toast('Elige una ' + (p.etiquetaTalla || 'talla').toLowerCase()); return; }
  const perso = CFG.personalizacion.activa && p.personalizable && s.perso && (s.nombre || s.dorsal);
  const nombre = perso ? s.nombre.toUpperCase() : '', dorsal = perso ? s.dorsal : '';
  const key = [p.id, s.sz, s.color, nombre, dorsal].join('|');
  const ex = cart.find(l => l.key === key);
  if (ex) ex.q = Math.min(10, ex.q + s.q);
  else cart.push({ key, pid: p.id, sz: s.sz, color: s.color, q: s.q, nombre, dorsal });
  s.q = 1; $('#q-' + p.id).value = 1;
  save(); renderCart(); toast('Añadido al pedido');
  $('#pedido').classList.add('is-bump'); setTimeout(() => $('#pedido').classList.remove('is-bump'), 500);
}

/* ---------- Pedido ---------- */
const linePrice = l => precioDe(byId(l.pid), l.sz) + ((l.nombre || l.dorsal) ? conIva(CFG.personalizacion.precio) : 0);
function totals() {
  const total = cart.reduce((a, l) => a + linePrice(l) * l.q, 0);
  const base = total / IVA;
  return { total, base, iva: total - base };
}
const lineMeta = l => [l.color, l.sz !== 'Única' ? l.sz : '', [l.nombre, l.dorsal].filter(Boolean).join(' ')].filter(Boolean).join(' · ');
function renderCart() {
  const n = cart.reduce((a, l) => a + l.q, 0), t = totals();
  $('#count').textContent = n; $('#mcount').textContent = n; $('#mtot').textContent = eur(t.total);
  $('#lines').innerHTML = cart.length ? cart.map(l => { const p = byId(l.pid); return `
    <div class="t-line">
      <img class="t-line__th" src="${p.foto}" alt="" width="44" height="55">
      <div>
        <div class="t-line__nm">${esc(p.nombre)}</div>
        <div class="t-line__mt">${esc(lineMeta(l))}${lineMeta(l) ? ' · ' : ''}${l.q} ud.</div>
      </div>
      <div class="t-line__r"><b>${eur(linePrice(l) * l.q)}</b><button type="button" class="t-line__rm" data-k="${esc(l.key)}">Quitar</button></div>
    </div>`; }).join('')
    : `<p class="t-empty"><b>Tu pedido está vacío</b>Añade artículos desde el catálogo. Lo que elijas se guarda en este navegador.</p>`;
  $$('#lines .t-line__rm').forEach(b => b.onclick = () => { cart = cart.filter(l => l.key !== b.dataset.k); save(); renderCart(); lastOrder = null; $('#done').hidden = true; });
  $('#totals').innerHTML = cart.length ? `<dl class="t-tot">
    <dt>Base imponible</dt><dd>${eur(t.base)}</dd>
    <dt>IVA ${CFG.iva} %</dt><dd>${eur(t.iva)}</dd>
    <dt class="t-tot__t">Total a ingresar</dt><dd class="t-tot__t"><b>${eur(t.total)}</b></dd></dl>` : '';
}

function renderInstr() {
  $('#instr').innerHTML = `
    <h4>Cómo se completa el pedido</h4>
    <ol>
      <li>Envía el pedido desde esta página. Recibirás un resumen con tu número de pedido.</li>
      <li>Haz la transferencia del total a la cuenta de la FBMPA indicando tu nombre y el número de pedido.</li>
      <li>El día ${CFG.corte} de cada mes se cierra el lote y se pide al proveedor todo lo pagado hasta esa fecha.</li>
      <li>Plazo: ${esc(CFG.plazo)} desde el cierre. Recogida en la ${esc(CFG.sede)} (${esc(CFG.sedeDetalle)}).</li>
    </ol>
    <p class="t-lote">Si envías hoy el pedido, entra en el lote del <b>${fmtDate(nextLote())}</b>.</p>
    <div class="t-iban"><span>${esc(CFG.iban)}</span><button type="button" id="copyIban">Copiar</button></div>`;
  $('#copyIban').onclick = async () => { try { await navigator.clipboard.writeText(CFG.iban.replace(/\s/g, '')); toast('IBAN copiado'); } catch { toast('No se pudo copiar'); } };
}

/* ---------- Formulario ---------- */
const F = { name: '#fName', role: '#fRole', mail: '#fMail', tel: '#fTel', obs: '#fObs' };
function readForm() { form = {}; for (const k in F) form[k] = $(F[k]).value.trim(); store.set('fbmpa.tienda.form', form); }
function fillForm() {
  $('#fRole').innerHTML = '<option value="">Selecciona</option>' + CFG.roles.map(r => `<option>${esc(r)}</option>`).join('');
  for (const k in F) if (form[k]) $(F[k]).value = form[k];
}
function validate() {
  readForm();
  const bad = { name: !form.name, role: !form.role, mail: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail), tel: form.tel.replace(/\D/g, '').length < 9 };
  $$('.t-field[data-f]').forEach(f => f.classList.toggle('is-bad', !!bad[f.dataset.f]));
  if ($('#fWeb').value) return 'No se pudo enviar.';
  if (!cart.length) return 'Tu pedido está vacío.';
  if (Object.values(bad).some(Boolean)) return 'Revisa los campos marcados.';
  return '';
}

/* ---------- Construcción y envío ---------- */
const makeId = d => 'FBMPA-' + d.getFullYear().toString().slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
function buildOrder() {
  const d = new Date(), t = totals(), lote = nextLote(d);
  const lines = cart.map(l => { const p = byId(l.pid); return {
    nombre: p.nombre, color: l.color || '', talla: l.sz || '',
    personalizacion: [l.nombre, l.dorsal].filter(Boolean).join(' '), ud: l.q,
    precio: linePrice(l), importe: +(linePrice(l) * l.q).toFixed(2) }; });
  return { id: makeId(d), fecha: d.toISOString(), fechaTxt: d.toLocaleString('es-ES'), lote: lote.toISOString().slice(0, 10), loteTxt: fmtDate(lote),
    ...form, lines, base: +t.base.toFixed(2), iva: +t.iva.toFixed(2), total: +t.total.toFixed(2), status: 'off' };
}
function sheetHtml(o) {
  return `<!DOCTYPE html><html lang="es"><meta charset="utf-8"><title>Pedido ${o.id}</title>
<style>body{font:15px/1.5 Arial,sans-serif;color:#16222e;max-width:760px;margin:30px auto;padding:0 20px}h1{color:#0168B3;border-bottom:4px solid #FFE55D;padding-bottom:6px}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border:1px solid #d6e0ea;padding:6px 8px;text-align:left;font-size:14px}th{background:#eef4fa}td.n{text-align:right}.tot td{font-weight:bold}.box{background:#eef4fa;padding:12px 16px;border-radius:8px}</style>
<h1>Hoja de pedido · ${o.id}</h1>
<p><b>${esc(CFG.titular)}</b><br>Fecha: ${o.fechaTxt} · Lote: ${o.loteTxt}</p>
<p><b>${esc(o.name)}</b> · ${esc(o.role)}<br>${esc(o.mail)} · ${esc(o.tel)}${o.obs ? '<br>Observaciones: ' + esc(o.obs) : ''}</p>
<table><tr><th>Artículo</th><th>Color</th><th>Talla</th><th>Nombre / dorsal</th><th>Ud.</th><th>Precio</th><th>Importe</th></tr>
${o.lines.map(l => `<tr><td>${esc(l.nombre)}</td><td>${esc(l.color) || '—'}</td><td>${esc(l.talla) || '—'}</td><td>${esc(l.personalizacion) || '—'}</td><td class="n">${l.ud}</td><td class="n">${eur(l.precio)}</td><td class="n">${eur(l.importe)}</td></tr>`).join('')}
<tr><td colspan="6">Base imponible</td><td class="n">${eur(o.base)}</td></tr><tr><td colspan="6">IVA ${CFG.iva} %</td><td class="n">${eur(o.iva)}</td></tr><tr class="tot"><td colspan="6">Total a ingresar</td><td class="n">${eur(o.total)}</td></tr></table>
<div class="box"><b>Transferencia:</b> ${esc(CFG.iban)} (${esc(CFG.titular)})<br>Concepto: ${o.id} · ${esc(o.name)}<br>Envía el justificante a ${esc(CFG.email)}. Recogida en la ${esc(CFG.sede)}, ${esc(CFG.sedeDetalle)}. Plazo: ${esc(CFG.plazo)} desde el lote del ${o.loteTxt}.</div></html>`;
}
function textOf(o) {
  return `PEDIDO ${o.id} · Tienda FBMPA\n${o.fechaTxt}\n${o.name} · ${o.role}\n${o.mail} · ${o.tel}\n\n` +
    o.lines.map(l => `${l.ud} × ${l.nombre}${l.color ? ' · ' + l.color : ''}${l.talla && l.talla !== 'Única' ? ' · ' + l.talla : ''}${l.personalizacion ? ' · ' + l.personalizacion : ''} · ${eur(l.importe)}`).join('\n') +
    `\n\nTotal: ${eur(o.total)} (IVA incl.)\nTransferencia a ${CFG.iban} · Concepto: ${o.id}\nLote: ${o.loteTxt}` + (o.obs ? `\nObservaciones: ${o.obs}` : '');
}
function download(name, content, type) {
  try { const b = new Blob([content], { type }), u = URL.createObjectURL(b), a = document.createElement('a');
    a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); }
  catch { toast('No se pudo descargar'); }
}
async function sendOrder(o) {
  const body = JSON.stringify({ accion: 'pedido', pedido: o });
  try { const r = await fetch(CFG.endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body }); const j = await r.json(); return j && j.ok ? 'sent' : 'error'; }
  catch { try { await fetch(CFG.endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body }); return 'sent'; } catch { return 'error'; } }
}
function renderDone() {
  const o = lastOrder, el = $('#done'); el.hidden = false;
  const msg = {
    sending: ['', 'Enviando tu pedido…', ''],
    sent: ['is-ok', 'Pedido enviado', `Hemos registrado tu pedido y te enviaremos una copia a <b>${esc(o.mail)}</b>. Haz ahora la transferencia de <b>${eur(o.total)}</b> con el concepto <code>${o.id}</code>.`],
    off: ['is-off', 'Pedido generado', `Envía la hoja de pedido por correo a <b>${esc(CFG.email)}</b> y haz la transferencia de <b>${eur(o.total)}</b> con el concepto <code>${o.id}</code>. Cuando recibamos el justificante, tu pedido entra en el lote.`],
    error: ['is-err', 'No se pudo enviar automáticamente', `Envía la hoja de pedido por correo a <b>${esc(CFG.email)}</b> junto con el justificante. Tu pedido es el <code>${o.id}</code>.`]
  }[o.status];
  el.innerHTML = `<div class="t-done ${msg[0]}"><h4>${msg[1]}</h4>${msg[2] ? `<p>${msg[2]}</p><p><b>Lote:</b> ${o.loteTxt}</p>
    <div class="t-done__btns">
      <a class="btn" href="mailto:${encodeURIComponent(CFG.email)}?subject=${encodeURIComponent('Pedido ' + o.id)}&body=${encodeURIComponent(textOf(o))}">Enviar por correo</a>
      <button type="button" class="btn btn--ghost" id="dlHtml">Descargar hoja</button>
      <button type="button" class="btn btn--ghost" id="cpTxt">Copiar resumen</button>
    </div>` : ''}</div>`;
  $('#dlHtml') && ($('#dlHtml').onclick = () => download(`pedido-${o.id}.html`, sheetHtml(o), 'text/html'));
  $('#cpTxt') && ($('#cpTxt').onclick = async () => { try { await navigator.clipboard.writeText(textOf(o)); toast('Resumen copiado'); } catch { toast('No se pudo copiar'); } });
  el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
async function enviar() {
  const e = validate(); $('#err').textContent = e;
  if (e) { if (!cart.length) closeCart(); return; }
  lastOrder = buildOrder();
  if (!CFG.endpoint) { lastOrder.status = 'off'; renderDone(); return; }
  lastOrder.status = 'sending'; renderDone(); $('#go').disabled = true;
  lastOrder.status = await sendOrder(lastOrder); $('#go').disabled = false; renderDone();
  if (lastOrder.status === 'sent') { cart = []; save(); renderCart(); }
}
function vaciar() { if (!cart.length || !confirm('¿Vaciar el pedido?')) return; cart = []; save(); renderCart(); lastOrder = null; $('#done').hidden = true; $('#err').textContent = ''; }
const save = () => store.set('fbmpa.tienda.cart', cart);

/* ---------- Guía de tallas ---------- */
function openGuide() {
  $('#mBody').innerHTML = Object.entries(CFG.guiaTallas).map(([k, g]) => `<h4 class="t-modal__h">${CFG.nombreTallaje[k]}</h4>
    <table><tr>${g.cols.map(c => `<th>${c}</th>`).join('')}</tr>${g.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`).join('') +
    `<p class="t-note">Medidas orientativas. Se sustituirán por la tabla oficial del proveedor.</p>`;
  $('#modal').classList.add('is-on'); $('#mx').focus();
}

/* ---------- Cajón móvil ---------- */
function openCart() { $('#pedido').classList.add('is-open'); $('#scrim').classList.add('is-on'); document.body.style.overflow = 'hidden'; }
function closeCart() { $('#pedido').classList.remove('is-open'); $('#scrim').classList.remove('is-on'); document.body.style.overflow = ''; }

/* ---------- Toast ---------- */
let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('is-on'), 1800); }


/* ---------- Marcado de la página ---------- */
function marcado() {
  return `
  <div class="seleccion-hero tienda-hero">
    <div class="contenedor anim-entrada">
      <div class="tienda-hero__texto">
        <p class="eyebrow eyebrow--claro">Tienda oficial</p>
        <h1>Viste la <span class="genero">selección</span></h1>
        <p class="tienda-hero__lead">La camiseta de las selecciones asturianas, la ropa de la federación, balones y material. Pedido online, pago por transferencia y recogida en la FBMPA.</p>
      </div>
      <ol class="t-steps" aria-label="Cómo funciona">
        <li><div><b>Elige y añade</b><span>Color, talla y cantidad. Precios con IVA incluido.</span></div></li>
        <li><div><b>Envía y transfiere</b><span>Recibes un número de pedido y haces la transferencia.</span></div></li>
        <li><div><b>Recoge en la FBMPA</b><span>Los pedidos se agrupan el día ${CFG.corte} de cada mes.</span></div></li>
      </ol>
    </div>
  </div>

  <div class="contenedor t-layout">
    <div>
      <div class="t-notice" role="note">
        <span class="t-notice__ico" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
        <p><b>Un solo punto de recogida.</b> Todos los pedidos se entregan en la ${esc(CFG.sede)}, ${esc(CFG.sedeDetalle)}. Te avisaremos por correo cuando esté disponible.</p>
      </div>
      <h2 class="visually-hidden">Catálogo</h2>
      <nav class="t-grupos" id="nav-grupos" aria-label="Grupos del catálogo"></nav>
      <div id="catalogo"></div>
    </div>

    <aside class="t-cart" id="pedido" aria-label="Tu pedido">
      <div class="t-cart__hd">
        <h3>Tu pedido</h3>
        <span class="t-cart__count" id="count">0</span>
        <button type="button" class="t-cart__close" id="closeCart" aria-label="Cerrar pedido">×</button>
      </div>
      <div class="t-cart__bd">
        <div id="lines"></div>
        <div id="totals"></div>
        <form id="form" novalidate>
          <fieldset class="t-form">
            <legend>Tus datos</legend>
            <div class="t-field" data-f="name"><label for="fName">Nombre y apellidos <span>*</span></label><input id="fName" type="text" autocomplete="name"><div class="msg">Escribe tu nombre completo.</div></div>
            <div class="t-field" data-f="role"><label for="fRole">¿Quién hace el pedido? <span>*</span></label><select id="fRole"><option value="">Selecciona</option></select><div class="msg">Elige una opción.</div></div>
            <div class="t-two">
              <div class="t-field" data-f="mail"><label for="fMail">Correo electrónico <span>*</span></label><input id="fMail" type="email" autocomplete="email" inputmode="email"><div class="msg">Correo no válido.</div></div>
              <div class="t-field" data-f="tel"><label for="fTel">Teléfono <span>*</span></label><input id="fTel" type="tel" autocomplete="tel" inputmode="tel"><div class="msg">Mínimo 9 dígitos.</div></div>
            </div>
            <div class="t-field"><label for="fObs">Observaciones</label><textarea id="fObs"></textarea></div>
            <input type="text" id="fWeb" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
          </fieldset>
        </form>
        <div class="t-instr" id="instr"></div>
        <div id="done" hidden></div>
      </div>
      <div class="t-cart__ft">
        <div class="t-err" id="err" role="alert"></div>
        <button type="button" class="btn btn--bloque" id="go">Enviar pedido</button>
        <button type="button" class="btn btn--ghost btn--bloque" id="clear">Vaciar pedido</button>
      </div>
    </aside>
  </div>

  <div class="t-scrim" id="scrim"></div>
  <div class="t-mbar" id="mbar"><span>Tu pedido</span><b id="mtot">0,00 €</b><button type="button" class="btn" id="openCart"><span>Ver pedido (<span id="mcount">0</span>)</span></button></div>
  <div class="t-modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle"><div class="t-modal__box"><button type="button" class="t-modal__x" id="mx" aria-label="Cerrar">×</button><h3 id="mTitle">Guía de tallas</h3><div id="mBody"></div></div></div>
  <div class="t-toast" id="toast" role="status" aria-live="polite"></div>`;
}

/* ---------- Punto de entrada: app.js lo llama en tienda.html ---------- */
export function renderTienda(main) {
  main.classList.add('tienda');
  main.innerHTML = marcado();
  renderCatalog(); fillForm(); renderInstr(); renderCart();
  $$('#form input, #form select, #form textarea').forEach(el => el.addEventListener('input', () => { el.closest('.t-field')?.classList.remove('is-bad'); readForm(); }));
  $('#go').onclick = enviar;
  $('#clear').onclick = vaciar;
  $('#mx').onclick = () => $('#modal').classList.remove('is-on');
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') $('#modal').classList.remove('is-on'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { $('#modal').classList.remove('is-on'); closeCart(); } });
  $('#openCart').onclick = openCart; $('#closeCart').onclick = closeCart; $('#scrim').onclick = closeCart;
}
