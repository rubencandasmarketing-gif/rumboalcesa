/* =============================================================================
   DATOS.JS — Asturias, rumbo al CESA
   =============================================================================
   ESTE ES EL ÚNICO ARCHIVO QUE SE TOCA DURANTE EL CAMPEONATO.

   Flujo de trabajo real:

   DÍAS ANTES (con calma, desde el ordenador):
   · Carga el calendario completo con fecha, hora, rival y sede
   · Pega el youtubeId de cada partido según se programen los directos en
     YouTube. Con el enlace puesto, la tarjeta ofrece "Recordatorio en
     YouTube" y EL REPRODUCTOR SE ENCIENDE SOLO a la hora del partido.

   DURANTE EL CAMPEONATO (desde el móvil):
   · Termina un partido  →  estado: "finalizado" + golesAsturias/golesRival
   · Llega la galería    →  pega la URL en galeria
   · estado: "directo" solo hace falta para FORZAR el reproductor fuera de
     hora (un partido adelantado, una prórroga larga...)
   · Entra el patrocinador principal →  patrocinadorPrincipal: activo: true

   youtubeId es SOLO el identificador, no la URL completa:
   https://www.youtube.com/watch?v=dQw4w9WgXcQ  →  youtubeId: "dQw4w9WgXcQ"

   Mientras no se publique el calendario, partidos: [] y la página muestra
   los rivales del grupo con "Fechas y horas, cuando se publique el calendario".
   Cada partido nuevo sigue este formato (sede: id de SEDES):
     { id: "im-j1", fecha: "2027-01-04", hora: "10:00", fase: "Fase de grupos — J1",
       rival: "Canarias", sede: "",
       estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
   ============================================================================= */

export const CONFIG = {
  nombreSitio: "Asturias, rumbo al CESA",
  descripcion: "Toda la cobertura de las selecciones asturianas en el CESA 2027: convocatorias, calendario, resultados y directos.",
  dominio: "rumboalcesa.es",            // provisional hasta confirmar registro
  canalYoutube: "",                     // URL del canal, p. ej. "https://www.youtube.com/@..."
  edicion: "CESA 2027",                 // pendiente de confirmar edición y fechas
  // Redes sociales de la federación: se muestran en el pie al rellenarlas
  redes: {
    twitter: "",     // p. ej. "https://x.com/fbmpa"
    instagram: "",   // p. ej. "https://www.instagram.com/fbmpa"
    facebook: ""     // p. ej. "https://www.facebook.com/fbmpa"
  },

  // Con activo:false, los tres huecos muestran "Este espacio puede ser tuyo"
  patrocinadorPrincipal: {
    activo: false,
    nombre: "",
    logo: "",        // p. ej. "img/patrocinadores/nombre.webp"
    banner: "",      // creatividad ancha para la sala del directo (si falta, se usa el logo)
    url: ""
  }
};

/* --- SEDES --------------------------------------------------------------- */
export const SEDES = [
  {
    id: "calella",
    nombre: "Pavelló Municipal de Calella",
    municipio: "Calella",
    direccion: "",
    mapa: "https://maps.google.com/?q=Pavello+Municipal+Calella"
  },
  {
    id: "blanes",
    nombre: "Pavelló Municipal de Blanes",
    municipio: "Blanes",
    direccion: "",
    mapa: "https://maps.google.com/?q=Pavello+Municipal+Blanes"
  },
  {
    id: "pineda",
    nombre: "Pavelló de Pineda de Mar",
    municipio: "Pineda de Mar",
    direccion: "",
    mapa: "https://maps.google.com/?q=Pavello+Pineda+de+Mar"
  }
];

/* --- PATROCINADORES (todos los niveles) ---------------------------------- */
/* 'nivel' queda listo para cuando la federación defina los niveles.
   'fondo' solo hace falta cuando el logo trae su propio color de fondo
   incrustado (no transparente): el hueco se tiñe de ese color y el logo
   ocupa la tarjeta entera, en vez de quedar como un recorte sobre blanco. */
export const PATROCINADORES = [
  {
    nombre: "Caja Rural de Asturias",
    logo: "img/patrocinadores/caja-rural-asturias.jpg",
    url: "https://www.cajaruraldeasturias.com/es",
    nivel: "",
    fondo: "#00613E"
  },
  {
    nombre: "VIR Construcciones",
    logo: "img/patrocinadores/vir-construcciones.jpg",
    url: "https://virconstrucciones.com/",
    nivel: ""
  },
  {
    nombre: "Almacenes Silgar",
    logo: "img/patrocinadores/almacenes-silgar.jpg",
    url: "https://www.almacenessilgar.com/",
    nivel: "",
    fondo: "#151316"
  },
  {
    nombre: "Joma",
    logo: "img/patrocinadores/joma.png",
    url: "https://www.joma-sport.com/",
    nivel: ""
  },
  {
    nombre: "Carlin Asturias",
    logo: "img/patrocinadores/carlin-asturias.png",
    url: "https://www.carlinasturias.com/",
    nivel: ""
  },
  {
    nombre: "Confía",
    logo: "img/patrocinadores/confia.svg",
    url: "https://www.confia.es/",
    nivel: ""
  }
];

/* --- SELECCIONES ---------------------------------------------------------- */
/* Posiciones: Portero, Extremo izq., Lateral izq., Central, Pivote,
               Lateral der., Extremo der.
   Roles staff fijos: Seleccionador/a, Entrenador/a, Delegado/a (siempre visibles;\n   otros roles como Fisioterapeuta se muestran a continuación si se añaden)
   Grupos: tal cual el orden oficial del sorteo. El de Asturias se detecta
   solo (el que incluye "Asturias") y se destaca como "Nuestro grupo".
   Valen grupos de 3 o 4 equipos y 2 o 3 grupos por categoría. */

export const SELECCIONES = [
  {
    id: "infantil-masculina",
    categoria: "Infantil",
    genero: "Masculina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    competicion: "Copa de España",
    grupos: [
      { letra: "A", equipos: ["Región de Murcia", "Extremadura", "Baleares"] },
      { letra: "B", equipos: ["Madrid", "Castilla y León", "Euskadi"] },
      { letra: "C", equipos: ["Canarias", "La Rioja", "Melilla", "Asturias"] }
    ],
    staff: [],
    plantilla: [],
    partidos: []
  },
  {
    id: "infantil-femenina",
    categoria: "Infantil",
    genero: "Femenina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    competicion: "Copa de España",
    grupos: [
      { letra: "A", equipos: ["Castilla-La Mancha", "La Rioja", "Navarra"] },
      { letra: "B", equipos: ["Euskadi", "Aragón", "Extremadura"] },
      { letra: "C", equipos: ["Asturias", "Baleares", "Región de Murcia", "Ceuta"] }
    ],
    staff: [],
    plantilla: [],
    partidos: []
  },
  {
    id: "cadete-masculina",
    categoria: "Cadete",
    genero: "Masculina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    competicion: "Copa de España",
    grupos: [
      { letra: "A", equipos: ["Euskadi", "Castilla-La Mancha", "Baleares"] },
      { letra: "B", equipos: ["Región de Murcia", "La Rioja", "Canarias"] },
      { letra: "C", equipos: ["Navarra", "Extremadura", "Asturias"] }
    ],
    staff: [],
    plantilla: [],
    partidos: []
  },
  {
    id: "cadete-femenina",
    categoria: "Cadete",
    genero: "Femenina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    competicion: "Copa de España",
    grupos: [
      { letra: "A", equipos: ["Asturias", "La Rioja", "Cantabria"] },
      { letra: "B", equipos: ["Comunidad Valenciana", "Extremadura", "Baleares"] },
      { letra: "C", equipos: ["Canarias", "Castilla y León", "Ceuta", "Región de Murcia"] }
    ],
    staff: [],
    plantilla: [],
    partidos: []
  },
  {
    id: "juvenil-masculina",
    categoria: "Juvenil",
    genero: "Masculina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    competicion: "Copa de España",
    grupos: [
      { letra: "A", equipos: ["Cantabria", "Canarias", "Asturias"] },
      { letra: "B", equipos: ["Euskadi", "Melilla", "Extremadura"] },
      { letra: "C", equipos: ["Castilla y León", "Región de Murcia", "La Rioja"] }
    ],
    staff: [],
    plantilla: [],
    partidos: []
  },
  {
    id: "juvenil-femenina",
    categoria: "Juvenil",
    genero: "Femenina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    competicion: "Copa de España",
    grupos: [
      { letra: "A", equipos: ["Canarias", "Región de Murcia", "Asturias", "Cantabria"] },
      { letra: "B", equipos: ["Andalucía", "Extremadura", "Aragón", "La Rioja"] }
    ],
    staff: [],
    plantilla: [],
    partidos: []
  }
];
