// Ejecutar con: npm run seed
// Inserta productos de ejemplo en la tabla "productos" (no duplica si ya existen).
import { query, pool } from "./db.js";

const productos = [
  { codigo: "P-001", nombre: "Alimento para Perro Adulto 15kg", descripcion: "Alimento balanceado rico en proteínas y vitaminas.", precio: 24990, stock: 30, stockCritico: 5, categoria: "Alimento", imagen: "img/alimento-perro.jpg" },
  { codigo: "P-002", nombre: "Alimento para Gato 5kg", descripcion: "Fórmula completa que favorece un pelaje sano.", precio: 15990, stock: 20, stockCritico: 5, categoria: "Alimento", imagen: "img/alimento-gato.jpg" },
  { codigo: "P-003", nombre: "Pelota de Goma Resistente", descripcion: "Juguete resistente ideal para morder y buscar.", precio: 4990, stock: 50, stockCritico: 10, categoria: "Juguetes", imagen: "img/pelota.jpg" },
  { codigo: "P-004", nombre: "Correa Ajustable 1.5m", descripcion: "Cómoda y resistente para paseos largos.", precio: 8990, stock: 15, stockCritico: 3, categoria: "Accesorios", imagen: "img/correa.jpg" },
  { codigo: "P-005", nombre: "Cama Acolchada para Mascotas", descripcion: "Suave, lavable, para perros y gatos.", precio: 19990, stock: 10, stockCritico: 2, categoria: "Accesorios", imagen: "img/cama.jpg" },
  { codigo: "P-006", nombre: "Shampoo Antipulgas 500ml", descripcion: "Elimina pulgas y garrapatas sin dañar la piel.", precio: 6990, stock: 25, stockCritico: 5, categoria: "Higiene", imagen: "img/shampoo.jpg" },
];

async function sembrar() {
  for (const p of productos) {
    await query(
      `INSERT INTO productos (codigo, nombre, descripcion, precio, stock, stock_critico, categoria, imagen)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (codigo) DO NOTHING`,
      [p.codigo, p.nombre, p.descripcion, p.precio, p.stock, p.stockCritico, p.categoria, p.imagen]
    );
  }
  console.log(`✔ ${productos.length} productos verificados/insertados en Neon.`);
  await pool.end();
}

sembrar().catch((err) => {
  console.error("Error al sembrar datos:", err);
  process.exit(1);
});
