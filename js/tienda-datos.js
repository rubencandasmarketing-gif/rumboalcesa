/* =====================================================================
   TIENDA · DATOS
   Único archivo que se toca. Catálogo y precios: página "Tienda" del
   BOASBA nº 9/26-27 (5 de octubre de 2026). Precios SIN IVA, tal como
   los publica la federación; la web los muestra con IVA.
   Siguen siendo de relleno: fotos (SVG), IBAN, día de corte y plazo.
   ===================================================================== */

export const TIENDA = {
  /* URL de la aplicación web de Google Apps Script (ver apps-script.gs).
     Vacía → la tienda genera la hoja de pedido y la deja enviar por correo. */
  endpoint: '',

  email: 'fbmpa@fbmpa.com',
  telefono: '985 39 51 72',
  sede: 'sede de la FBMPA',
  sedeDetalle: 'C/ Espronceda 19, bajo · Oviedo',
  iban: 'ES00 0000 0000 0000 0000 0000',  // PENDIENTE
  titular: 'Federación de Balonmano del Principado de Asturias',

  corte: 1,                 // PENDIENTE confirmar: día del mes en que se cierra el lote
  plazo: '3 a 4 semanas',   // PENDIENTE confirmar
  iva: 21,
  preciosConIva: false,     // los precios del catálogo están sin IVA

  /* Nombre y dorsal estampados. El boletín no lo ofrece: apagado. */
  personalizacion: { activa: false, precio: 6, maxNombre: 12 },

  roles: ['Jugador/a de selección', 'Familia', 'Entrenador/a o técnico/a', 'Club', 'Personal federativo', 'Otro'],

  /* Grupos de tallas reutilizables. En cada producto, `tallas` puede ser
     'adulto' | 'nino' | 'todas' (niño + adulto), una lista ['S','M','L']
     o una lista con precio propio [{n:'Talla 0', p:16.5}]. */
  tallajes: {
    adulto: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    nino:   ['6-8', '8-10', '10-12', '12-14', '14-16']
  },
  nombreTallaje: { adulto: 'Adulto', nino: 'Niño/a' },

  guiaTallas: {
    adulto: { cols: ['Talla', 'Pecho (cm)', 'Cintura (cm)', 'Altura (cm)'],
      rows: [['XS','84-88','72-76','164-170'],['S','88-92','76-80','170-176'],['M','92-96','80-84','176-182'],['L','96-100','84-88','182-188'],['XL','100-106','88-96','188-194'],['2XL','106-112','96-104','194-200'],['3XL','112-118','104-112','200-206']] },
    nino: { cols: ['Talla', 'Edad', 'Altura (cm)', 'Pecho (cm)'],
      rows: [['6-8','6-8 años','116-128','60-64'],['8-10','8-10 años','128-140','64-68'],['10-12','10-12 años','140-152','68-74'],['12-14','12-14 años','152-164','74-80'],['14-16','14-16 años','164-176','80-86']] }
  }
};

/* ---------------------------------------------------------------------
   CATÁLOGO
   - precio: sin IVA (ver preciosConIva). Si una talla lleva precio
     propio ({n, p}) manda sobre este.
   - tallas: 'adulto' | 'nino' | 'todas' | ['S','M'] | [{n, p}]
   - etiquetaTalla: rótulo del selector ('Talla' por defecto; 'Formato'…)
   - colores: lista de nombres; con más de uno se elige en la ficha
   - etiqueta: distintivo sobre la foto
   - guia: muestra el enlace a la guía de tallas (solo ropa)
   - foto: 4:5 en /img/tienda/. Ahora ilustraciones SVG de relleno.
   --------------------------------------------------------------------- */
export const CATALOGO = [
  /* ---- Equipación de la selección ---- */
  {
    id: 'camiseta-seleccion', grupo: 'Equipación de la selección', etiqueta: 'Hasta fin de existencias',
    nombre: 'Camiseta Selección Asturias',
    descripcion: 'La camiseta de juego de las selecciones asturianas. Todas las tallas.',
    colores: ['Azul', 'Amarilla'], foto: 'img/tienda/camiseta-juego.svg',
    tallas: 'todas', precio: 29.00, guia: true, destacado: true
  },
  {
    id: 'camiseta-playa', grupo: 'Equipación de la selección', etiqueta: 'Hasta fin de existencias',
    nombre: 'Camiseta Selección Balonmano Playa',
    descripcion: 'Camiseta de tirantes de la selección de balonmano playa.',
    colores: ['Azul', 'Blanca', 'Negra'], foto: 'img/tienda/camiseta-playa.svg',
    tallas: ['XS', 'S', 'M', 'L', 'XL'], precio: 29.00, guia: true
  },

  /* ---- Ropa FBMPA ---- */
  {
    id: 'camiseta-fbmpa', grupo: 'Ropa FBMPA',
    nombre: 'Camiseta FBMPA azul marino',
    descripcion: 'Camiseta con el logo de la federación.',
    colores: ['Azul marino'], foto: 'img/tienda/camiseta-marino.svg',
    tallas: ['S', 'M', 'L'], precio: 12.40, guia: true
  },
  {
    id: 'sudadera', grupo: 'Ropa FBMPA',
    nombre: 'Sudadera de calentamiento FBMPA',
    descripcion: 'Media cremallera, azul con cuello amarillo.',
    colores: ['Azul FBMPA'], foto: 'img/tienda/sudadera.svg',
    tallas: ['M', 'L', 'XL'], precio: 16.50, guia: true
  },
  {
    id: 'chandal', grupo: 'Ropa FBMPA',
    nombre: 'Chándal FBMPA',
    descripcion: 'Chaqueta de chándal con cremallera completa.',
    colores: ['Azul FBMPA'], foto: 'img/tienda/chaqueta.svg',
    tallas: ['M', 'L', 'XL'], precio: 41.30, guia: true
  },
  {
    id: 'chaqueton', grupo: 'Ropa FBMPA',
    nombre: 'Chaquetón FBMPA',
    descripcion: 'Chaquetón acolchado con capucha, azul marino.',
    colores: ['Azul marino'], foto: 'img/tienda/chaqueton.svg',
    tallas: ['S', 'M', 'L'], precio: 41.30, guia: true
  },

  /* ---- Balones ---- */
  {
    id: 'balon-trial-playa', grupo: 'Balones',
    nombre: 'Balón Trial Playa modelo Última',
    descripcion: 'Balón de balonmano playa. El precio depende de la talla.',
    foto: 'img/tienda/balon-playa.svg',
    tallas: [{ n: 'Talla 00', p: 16.50 }, { n: 'Talla 0', p: 16.50 }, { n: 'Talla 1', p: 17.40 }, { n: 'Talla 2', p: 18.20 }]
  },
  {
    id: 'balon-joma-sgrip', grupo: 'Balones',
    nombre: 'Balón Joma modelo S-Grip',
    descripcion: 'Balón de entrenamiento y competición.',
    foto: 'img/tienda/balon-sgrip.svg',
    tallas: ['Talla 0', 'Talla 1', 'Talla 2', 'Talla 3'], precio: 21.50
  },
  {
    id: 'balon-joma-jpro', grupo: 'Balones',
    nombre: 'Balón Joma modelo J-Pro',
    descripcion: 'Balón de competición.',
    foto: 'img/tienda/balon-jpro.svg',
    tallas: ['Talla 2', 'Talla 3'], precio: 23.20
  },

  /* ---- Material ---- */
  {
    id: 'pega-trimona', grupo: 'Material',
    nombre: 'Pega Trimona Easy Clean',
    descripcion: 'Resina de balonmano, fácil de limpiar.',
    foto: 'img/tienda/pega.svg', etiquetaTalla: 'Formato',
    tallas: [{ n: 'Bote 250 g', p: 16.50 }, { n: 'Bote 500 g', p: 20.50 }]
  },
  {
    id: 'botiquin', grupo: 'Material',
    nombre: 'Botiquín',
    descripcion: 'Bolsa botiquín Joma.',
    foto: 'img/tienda/botiquin.svg', tallas: ['Única'], precio: 20.70
  },
  {
    id: 'botiquin-medico', grupo: 'Material',
    nombre: 'Botiquín médico',
    descripcion: 'Bolsa botiquín grande Joma.',
    foto: 'img/tienda/botiquin-medico.svg', tallas: ['Única'], precio: 39.70
  },
  {
    id: 'bolsa-portabalones', grupo: 'Material',
    nombre: 'Bolsa portabalones',
    descripcion: 'Bolsa de red Joma para balones.',
    foto: 'img/tienda/bolsa-balones.svg', tallas: ['Única'], precio: 21.50
  },
  {
    id: 'bufanda', grupo: 'Material', etiqueta: '¡Vamos guajes!',
    nombre: 'Bufanda FBMPA',
    descripcion: 'Bufanda azul y amarilla "Asturias balonmano".',
    foto: 'img/tienda/bufanda.svg', tallas: ['Única'], precio: 12.40
  }
];
