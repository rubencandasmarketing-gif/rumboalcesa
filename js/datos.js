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

   Calendario de la fase de grupos: hoja "CALENDARIOS CESA 27" (rival de
   cada día, del 3 al 4-5 de enero de 2027). Horas y sedes, por confirmar:
   con hora: "" la web pone "Hora por confirmar" (y el partido nunca se marca
   "en juego" solo) y con sede: "" pone "Sede por confirmar". Los cruces y la fase final (hasta el 8 de
   enero) se añaden cuando se conozcan los rivales.
   Cada partido sigue este formato (sede: id de SEDES):
     { id: "im-j1", fecha: "2027-01-03", hora: "10:00", fase: "Fase de grupos — J1",
       rival: "La Rioja", sede: "",
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
/* Pendientes de confirmar: con sede: "" el partido pone "Sede por confirmar".
   Cuando se publiquen, añadir aquí cada sede y enlazarla desde el partido por
   su id (sede: "id"). Con mapa, el nombre enlaza a Google Maps.
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
    nombre: "Confía",
    logo: "img/patrocinadores/confia.svg",
    url: "https://www.confia.es/",
    nivel: ""
  },
  {
    nombre: "Cajamar Caja Rural",
    logo: "img/patrocinadores/cajamar.jpg",
    url: "https://www.cajamar.es/es/comun/",
    nivel: ""
  },
  {
    nombre: "Excade",
    logo: "img/patrocinadores/excade.jpg",
    url: "https://www.excade.com/",
    nivel: ""
  },
  {
    nombre: "Deporte Asturiano",
    logo: "img/patrocinadores/deporte-asturiano.png",
    url: "https://deporteasturiano.org/",
    nivel: "",
    fondo: "#0119A9"
  }
];

/* --- SELECCIONES ---------------------------------------------------------- */
/* Posiciones: Portero, Extremo izq., Lateral izq., Central, Pivote,
               Lateral der., Extremo der.
   Plantilla: nombre y club, en el orden de la convocatoria oficial. dorsal,
   posicion y foto son opcionales: se añaden a cada ficha cuando se tengan
     { dorsal: 7, nombre: "...", posicion: "Central", club: "...", foto: "img/jugadores/..." }
   Staff: se muestra tal cual, en este orden (el del boletín de la federación).
   El cargo va ya en masculino o femenino según la persona (Entrenador /
   Entrenadora, Delegado / Delegada), no con "/a".
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
      { rol: "Entrenador", nombre: "Sergio Bao Nicieza", foto: "" },
      { rol: "Entrenador", nombre: "Rubén Rozada Doval", foto: "" },
      { rol: "Entrenador de porteros", nombre: "Antonio Suárez Crespo", foto: "img/staff/antonio-suarez-crespo.webp" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "img/staff/patricia-tejero-alvarez.webp" },
      { rol: "Delegado", nombre: "Eduardo Valdés Menéndez", foto: "" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Juan José Estupiñán Freire", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/infantil-masculina/juan-jose-estupinan-freire.webp" },
      { nombre: "Diego Reyero González", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/infantil-masculina/diego-reyero-gonzalez.webp" },
      { nombre: "Carlos Fernández Fernández", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/infantil-masculina/carlos-fernandez-fernandez.webp" },
      { nombre: "Yago Sol Colmenero", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/infantil-masculina/yago-sol-colmenero.webp" },
      { nombre: "Bruno Rosal Sutil", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/infantil-masculina/bruno-rosal-sutil.webp" },
      { nombre: "Abraham Vázquez Oliveira", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/infantil-masculina/abraham-vazquez-oliveira.webp" },
      { nombre: "Pelayo García-Rendueles Gutiérrez", club: "C.D. Villa de Luanco", foto: "img/jugadores/infantil-masculina/pelayo-garcia-rendueles-gutierrez.webp" },
      { nombre: "Hugo Orozco Calviño", club: "C.D. Villa de Luanco", foto: "img/jugadores/infantil-masculina/hugo-orozco-calvino.webp" },
      { nombre: "Raúl Heres Fernández", club: "C.D. Villa de Luanco", foto: "img/jugadores/infantil-masculina/raul-heres-fernandez.webp" },
      { nombre: "Daniel Fernández Álvarez", club: "C.D. Villa de Luanco", foto: "img/jugadores/infantil-masculina/daniel-fernandez-alvarez.webp" },
      { nombre: "Martín García-Rovés Álvarez", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "img/jugadores/infantil-masculina/martin-garcia-roves-alvarez.webp" },
      { nombre: "Martín López Hervés", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "img/jugadores/infantil-masculina/martin-lopez-herves.webp" },
      { nombre: "Lucas Novoa Fernández", club: "Club Balonmano Vetusta", foto: "img/jugadores/infantil-masculina/lucas-novoa-fernandez.webp" },
      { nombre: "Rodrigo Villapún Sánchez", club: "Real Grupo de Cultura Covadonga", foto: "img/jugadores/infantil-masculina/rodrigo-villapun-sanchez.webp" },
      { nombre: "Adrián Álvarez Ancizu", club: "Real Grupo de Cultura Covadonga", foto: "img/jugadores/infantil-masculina/adrian-alvarez-ancizu.webp" },
      { nombre: "Javier Suárez del Valle", club: "Real Grupo de Cultura Covadonga", foto: "img/jugadores/infantil-masculina/javier-suarez-del-valle.webp" }
    ],
    partidos: [
      { id: "im-j1", fecha: "2027-01-03", hora: "", fase: "Fase de grupos — J1",
        rival: "La Rioja", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "im-j2", fecha: "2027-01-04", hora: "", fase: "Fase de grupos — J2",
        rival: "Melilla", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "im-j3", fecha: "2027-01-04", hora: "", fase: "Fase de grupos — J3",
        rival: "Canarias", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
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
      { rol: "Entrenadora", nombre: "Lucía Parajón Fernández", foto: "img/staff/lucia-parajon-fernandez.webp" },
      { rol: "Entrenadora", nombre: "Nerea García González", foto: "img/staff/nerea-garcia-gonzalez.webp" },
      { rol: "Entrenador de porteras", nombre: "Antonio Suárez Crespo", foto: "img/staff/antonio-suarez-crespo.webp" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "img/staff/patricia-tejero-alvarez.webp" },
      { rol: "Delegada", nombre: "Sandra Pascual Castedo", foto: "img/staff/sandra-pascual-castedo.webp" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Paula Bustio Tejero", club: "Club Balonmano Gijón", foto: "img/jugadores/infantil-femenina/paula-bustio-tejero.webp" },
      { nombre: "Ana Fernández Fernández", club: "Club Balonmano Gijón", foto: "img/jugadores/infantil-femenina/ana-fernandez-fernandez.webp" },
      { nombre: "Daniella Fernández González", club: "Club Balonmano Gijón", foto: "img/jugadores/infantil-femenina/daniella-fernandez-gonzalez.webp" },
      { nombre: "Noah Díaz Braña", club: "Club Balonmano Gijón", foto: "img/jugadores/infantil-femenina/noah-diaz-brana.webp" },
      { nombre: "Paola Fernández Nedelcu", club: "Club Balonmano La Calzada", foto: "img/jugadores/infantil-femenina/paola-fernandez-nedelcu.webp" },
      { nombre: "Laura Junco Rodrígues", club: "Club Balonmano Ribadesella", foto: "img/jugadores/infantil-femenina/laura-junco-rodrigues.webp" },
      { nombre: "Leire Martínez Mier", club: "Club Balonmano Ribadesella", foto: "img/jugadores/infantil-femenina/leire-martinez-mier.webp" },
      { nombre: "Deva Fanjul Rodríguez", club: "Club Balonmano Xuntura Base Oviedo", foto: "img/jugadores/infantil-femenina/deva-fanjul-rodriguez.webp" },
      { nombre: "Llara Sanz Paredes", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/infantil-femenina/llara-sanz-paredes.webp" },
      { nombre: "Vera Rodríguez Suárez", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/infantil-femenina/vera-rodriguez-suarez.webp" },
      { nombre: "Victoria Mortera Nguyen", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/infantil-femenina/victoria-mortera-nguyen.webp" },
      { nombre: "Inés González Lucchelli", club: "Real Grupo de Cultura Covadonga", foto: "img/jugadores/infantil-femenina/ines-gonzalez-lucchelli.webp" },
      { nombre: "Sara Cienfuegos González", club: "Siero Deportivo Balonmano", foto: "img/jugadores/infantil-femenina/sara-cienfuegos-gonzalez.webp" },
      { nombre: "Celia del Pozo Corrales", club: "Siero Deportivo Balonmano", foto: "img/jugadores/infantil-femenina/celia-del-pozo-corrales.webp" },
      { nombre: "Daniela Rodríguez Ramos", club: "Siero Deportivo Balonmano", foto: "img/jugadores/infantil-femenina/daniela-rodriguez-ramos.webp" },
      { nombre: "Sara Fernández García", club: "Siero Deportivo Balonmano", foto: "img/jugadores/infantil-femenina/sara-fernandez-garcia.webp" }
    ],
    partidos: [
      { id: "if-j1", fecha: "2027-01-03", hora: "", fase: "Fase de grupos — J1",
        rival: "Región de Murcia", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "if-j2", fecha: "2027-01-04", hora: "", fase: "Fase de grupos — J2",
        rival: "Baleares", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "if-j3", fecha: "2027-01-04", hora: "", fase: "Fase de grupos — J3",
        rival: "Ceuta", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
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
      { rol: "Entrenador", nombre: "Álex Cortina Gallegos", foto: "img/staff/alex-cortina-gallegos.webp" },
      { rol: "Entrenador", nombre: "José Arconada Ocariz", foto: "img/staff/jose-arconada-ocariz.webp" },
      { rol: "Entrenador de porteros", nombre: "Antonio Suárez Crespo", foto: "img/staff/antonio-suarez-crespo.webp" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "img/staff/patricia-tejero-alvarez.webp" },
      { rol: "Delegado", nombre: "Eduardo Valdés Menéndez", foto: "" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Yago Villa Suárez", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/cadete-masculina/yago-villa-suarez.webp" },
      { nombre: "Hugo Millán Berdiales", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/cadete-masculina/hugo-millan-berdiales.webp" },
      { nombre: "Arán Perianes Alonso", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/cadete-masculina/aran-perianes-alonso.webp" },
      { nombre: "Hugo García Fernández", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/cadete-masculina/hugo-garcia-fernandez.webp" },
      { nombre: "David Dorado Jiménez", club: "Agrupación Balonmano Gijón Jovellanos", foto: "img/jugadores/cadete-masculina/david-dorado-jimenez.webp" },
      { nombre: "Nicolás Alonso Fernández", club: "Club Balonmano Xuntura Base Oviedo", foto: "img/jugadores/cadete-masculina/nicolas-alonso-fernandez.webp" },
      { nombre: "Guillermo Laca García", club: "Club Balonmano Xuntura Base Oviedo", foto: "img/jugadores/cadete-masculina/guillermo-laca-garcia.webp" },
      { nombre: "Pablo Fernández Velázquez", club: "Club Balonmano Xuntura Base Oviedo", foto: "img/jugadores/cadete-masculina/pablo-fernandez-velazquez.webp" },
      { nombre: "Mateo Muñiz Lombao", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "img/jugadores/cadete-masculina/mateo-muniz-lombao.webp" },
      { nombre: "Itzan Díaz Canteli", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "img/jugadores/cadete-masculina/itzan-diaz-canteli.webp" },
      { nombre: "Héctor Suárez Salas", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "img/jugadores/cadete-masculina/hector-suarez-salas.webp" },
      { nombre: "Álvaro Olcina Tristán", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "img/jugadores/cadete-masculina/alvaro-olcina-tristan.webp" },
      { nombre: "Pablo Tuset Pérez", club: "G.D. Bosco – Asociación Atlética Avilesina", foto: "img/jugadores/cadete-masculina/pablo-tuset-perez.webp" },
      { nombre: "Ignacio Pastrana Trincado", club: "Real Grupo de Cultura Covadonga", foto: "img/jugadores/cadete-masculina/ignacio-pastrana-trincado.webp" },
      { nombre: "Álvaro Arribas Noval", club: "Real Grupo de Cultura Covadonga", foto: "img/jugadores/cadete-masculina/alvaro-arribas-noval.webp" },
      { nombre: "Héctor Muñiz Chimeno", club: "Real Grupo de Cultura Covadonga", foto: "img/jugadores/cadete-masculina/hector-muniz-chimeno.webp" }
    ],
    partidos: [
      { id: "cm-j1", fecha: "2027-01-03", hora: "", fase: "Fase de grupos — J1",
        rival: "Navarra", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "cm-j2", fecha: "2027-01-04", hora: "", fase: "Fase de grupos — J2",
        rival: "Extremadura", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
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
      { rol: "Entrenador", nombre: "Raúl Vallejo Martínez", foto: "img/staff/raul-vallejo-martinez.webp" },
      { rol: "Entrenadora", nombre: "Ana García Blanco", foto: "" },
      { rol: "Entrenador de porteras", nombre: "Antonio Suárez Crespo", foto: "img/staff/antonio-suarez-crespo.webp" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "img/staff/patricia-tejero-alvarez.webp" },
      { rol: "Delegada", nombre: "Sandra Pascual Castedo", foto: "img/staff/sandra-pascual-castedo.webp" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Teresa Álvarez Martínez", club: "Asociación Atlética Avilesina", foto: "img/jugadores/cadete-femenina/teresa-alvarez-martinez.webp" },
      { nombre: "Naia Centeno Pérez", club: "Club Balonmano Gijón", foto: "img/jugadores/cadete-femenina/naia-centeno-perez.webp" },
      { nombre: "Vera Estrada Zamarreño", club: "Club Balonmano Gijón", foto: "img/jugadores/cadete-femenina/vera-estrada-zamarreno.webp" },
      { nombre: "Sara Valdés Cadierno", club: "Club Balonmano Gijón", foto: "img/jugadores/cadete-femenina/sara-valdes-cadierno.webp" },
      { nombre: "Telva Fernández Fernández", club: "Club Balonmano Gijón", foto: "img/jugadores/cadete-femenina/telva-fernandez-fernandez.webp" },
      { nombre: "Rocío Castro Acevedo", club: "Club Balonmano Gijón", foto: "img/jugadores/cadete-femenina/rocio-castro-acevedo.webp" },
      { nombre: "Cristina Mía Gonta López", club: "Club Balonmano Vetusta", foto: "img/jugadores/cadete-femenina/cristina-mia-gonta-lopez.webp" },
      { nombre: "Daniela Martínez González", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/cadete-femenina/daniela-martinez-gonzalez.webp" },
      { nombre: "Alejandra Martínez González", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/cadete-femenina/alejandra-martinez-gonzalez.webp" },
      { nombre: "María García Calabozo", club: "Codema", foto: "img/jugadores/cadete-femenina/maria-garcia-calabozo.webp" },
      { nombre: "Sofía García Calabozo", club: "Codema", foto: "img/jugadores/cadete-femenina/sofia-garcia-calabozo.webp" },
      { nombre: "Nora Morán Manzano", club: "Codema", foto: "img/jugadores/cadete-femenina/nora-moran-manzano.webp" },
      { nombre: "María Barros Álvarez", club: "Club Balonmano Xuntura Base Oviedo", foto: "img/jugadores/cadete-femenina/maria-barros-alvarez.webp" },
      { nombre: "Carmen Hortal Palacios", club: "Siero Deportivo Balonmano", foto: "img/jugadores/cadete-femenina/carmen-hortal-palacios.webp" },
      { nombre: "Sofía Díaz Ordóñez", club: "Siero Deportivo Balonmano", foto: "img/jugadores/cadete-femenina/sofia-diaz-ordonez.webp" },
      { nombre: "Reyes Fernández Roces", club: "Siero Deportivo Balonmano", foto: "img/jugadores/cadete-femenina/reyes-fernandez-roces.webp" }
    ],
    partidos: [
      { id: "cf-j1", fecha: "2027-01-03", hora: "", fase: "Fase de grupos — J1",
        rival: "Cantabria", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "cf-j2", fecha: "2027-01-04", hora: "", fase: "Fase de grupos — J2",
        rival: "La Rioja", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
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
      { rol: "Entrenador", nombre: "Ángel C. Perianes Gutiérrez", foto: "" },
      { rol: "Entrenador", nombre: "Samuel Tang Martínez Igual", foto: "" },
      { rol: "Entrenador de porteros", nombre: "Antonio Suárez Crespo", foto: "img/staff/antonio-suarez-crespo.webp" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "img/staff/patricia-tejero-alvarez.webp" },
      { rol: "Delegado", nombre: "Eduardo Valdés Menéndez", foto: "" },
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
    partidos: [
      { id: "jm-j1", fecha: "2027-01-03", hora: "", fase: "Fase de grupos — J1",
        rival: "Cantabria", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "jm-j2", fecha: "2027-01-04", hora: "", fase: "Fase de grupos — J2",
        rival: "Canarias", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
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
      { rol: "Entrenadora", nombre: "Carmen García-Calvo López", foto: "img/staff/carmen-garcia-calvo-lopez.webp" },
      { rol: "Entrenadora", nombre: "Cristina Pevida Díaz", foto: "img/staff/cristina-pevida-diaz.webp" },
      { rol: "Entrenador de porteras", nombre: "Antonio Suárez Crespo", foto: "img/staff/antonio-suarez-crespo.webp" },
      { rol: "Fisioterapeuta", nombre: "Patricia Tejero Álvarez", foto: "img/staff/patricia-tejero-alvarez.webp" },
      { rol: "Delegada", nombre: "Sandra Pascual Castedo", foto: "img/staff/sandra-pascual-castedo.webp" },
      { rol: "Responsable de selecciones", nombre: "Francisco Cimadevilla Pérez", foto: "" }
    ],
    plantilla: [
      { nombre: "Paula Fernández Morilla", club: "Club Balonmano Gijón", foto: "img/jugadores/juvenil-femenina/paula-fernandez-morilla.webp" },
      { nombre: "Ángela Granados González", club: "Club Balonmano Gijón", foto: "img/jugadores/juvenil-femenina/angela-granados-gonzalez.webp" },
      { nombre: "Martina Franco Pérez", club: "Club Balonmano Gijón", foto: "img/jugadores/juvenil-femenina/martina-franco-perez.webp" },
      { nombre: "Claudia Toledo Hueso", club: "Club Balonmano Gijón", foto: "img/jugadores/juvenil-femenina/claudia-toledo-hueso.webp" },
      { nombre: "Elena Peláez Carús", club: "Club Balonmano Gijón", foto: "img/jugadores/juvenil-femenina/elena-pelaez-carus.webp" },
      { nombre: "Nerea Trabanco Suárez", club: "Club Balonmano Gijón", foto: "img/jugadores/juvenil-femenina/nerea-trabanco-suarez.webp" },
      { nombre: "Ángela García García", club: "Club Balonmano La Calzada", foto: "img/jugadores/juvenil-femenina/angela-garcia-garcia.webp" },
      { nombre: "María Laina Villanueva González", club: "Club Balonmano Xuntura Base Oviedo", foto: "img/jugadores/juvenil-femenina/maria-laina-villanueva-gonzalez.webp" },
      { nombre: "Noa Crespo Castro", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/juvenil-femenina/noa-crespo-castro.webp" },
      { nombre: "Naia Fernández Álvarez", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/juvenil-femenina/naia-fernandez-alvarez.webp" },
      { nombre: "Ruth Pozuelo Capín", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/juvenil-femenina/ruth-pozuelo-capin.webp" },
      { nombre: "Daniela Berdasco Pérez", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/juvenil-femenina/daniela-berdasco-perez.webp" },
      { nombre: "Lucía del Corro Ibáñez", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/juvenil-femenina/lucia-del-corro-ibanez.webp" },
      { nombre: "Laura Ordóñez Rodríguez", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/juvenil-femenina/laura-ordonez-rodriguez.webp" },
      { nombre: "Elena García Prieto", club: "Club Deportivo Básico Oviedo Balonmano Femenino", foto: "img/jugadores/juvenil-femenina/elena-garcia-prieto.webp" },
      { nombre: "Sara García Alonso", club: "Siero Deportivo Balonmano", foto: "img/jugadores/juvenil-femenina/sara-garcia-alonso.webp" }
    ],
    partidos: [
      { id: "jf-j1", fecha: "2027-01-03", hora: "", fase: "Fase de grupos — J1",
        rival: "Canarias", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "jf-j2", fecha: "2027-01-04", hora: "", fase: "Fase de grupos — J2",
        rival: "Cantabria", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" },
      { id: "jf-j3", fecha: "2027-01-05", hora: "", fase: "Fase de grupos — J3",
        rival: "Región de Murcia", sede: "",
        estado: "programado", golesAsturias: null, golesRival: null, youtubeId: "", galeria: "" }
    ]
  }
];
