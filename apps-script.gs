/**
 * TIENDA FBMPA · receptor de pedidos (Google Apps Script)
 * 1. Crea una hoja de cálculo en Drive y copia su ID en SHEET_ID.
 * 2. Extensiones → Apps Script → pega este archivo.
 * 3. Implementar → Nueva implementación → Aplicación web.
 *    Ejecutar como: tú · Acceso: cualquier usuario.
 * 4. Copia la URL que te da en TIENDA.endpoint (js/tienda-datos.js).
 */
const SHEET_ID = 'PON_AQUI_EL_ID_DE_LA_HOJA';
const AVISO_A  = 'fbmpa@fbmpa.com';   // correo de la federación

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.accion !== 'pedido') throw new Error('acción desconocida');
    const o = data.pedido;
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const hoja = ss.getSheetByName('Pedidos') || ss.insertSheet('Pedidos');
    if (hoja.getLastRow() === 0) hoja.appendRow(['Pedido','Fecha','Nombre','Rol','Correo','Teléfono','Artículo','Disponibilidad','Color','Talla','Nombre/dorsal','Ud.','Precio','Importe','Total pedido','Observaciones','Entregado']);
    o.lines.forEach(l => hoja.appendRow([o.id, o.fechaTxt, o.name, o.role, o.mail, o.tel, l.nombre, l.estado || '', l.color, l.talla, l.personalizacion, l.ud, l.precio, l.importe, o.total, o.obs || '', '']));
    const resumen = o.lines.map(l => `${l.ud} × ${l.nombre}${l.estado === 'Bajo pedido' ? ' (bajo pedido)' : ''}${l.color ? ' · ' + l.color : ''}${l.talla && l.talla !== 'Única' ? ' · ' + l.talla : ''}${l.personalizacion ? ' · ' + l.personalizacion : ''} · ${l.importe.toFixed(2)} €`).join('\n');
    const cuerpo = `Pedido ${o.id}\n\n${resumen}\n\nTotal: ${o.total.toFixed(2)} € (IVA incl.)\n\nRecogida en la Federación (C/ Espronceda 19, bajo, Gijón) cuando te avisemos. Los artículos «bajo pedido» se encargan al reunir las reservas.`;
    MailApp.sendEmail({ to: o.mail, subject: `Tu pedido ${o.id} · Tienda FBMPA`, body: cuerpo });
    MailApp.sendEmail({ to: AVISO_A, subject: `Nuevo pedido ${o.id} · ${o.name}`, body: `${o.name} · ${o.role}\n${o.mail} · ${o.tel}\n\n${cuerpo}` });
    return ContentService.createTextOutput(JSON.stringify({ ok: true, id: o.id })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
