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
  // EJEMPLO — borrar y sustituir por las sedes reales
  {
    id: "ejemplo-pumarin",
    nombre: "Palacio de los Deportes (EJEMPLO)",
    municipio: "Oviedo",
    direccion: "C/ Río Caudal, s/n",
    mapa: "https://maps.google.com/?q=Palacio+de+los+Deportes+Oviedo"
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
    partidos: []
  },
  {
    id: "infantil-femenina",
    categoria: "Infantil",
    genero: "Femenina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
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
    staff: [
      // PRUEBA con foto real — completar nombre
      { nombre: "Completar nombre", rol: "Entrenador", foto: "img/jugadores/cadete-masculina/staff-entrenador.webp" }
    ],
    plantilla: [
      // PRUEBA con foto real — completar posición y club
      { dorsal: 6, nombre: "Marco (completar apellidos)", posicion: "Completar posición", club: "Completar club", foto: "img/jugadores/cadete-masculina/06-marco.webp" }
    ],
    partidos: []
  },
  {
    id: "cadete-femenina",
    categoria: "Cadete",
    genero: "Femenina",
    escudo: "",
    portada: "",   // foto de ambiente propia para la cabecera (opcional): "img/ambiente/....webp"
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
      // EJEMPLO — tres partidos, uno por estado, para ver la interfaz. Borrar.
      {
        id: "jm-ej1",
        fecha: "2027-01-03",
        hora: "10:00",
        fase: "Fase de grupos — J1 (EJEMPLO)",
        rival: "Selección Rival A",
        sede: "ejemplo-pumarin",
        estado: "finalizado",
        golesAsturias: 31,
        golesRival: 27,
        youtubeId: "RyMJQqWtAjs",   // demo del enlace a la repetición
        galeria: ""
      },
      {
        id: "jm-ej2",
        fecha: "2027-01-04",
        hora: "18:30",
        fase: "Fase de grupos — J2 (EJEMPLO)",
        rival: "Selección Rival B",
        sede: "ejemplo-pumarin",
        estado: "programado",
        golesAsturias: null,
        golesRival: null,
        youtubeId: "RyMJQqWtAjs",   // partido real del año pasado, de ejemplo
        galeria: ""
      },
      {
        id: "jm-ej3",
        fecha: "2027-01-05",
        hora: "12:00",
        fase: "Fase de grupos — J3 (EJEMPLO)",
        rival: "Selección Rival C",
        sede: "ejemplo-pumarin",
        estado: "programado",
        golesAsturias: null,
        golesRival: null,
        youtubeId: "",     // ← ponlo en cuanto el directo esté programado en YouTube
        galeria: ""
      }
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
    partidos: []
  }
];
