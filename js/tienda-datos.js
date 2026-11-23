/* =====================================================================
   TIENDA · DATOS
   Único archivo que se toca. Todo sale tal cual de la página "Tienda
   FBMPA" del BOASBA nº 14/26-27 (9 de noviembre de 2026): nombres,
   tallas, disponibilidad, precios y forma de compra. No se añade nada que
   el boletín no diga (ni guía de tallas, ni colores, ni forma de pago).
   Precios SIN IVA, como en el boletín: la web pone «21,50 € + IVA».
   ===================================================================== */

export const TIENDA = {
  /* Los pedidos se hacen por correo a la federación */
  email: 'fbmpa@fbmpa.com',
  telefono: '985 395 172',
  sede: 'Federación',
  sedeDetalle: 'C/ Espronceda 19, bajo · Gijón',
  titular: 'Federación de Balonmano del Principado de Asturias'
};

/* ---------------------------------------------------------------------
   CATÁLOGO (solo ropa)
   - estado: 'disponible' | 'bajo-pedido' | 'proximamente', como en el
     boletín. Lo "bajo pedido" se encarga al reunir las reservas; lo
     "proximamente" se enseña sin botón de pedido.
   - detalle: la línea que el boletín pone bajo el nombre, tal cual.
   - precio: sin IVA, como en el boletín. null = aún sin precio.
   - talla: true si al pedir hay que indicar talla (el correo la pregunta).
   - foto: img/tienda/<id>.webp, 4:5 (ver img/tienda/LEEME.md)
   --------------------------------------------------------------------- */
export const CATALOGO = [
  {
    id: 'chaqueton', estado: 'disponible',
    nombre: 'Chaquetón FBMPA',
    detalle: 'Abrigo · Tallas S, M y L',
    foto: 'img/tienda/chaqueton.webp', precio: 41.30, talla: true
  },
  {
    id: 'chandal', estado: 'bajo-pedido',
    nombre: 'Chándal FBMPA',
    detalle: 'Todas las tallas',
    foto: 'img/tienda/chandal.webp', precio: 41.30, talla: true
  },
  {
    id: 'sudadera', estado: 'bajo-pedido',
    nombre: 'Sudadera calentamiento',
    detalle: 'Todas las tallas',
    foto: 'img/tienda/sudadera.webp', precio: 16.50, talla: true
  },
  {
    id: 'camiseta-seleccion', estado: 'proximamente',
    nombre: 'Camiseta de juego Selección',
    detalle: 'Nuevo modelo CESA 2027 · Todas las tallas',
    foto: 'img/tienda/camiseta-seleccion.webp', precio: null, talla: true
  },
  {
    id: 'camiseta-playa', estado: 'bajo-pedido',
    nombre: 'Camiseta de juego Playa',
    detalle: 'Todas las tallas',
    foto: 'img/tienda/camiseta-playa.webp', precio: 29.00, talla: true
  },
  {
    id: 'camiseta-fbmpa', estado: 'bajo-pedido',
    nombre: 'Camiseta de paseo FBMPA',
    detalle: 'Todas las tallas',
    foto: 'img/tienda/camiseta-fbmpa.webp', precio: 12.40, talla: true
  },
  {
    id: 'bufanda', estado: 'disponible',
    nombre: 'Bufanda FBMPA',
    detalle: 'Asturias · ¡Vamos guajes!',
    foto: 'img/tienda/bufanda.webp', precio: 12.40, talla: false
  }
];
