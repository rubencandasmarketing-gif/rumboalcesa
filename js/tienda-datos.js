/* =====================================================================
   TIENDA · DATOS
   Único archivo que se toca. Catálogo y precios: página "Tienda" del
   BOASBA nº 9/26-27 (5 de octubre de 2026). Precios SIN IVA, tal como
   los publica la federación; la web los muestra con IVA.
   Siguen pendientes: fotos reales, IBAN, día de corte y plazo.
   ===================================================================== */

export const TIENDA = {
  /* URL de la aplicación web de Google Apps Script (ver apps-script.gs).
     Vacía → la tienda genera la hoja de pedido y la deja enviar por correo. */
  endpoint: '',

  email: 'fbmpa@fbmpa.com',
  telefono: '985 39 51 72',
  sede: 'sede de la FBMPA',
  sedeDetalle: 'C/ Espronceda 19, bajo · Gijón',
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
   CATÁLOGO (solo ropa)
   - precio: sin IVA (ver preciosConIva). Si una talla lleva precio
     propio ({n, p}) manda sobre este.
   - tallas: 'adulto' | 'nino' | 'todas' | ['S','M'] | [{n, p}]
   - colores: lista de nombres; con más de uno se elige en la ficha
   - etiqueta: distintivo sobre la foto
   - guia: muestra el enlace a la guía de tallas
   - foto: img/tienda/<id>.webp, 4:5 (ver img/tienda/LEEME.md). Mientras
     no exista, la tarjeta enseña el marcador «Foto pendiente».
   --------------------------------------------------------------------- */
export const CATALOGO = [
  {
    id: 'camiseta-seleccion', etiqueta: 'Hasta fin de existencias',
    nombre: 'Camiseta Selección Asturias',
    descripcion: 'La camiseta de juego de las selecciones asturianas. Todas las tallas.',
    colores: ['Azul', 'Amarilla'], foto: 'img/tienda/camiseta-seleccion.webp',
    tallas: 'todas', precio: 29.00, guia: true
  },
  {
    id: 'camiseta-playa', etiqueta: 'Hasta fin de existencias',
    nombre: 'Camiseta Selección Balonmano Playa',
    descripcion: 'Camiseta de tirantes de la selección de balonmano playa.',
    colores: ['Azul', 'Blanca', 'Negra'], foto: 'img/tienda/camiseta-playa.webp',
    tallas: ['XS', 'S', 'M', 'L', 'XL'], precio: 29.00, guia: true
  },
  {
    id: 'camiseta-fbmpa',
    nombre: 'Camiseta FBMPA azul marino',
    descripcion: 'Camiseta con el logo de la federación.',
    colores: ['Azul marino'], foto: 'img/tienda/camiseta-fbmpa.webp',
    tallas: ['S', 'M', 'L'], precio: 12.40, guia: true
  },
  {
    id: 'sudadera',
    nombre: 'Sudadera de calentamiento FBMPA',
    descripcion: 'Media cremallera, azul con cuello amarillo.',
    colores: ['Azul FBMPA'], foto: 'img/tienda/sudadera.webp',
    tallas: ['M', 'L', 'XL'], precio: 16.50, guia: true
  },
  {
    id: 'chandal',
    nombre: 'Chándal FBMPA',
    descripcion: 'Chaqueta de chándal con cremallera completa.',
    colores: ['Azul FBMPA'], foto: 'img/tienda/chandal.webp',
    tallas: ['M', 'L', 'XL'], precio: 41.30, guia: true
  },
  {
    id: 'chaqueton',
    nombre: 'Chaquetón FBMPA',
    descripcion: 'Chaquetón acolchado con capucha, azul marino.',
    colores: ['Azul marino'], foto: 'img/tienda/chaqueton.webp',
    tallas: ['S', 'M', 'L'], precio: 41.30, guia: true
  },
  {
    id: 'bufanda', etiqueta: '¡Vamos guajes!',
    nombre: 'Bufanda FBMPA',
    descripcion: 'Bufanda azul y amarilla "Asturias balonmano".',
    foto: 'img/tienda/bufanda.webp', tallas: ['Única'], precio: 12.40
  }
];
