/* =============================================================================
   DATOS.JS — Asturias, rumbo al CESA
   =============================================================================
   ESTE ES EL ÚNICO ARCHIVO QUE SE TOCA DURANTE EL CAMPEONATO.

   Chuleta rápida (desde el móvil):

   · Empieza un partido  →  estado: "directo"    y rellena youtubeId
   · Termina un partido  →  estado: "finalizado" y rellena golesAsturias/golesRival
   · Llega la galería    →  pega la URL en galeria
   · Entra un patrocinador principal →  patrocinadorPrincipal: activo: true + datos

   youtubeId es SOLO el identificador, no la URL completa:
   https://www.youtube.com/watch?v=dQw4w9WgXcQ  →  youtubeId: "dQw4w9WgXcQ"

   ⚠️ HAY DATOS DE EJEMPLO más abajo (marcados con "EJEMPLO"). Sirven para ver
   los tres estados de partido funcionando y enseñar la web. Bórralos antes de
   publicar datos reales.
   ============================================================================= */

export const CONFIG = {
  nombreSitio: "Asturias, rumbo al CESA",
  descripcion: "Cobertura oficial de las selecciones asturianas de balonmano en el Campeonato de España de Selecciones Autonómicas.",
  dominio: "rumboalcesa.es",            // provisional hasta confirmar registro
  canalYoutube: "",                     // URL del canal, p. ej. "https://www.youtube.com/@..."
  edicion: "CESA 2027",                 // pendiente de confirmar edición y fechas
  contactoPatrocinio: "mailto:info@fbmpa.com", // a dónde apunta "Este espacio puede ser tuyo"

  // Con activo:false, los tres huecos muestran "Este espacio puede ser tuyo"
  patrocinadorPrincipal: {
    activo: false,
    nombre: "",
    logo: "",        // p. ej. "img/patrocinadores/nombre.webp"
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
export const PATROCINADORES = [
  // { nombre: "", logo: "img/patrocinadores/....webp", url: "", nivel: "" }
  // 'nivel' queda listo para cuando la federación defina los niveles.
];

/* --- SELECCIONES ---------------------------------------------------------- */
/* Posiciones: Portero, Extremo izq., Lateral izq., Central, Pivote,
               Lateral der., Extremo der.
   Roles staff: Entrenador/a, Segundo entrenador/a, Delegado/a, Fisioterapeuta */

export const SELECCIONES = [
  {
    id: "infantil-masculina",
    categoria: "Infantil",
    genero: "Masculina",
    escudo: "",
    staff: [],
    plantilla: [],
    partidos: []
  },
  {
    id: "infantil-femenina",
    categoria: "Infantil",
    genero: "Femenina",
    escudo: "",
    staff: [],
    plantilla: [],
    partidos: []
  },
  {
    id: "cadete-masculina",
    categoria: "Cadete",
    genero: "Masculina",
    escudo: "",
    staff: [],
    plantilla: [],
    partidos: []
  },
  {
    id: "cadete-femenina",
    categoria: "Cadete",
    genero: "Femenina",
    escudo: "",
    staff: [],
    plantilla: [],
    partidos: []
  },
  {
    id: "juvenil-masculina",
    categoria: "Juvenil",
    genero: "Masculina",
    escudo: "",

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
        youtubeId: "",
        galeria: ""
      },
      {
        id: "jm-ej2",
        fecha: "2026-08-19",           // ← fecha de hoy a propósito, para que
        hora: "18:30",                 //   salga en "hoy juegan" al enseñar la web
        fase: "Fase de grupos — J2 (EJEMPLO)",
        rival: "Selección Rival B",
        sede: "ejemplo-pumarin",
        estado: "directo",
        golesAsturias: null,
        golesRival: null,
        youtubeId: "",
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
        youtubeId: "",
        galeria: ""
      }
    ]
  },
  {
    id: "juvenil-femenina",
    categoria: "Juvenil",
    genero: "Femenina",
    escudo: "",
    staff: [],
    plantilla: [],
    partidos: []
  }
];
