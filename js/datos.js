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

   ⚠️ HAY DATOS DE EJEMPLO más abajo (marcados con "EJEMPLO"). Sirven para ver
   los tres estados de partido funcionando y enseñar la web. Bórralos antes de
   publicar datos reales.
   ============================================================================= */

export const CONFIG = {
  nombreSitio: "Asturias, rumbo al CESA",
  descripcion: "Toda la cobertura de las selecciones asturianas en el Campeonato de España: convocatorias, calendario, resultados y directos.",
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
   Roles staff fijos: Seleccionador/a, Entrenador/a, Delegado/a (siempre visibles;\n   otros roles como Fisioterapeuta se muestran a continuación si se añaden) */

export const SELECCIONES = [
  {
    id: "infantil-masculina",
    categoria: "Infantil",
    genero: "Masculina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    staff: [],
    plantilla: [],
    partidos: [
      { id: "im-j1", fecha: "2027-01-04", hora: "10:00", fase: "Fase de grupos — J1",
        rival: "Madrid", sede: "calella",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "im-j2", fecha: "2027-01-05", hora: "10:00", fase: "Fase de grupos — J2",
        rival: "Galicia", sede: "pineda",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "im-j3", fecha: "2027-01-06", hora: "10:00", fase: "Fase de grupos — J3",
        rival: "Cantabria", sede: "blanes",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
  },
  {
    id: "infantil-femenina",
    categoria: "Infantil",
    genero: "Femenina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    staff: [],
    plantilla: [],
    partidos: [
      { id: "if-j1", fecha: "2027-01-04", hora: "12:30", fase: "Fase de grupos — J1",
        rival: "Cataluña", sede: "calella",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "if-j2", fecha: "2027-01-05", hora: "12:30", fase: "Fase de grupos — J2",
        rival: "Castilla y León", sede: "pineda",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "if-j3", fecha: "2027-01-06", hora: "12:30", fase: "Fase de grupos — J3",
        rival: "País Vasco", sede: "blanes",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
  },
  {
    id: "cadete-masculina",
    categoria: "Cadete",
    genero: "Masculina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    staff: [
      // PRUEBA con foto real — completar nombre
      { nombre: "Completar nombre", rol: "Entrenador", foto: "img/jugadores/cadete-masculina/staff-entrenador.webp" }
    ],
    plantilla: [
      // PRUEBA con foto real — completar posición y club
      { dorsal: 6, nombre: "Marco (completar apellidos)", posicion: "Completar posición", club: "Completar club", foto: "img/jugadores/cadete-masculina/06-marco.webp" }
    ],
    partidos: [
      { id: "cm-j1", fecha: "2027-01-04", hora: "16:00", fase: "Fase de grupos — J1",
        rival: "Andalucía", sede: "blanes",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "cm-j2", fecha: "2027-01-05", hora: "16:00", fase: "Fase de grupos — J2",
        rival: "Aragón", sede: "calella",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "cm-j3", fecha: "2027-01-06", hora: "10:00", fase: "Fase de grupos — J3",
        rival: "Navarra", sede: "pineda",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
  },
  {
    id: "cadete-femenina",
    categoria: "Cadete",
    genero: "Femenina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    staff: [],
    plantilla: [],
    partidos: [
      { id: "cf-j1", fecha: "2027-01-04", hora: "18:30", fase: "Fase de grupos — J1",
        rival: "Comunidad Valenciana", sede: "blanes",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "cf-j2", fecha: "2027-01-05", hora: "18:30", fase: "Fase de grupos — J2",
        rival: "Murcia", sede: "calella",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "cf-j3", fecha: "2027-01-06", hora: "12:30", fase: "Fase de grupos — J3",
        rival: "Extremadura", sede: "pineda",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
  },
  {
    id: "juvenil-masculina",
    categoria: "Juvenil",
    genero: "Masculina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"

    staff: [
      // EJEMPLO — borrar
      { nombre: "Nombre Apellidos (EJEMPLO)", rol: "Entrenador", foto: "" }
    ],

    plantilla: [
      // EJEMPLO — borrar. La foto sigue la nomenclatura acordada:
      // img/jugadores/juvenil-masculina/07-garcia.webp
      { dorsal: 1,  nombre: "Jugador Ejemplo Uno",  posicion: "Portero",     club: "Club EJEMPLO", foto: "" },
      { dorsal: 7,  nombre: "Jugador Ejemplo Dos",  posicion: "Lateral izq.", club: "Club EJEMPLO", foto: "" }
    ],

    partidos: [
      { id: "jm-j1", fecha: "2027-01-05", hora: "16:00", fase: "Fase de grupos — J1",
        rival: "Galicia", sede: "blanes",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "jm-j2", fecha: "2027-01-06", hora: "16:00", fase: "Fase de grupos — J2",
        rival: "Madrid", sede: "calella",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
  },
  {
    id: "juvenil-femenina",
    categoria: "Juvenil",
    genero: "Femenina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
    staff: [],
    plantilla: [],
    partidos: [
      { id: "jf-j1", fecha: "2027-01-05", hora: "18:30", fase: "Fase de grupos — J1",
        rival: "Castilla-La Mancha", sede: "blanes",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "jf-j2", fecha: "2027-01-06", hora: "18:30", fase: "Fase de grupos — J2",
        rival: "Canarias", sede: "calella",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
  }
];
