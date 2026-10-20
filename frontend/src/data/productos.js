// Catálogo de productos de CatDog (mismos datos que js/productos.js)
const productos = [
  { id: 1, nombre: "Alimento para Perro Adulto 15kg", precio: 24990, categoria: "Alimento", stock: 30, stockCritico: 5,
    imagen: "/img/perro_alimento.jpg",
    descripcion: "Alimento balanceado para perros adultos, rico en proteínas y vitaminas." },
  { id: 2, nombre: "Alimento para Gato 5kg", precio: 15990, categoria: "Alimento", stock: 20, stockCritico: 5,
    imagen: "/img/leonardosalmon.2-1.jpg",
    descripcion: "Fórmula completa para gatos adultos, favorece un pelaje sano." },
  { id: 3, nombre: "Pelota de Goma Resistente", precio: 4990, categoria: "Juguetes", stock: 50, stockCritico: 10,
    imagen: "/img/pelota.jpg",
    descripcion: "Juguete resistente para perros, ideal para juegos de buscar y morder." },
  { id: 4, nombre: "Correa Ajustable 1.5m", precio: 8990, categoria: "Accesorios", stock: 15, stockCritico: 3,
    imagen: "/img/correa.jpg",
    descripcion: "Correa resistente y ajustable, cómoda para paseos largos." },
  { id: 5, nombre: "Cama Acolchada para Mascotas", precio: 19990, categoria: "Accesorios", stock: 10, stockCritico: 2,
    imagen: "/img/cama.jpg",
    descripcion: "Cama suave y lavable, disponible para perros y gatos de distintos tamaños." },
  { id: 6, nombre: "Shampoo Antipulgas 500ml", precio: 6990, categoria: "Higiene", stock: 25, stockCritico: 5,
    imagen: "/img/shampoo.jpg",
    descripcion: "Shampoo especial que elimina pulgas y garrapatas sin dañar la piel." },
  { id: 7, nombre: "Rascador para Gatos", precio: 22990, categoria: "Accesorios", stock: 8, stockCritico: 2,
    imagen: "/img/rascador.jpg",
    descripcion: "Rascador de sisal con plataforma, ideal para el afilado de uñas." },
  { id: 8, nombre: "Arena Sanitaria 10kg", precio: 9990, categoria: "Higiene", stock: 40, stockCritico: 8,
    imagen: "/img/arena.jpg",
    descripcion: "Arena aglomerante de alta absorción y control de olores." },
];

export function buscarProductoPorId(id) {
  return productos.find((p) => p.id === Number(id));
}

export function formatearPrecio(valor) {
  return Number(valor).toLocaleString("es-CL");
}

export const categorias = ["Alimento", "Juguetes", "Accesorios", "Higiene"];

export default productos;
