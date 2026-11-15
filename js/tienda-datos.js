/* =====================================================================
   TIENDA · DATOS
   Único archivo que se toca. Catálogo, precios y forma de compra: página
   "Tienda FBMPA" del BOASBA nº 14/26-27 (9 de noviembre de 2026).
   Precios SIN IVA, tal como los publica la federación; la web los muestra
   igual («21,50 € + IVA») y suma el IVA solo en el total del pedido.
   ===================================================================== */

export const TIENDA = {
  /* URL de la aplicación web de Google Apps Script (ver apps-script.gs).
     Vacía → la tienda genera la hoja de pedido y la deja enviar por correo. */
  endpoint: '',

  email: 'fbmpa@fbmpa.com',
  telefono: '985 395 172',
  sede: 'Federación',
  sedeDetalle: 'C/ Espronceda 19, bajo · Gijón',
  titular: 'Federación de Balonmano del Principado de Asturias',

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
   - estado: 'disponible' | 'bajo-pedido' | 'proximamente', como en el
     boletín. Lo "bajo pedido" se encarga al reunir las reservas; lo
     "proximamente" se enseña pero aún no se puede pedir.
   - precio: sin IVA (ver preciosConIva). Si una talla lleva precio
     propio ({n, p}) manda sobre este.
   - tallas: 'adulto' | 'nino' | 'todas' | ['S','M'] | [{n, p}]
   - colores: lista de nombres; con más de uno se elige en la ficha
   - guia: muestra el enlace a la guía de tallas
   - foto: img/tienda/<id>.webp, 4:5 (ver img/tienda/LEEME.md)
   --------------------------------------------------------------------- */
export const CATALOGO = [
  {
    id: 'chaqueton', estado: 'disponible',
    nombre: 'Chaquetón FBMPA',
    descripcion: 'Abrigo acolchado con capucha y «Asturias Balonmano» a la espalda.',
    colores: ['Azul marino'], foto: 'img/tienda/chaqueton.webp',
    tallas: ['S', 'M', 'L'], precio: 41.30, guia: true
  },
  {
    id: 'chandal', estado: 'bajo-pedido',
    nombre: 'Chándal FBMPA',
    descripcion: 'Chaqueta con cremallera completa y «Asturias Balonmano» a la espalda.',
    colores: ['Azul FBMPA'], foto: 'img/tienda/chandal.webp',
    tallas: 'todas', precio: 41.30, guia: true
  },
  {
    id: 'sudadera', estado: 'bajo-pedido',
    nombre: 'Sudadera de calentamiento',
    descripcion: 'Media cremallera, azul con detalles amarillos.',
    colores: ['Azul FBMPA'], foto: 'img/tienda/sudadera.webp',
    tallas: 'todas', precio: 16.50, guia: true
  },
  {
    id: 'camiseta-seleccion', estado: 'proximamente',
    nombre: 'Camiseta de juego Selección',
    descripcion: 'Nuevo modelo para el CESA 2027. Todas las tallas.',
    foto: 'img/tienda/camiseta-seleccion.webp',
    tallas: 'todas', precio: null
  },
  {
    id: 'camiseta-playa', estado: 'bajo-pedido',
    nombre: 'Camiseta de juego Playa',
    descripcion: 'Camiseta de tirantes de la selección de balonmano playa.',
    colores: ['Azul', 'Blanca', 'Negra'], foto: 'img/tienda/camiseta-playa.webp',
    tallas: 'todas', precio: 29.00, guia: true
  },
  {
    id: 'camiseta-fbmpa', estado: 'bajo-pedido',
    nombre: 'Camiseta de paseo FBMPA',
    descripcion: 'Camiseta con el logo de la federación.',
    colores: ['Azul FBMPA'], foto: 'img/tienda/camiseta-fbmpa.webp',
    tallas: 'todas', precio: 12.40, guia: true
  },
  {
    id: 'bufanda', estado: 'disponible',
    nombre: 'Bufanda FBMPA',
    descripcion: 'Azul y amarilla: «Asturias» y «¡Vamos guajes!».',
    foto: 'img/tienda/bufanda.webp', tallas: ['Única'], precio: 12.40
  }
];
