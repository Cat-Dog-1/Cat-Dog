// Artículos del blog de CatDog
const blogs = [
  {
    id: 1,
    titulo: "¿Por qué los gatos ronronean?",
    resumen: "Descubre las razones detrás de este curioso comportamiento felino y qué significa para su bienestar.",
    imagen: "/img/porque-los-gatos-ronronean-min.jpg",
    parrafos: [
      "El ronroneo es uno de los comportamientos más característicos de los gatos domésticos. Se produce por la vibración rápida de los músculos de la laringe, generando un sonido continuo que puede escucharse tanto al inhalar como al exhalar.",
      "Contrario a lo que muchos piensan, los gatos no solo ronronean cuando están felices: también lo hacen cuando sienten dolor, estrés o incluso al final de su vida, como un posible mecanismo de autoconsuelo. Estudios han sugerido que la frecuencia del ronroneo (entre 25 y 150 Hz) podría tener efectos beneficiosos en la curación de huesos y tejidos.",
      "Si tu gato ronronea con frecuencia mientras te acompaña, probablemente esté expresando comodidad y confianza contigo. ¡Disfruta ese momento!",
    ],
  },
  {
    id: 2,
    titulo: "La importancia del ejercicio diario en perros",
    resumen: "Te contamos cuánto ejercicio necesita tu perro según su raza y edad.",
    imagen: "/img/ejercicio_para_perros_adultos_7916_orig.jpg",
    parrafos: [
      "El ejercicio diario es fundamental para la salud física y emocional de los perros. Ayuda a mantener un peso adecuado, fortalece músculos y articulaciones, y reduce conductas no deseadas causadas por el aburrimiento.",
      "La cantidad de actividad depende de la raza y la edad: razas activas como el Border Collie pueden necesitar más de una hora diaria, mientras que perros pequeños o mayores se conforman con paseos más cortos y tranquilos.",
      "Combina paseos, juegos de buscar y juguetes resistentes para que tu perro se mantenga activo y feliz todos los días.",
    ],
  },
];

export function buscarBlogPorId(id) {
  return blogs.find((b) => b.id === Number(id));
}

export default blogs;
