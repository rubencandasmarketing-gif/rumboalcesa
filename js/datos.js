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
/* Pendientes de confirmar. Cada sede sigue este formato y los partidos la
   enlazan por su id (sede: "id"). Sin sede, el partido sale sin pabellón.
     { id: "pabellon-1", nombre: "Pabellón ...", municipio: "...",
       direccion: "", mapa: "https://maps.google.com/?q=..." } */
export const SEDES = [];

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
   Plantilla: nombre y club, en el orden de la convocatoria oficial. dorsal,
   posicion y foto son opcionales: se añaden a cada ficha cuando se tengan
     { dorsal: 7, nombre: "...", posicion: "Central", club: "...", foto: "img/jugadores/..." }
   Staff: se muestra tal cual, en este orden (el del boletín de la federación).
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
    staff: [
      { rol: "Director deportivo", nombre: "Jorge Martínez Martínez", foto: "" },
      { rol: "Entrenador/a", nombre: "Sergio Bao Nicieza", foto: "" },
      { rol: "Entrenador/a", nombre: "Rubén Rozada Doval", foto: "" },
      { rol: "Entrenador/a de porteros", nombre: "Antonio Suárez Crespo", foto: "" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "" },
      { rol: "Delegado/a", nombre: "Eduardo Valdés Menéndez", foto: "" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Juan José Estupiñán Freire", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Diego Reyero González", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Carlos Fernández Fernández", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Yago Sol Colmenero", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Bruno Rosal Sutil", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Abraham Vázquez Oliveira", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Pelayo García-Rendueles Gutiérrez", club: "C.D. Villa de Luanco", foto: "" },
      { nombre: "Hugo Orozco Calviño", club: "C.D. Villa de Luanco", foto: "" },
      { nombre: "Raúl Heres Fernández", club: "C.D. Villa de Luanco", foto: "" },
      { nombre: "Daniel Fernández Álvarez", club: "C.D. Villa de Luanco", foto: "" },
      { nombre: "Martín García-Rovés Álvarez", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "" },
      { nombre: "Martín López Hervés", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "" },
      { nombre: "Lucas Novoa Fernández", club: "Club Balonmano Vetusta", foto: "" },
      { nombre: "Rodrigo Villapún Sánchez", club: "Real Grupo de Cultura Covadonga", foto: "" },
      { nombre: "Adrián Álvarez Ancizu", club: "Real Grupo de Cultura Covadonga", foto: "" },
      { nombre: "Javier Suárez del Valle", club: "Real Grupo de Cultura Covadonga", foto: "" }
    ],
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
    staff: [
      { rol: "Director deportivo", nombre: "Jorge Martínez Martínez", foto: "" },
      { rol: "Director técnico", nombre: "Sergio Bao Nicieza", foto: "" },
      { rol: "Entrenador/a", nombre: "Lucía Parajón Fernández", foto: "" },
      { rol: "Entrenador/a", nombre: "Nerea García González", foto: "" },
      { rol: "Entrenador/a de porteros", nombre: "Antonio Suárez Crespo", foto: "" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "" },
      { rol: "Delegado/a", nombre: "Sandra Pascual Castedo", foto: "" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Paula Bustio Tejero", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Ana Fernández Fernández", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Daniella Fernández González", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Noah Díaz Braña", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Paola Fernández Nedelcu", club: "Club Balonmano La Calzada", foto: "" },
      { nombre: "Laura Junco Rodrígues", club: "Club Balonmano Ribadesella", foto: "" },
      { nombre: "Leire Martínez Mier", club: "Club Balonmano Ribadesella", foto: "" },
      { nombre: "Deva Fanjul Rodríguez", club: "Club Balonmano Xuntura Base Oviedo", foto: "" },
      { nombre: "Llara Sanz Paredes", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Vera Rodríguez Suárez", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Victoria Mortera Nguyen", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Inés González Lucchelli", club: "Real Grupo de Cultura Covadonga", foto: "" },
      { nombre: "Sara Cienfuegos González", club: "Siero Deportivo Balonmano", foto: "" },
      { nombre: "Celia del Pozo Corrales", club: "Siero Deportivo Balonmano", foto: "" },
      { nombre: "Daniela Rodríguez Ramos", club: "Siero Deportivo Balonmano", foto: "" },
      { nombre: "Sara Fernández García", club: "Siero Deportivo Balonmano", foto: "" }
    ],
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
    staff: [
      { rol: "Director deportivo", nombre: "Jorge Martínez Martínez", foto: "" },
      { rol: "Director técnico", nombre: "Sergio Bao Nicieza", foto: "" },
      { rol: "Entrenador/a", nombre: "Álex Cortina Gallegos", foto: "" },
      { rol: "Entrenador/a", nombre: "José Arconada Ocariz", foto: "" },
      { rol: "Entrenador/a de porteros", nombre: "Antonio Suárez Crespo", foto: "" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "" },
      { rol: "Delegado/a", nombre: "Eduardo Valdés Menéndez", foto: "" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Yago Villa Suárez", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Hugo Millán Berdiales", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Arán Perianes Alonso", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Hugo García Fernández", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "David Dorado Jiménez", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Nicolás Alonso Fernández", club: "Club Balonmano Xuntura Base Oviedo", foto: "" },
      { nombre: "Guillermo Laca García", club: "Club Balonmano Xuntura Base Oviedo", foto: "" },
      { nombre: "Pablo Fernández Velázquez", club: "Club Balonmano Xuntura Base Oviedo", foto: "" },
      { nombre: "Mateo Muñiz Lombao", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "" },
      { nombre: "Itzan Díaz Canteli", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "" },
      { nombre: "Héctor Suárez Salas", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "" },
      { nombre: "Álvaro Olcina Tristán", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "" },
      { nombre: "Pablo Tuset Pérez", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "" },
      { nombre: "Ignacio Pastrana Trincado", club: "Real Grupo de Cultura Covadonga", foto: "" },
      { nombre: "Álvaro Arribas Noval", club: "Real Grupo de Cultura Covadonga", foto: "" },
      { nombre: "Héctor Muñiz Chimeno", club: "Real Grupo de Cultura Covadonga", foto: "" }
    ],
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
    staff: [
      { rol: "Director deportivo", nombre: "Jorge Martínez Martínez", foto: "" },
      { rol: "Director técnico", nombre: "Sergio Bao Nicieza", foto: "" },
      { rol: "Entrenador/a", nombre: "Raúl Vallejo Martínez", foto: "" },
      { rol: "Entrenador/a", nombre: "Ana García Blanco", foto: "" },
      { rol: "Entrenador/a de porteros", nombre: "Antonio Suárez Crespo", foto: "" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "" },
      { rol: "Delegado/a", nombre: "Sandra Pascual Castedo", foto: "" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Teresa Álvarez Martínez", club: "Asociación Atlética Avilesina", foto: "" },
      { nombre: "Naia Centeno Pérez", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Vera Estrada Zamarreño", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Sara Valdés Cadierno", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Telva Fernández Fernández", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Rocío Castro Acevedo", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Cristina Mía Gonta López", club: "Club Balonmano Vetusta", foto: "" },
      { nombre: "Daniela Martínez González", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Alejandra Martínez González", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "María García Calabozo", club: "Codema", foto: "" },
      { nombre: "Sofía García Calabozo", club: "Codema", foto: "" },
      { nombre: "Nora Morán Manzano", club: "Codema", foto: "" },
      { nombre: "María Barros Álvarez", club: "Club Balonmano Xuntura Base Oviedo", foto: "" },
      { nombre: "Carmen Hortal Palacios", club: "Siero Deportivo Balonmano", foto: "" },
      { nombre: "Sofía Díaz Ordóñez", club: "Siero Deportivo Balonmano", foto: "" },
      { nombre: "Reyes Fernández Roces", club: "Siero Deportivo Balonmano", foto: "" }
    ],
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
    staff: [
      { rol: "Director deportivo", nombre: "Jorge Martínez Martínez", foto: "" },
      { rol: "Director técnico", nombre: "Sergio Bao Nicieza", foto: "" },
      { rol: "Entrenador/a", nombre: "Ángel C. Perianes Gutiérrez", foto: "" },
      { rol: "Entrenador/a", nombre: "Samuel Tang Martínez Igual", foto: "" },
      { rol: "Entrenador/a de porteros", nombre: "Antonio Suárez Crespo", foto: "" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "" },
      { rol: "Delegado/a", nombre: "Eduardo Valdés Menéndez", foto: "" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Lucas Arias Pérez", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Pablo Noval Pérez", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Saúl Quiñones Prieto", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Pablo Menéndez Santurio", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Iker González Alonso", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Javier López Rey", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Marco García de Diego", club: "Agrupación Balonmano Gijón Jovellanos", foto: "" },
      { nombre: "Hugo González Suárez", club: "Club Balonmano Xuntura Base Oviedo", foto: "" },
      { nombre: "Sergio Joglar Suárez", club: "Club Balonmano Xuntura Base Oviedo", foto: "" },
      { nombre: "Enol Álvarez Fernández", club: "Club Balonmano Xuntura Base Oviedo", foto: "" },
      { nombre: "Manuel Ruiz Blanco", club: "Club Balonmano Xuntura Base Oviedo", foto: "" },
      { nombre: "Alejandro García Gutiérrez", club: "C.D. Villa de Luanco", foto: "" },
      { nombre: "Adrián Peláez Rosel", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "" },
      { nombre: "Mauro Castaño Pérez", club: "Real Grupo de Cultura Covadonga", foto: "" },
      { nombre: "Pelayo Dosil Rodríguez de la Flor", club: "Real Grupo de Cultura Covadonga", foto: "" },
      { nombre: "Xabel Castrillón Rodríguez", club: "Real Grupo de Cultura Covadonga", foto: "" },
      { nombre: "Javier Pastrana Trincado", club: "Real Grupo de Cultura Covadonga", foto: "" },
      { nombre: "Leo Cardeli Rodríguez", club: "Real Grupo de Cultura Covadonga", foto: "" }
    ],
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
    staff: [
      { rol: "Director deportivo", nombre: "Jorge Martínez Martínez", foto: "" },
      { rol: "Director técnico", nombre: "Sergio Bao Nicieza", foto: "" },
      { rol: "Entrenador/a", nombre: "Carmen García-Calvo López", foto: "" },
      { rol: "Entrenador/a", nombre: "Cristina Pevida Díaz", foto: "" },
      { rol: "Entrenador/a de porteros", nombre: "Antonio Suárez Crespo", foto: "" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "" },
      { rol: "Delegado/a", nombre: "Sandra Pascual Castedo", foto: "" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Paula Fernández Morilla", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Ángela Granados González", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Martina Franco Pérez", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Claudia Toledo Hueso", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Elena Peláez Carús", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Nerea Trabanco Suárez", club: "Club Balonmano Gijón", foto: "" },
      { nombre: "Ángela García García", club: "Club Balonmano La Calzada", foto: "" },
      { nombre: "María Laina Villanueva González", club: "Club Balonmano Xuntura Base Oviedo", foto: "" },
      { nombre: "Noa Crespo Castro", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Naia Fernández Álvarez", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Ruth Pozuelo Capín", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Daniela Berdasco Pérez", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Lucía del Corro Ibáñez", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Laura Ordóñez Rodríguez", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Elena García Prieto", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "" },
      { nombre: "Sara García Alonso", club: "Siero Deportivo Balonmano", foto: "" }
    ],
    partidos: []
  }
];
