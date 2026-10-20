// Ejecutar con: npm run seed
// 1) Crea (o actualiza) las tablas usando schema.sql
// 2) Inserta/actualiza los 8 productos de la tienda
// 3) Crea el usuario administrador de prueba
// Se puede correr varias veces sin duplicar nada.
import { readFile } from "node:fs/promises";
import bcrypt from "bcryptjs";
import { query, pool } from "./db.js";

const productos = [
  { codigo: "P-001", nombre: "Alimento para Perro Adulto 15kg", descripcion: "Alimento balanceado para perros adultos, rico en proteínas y vitaminas.", precio: 24990, stock: 30, stockCritico: 5, categoria: "Alimento", imagen: "img/perro_alimento.jpg" },
  { codigo: "P-002", nombre: "Alimento para Gato 5kg", descripcion: "Fórmula completa para gatos adultos, favorece un pelaje sano.", precio: 15990, stock: 20, stockCritico: 5, categoria: "Alimento", imagen: "img/leonardosalmon.2-1.jpg" },
  { codigo: "P-003", nombre: "Pelota de Goma Resistente", descripcion: "Juguete resistente para perros, ideal para juegos de buscar y morder.", precio: 4990, stock: 50, stockCritico: 10, categoria: "Juguetes", imagen: "img/pelota.jpg" },
  { codigo: "P-004", nombre: "Correa Ajustable 1.5m", descripcion: "Correa resistente y ajustable, cómoda para paseos largos.", precio: 8990, stock: 15, stockCritico: 3, categoria: "Accesorios", imagen: "img/correa.jpg" },
  { codigo: "P-005", nombre: "Cama Acolchada para Mascotas", descripcion: "Cama suave y lavable, disponible para perros y gatos de distintos tamaños.", precio: 19990, stock: 10, stockCritico: 2, categoria: "Accesorios", imagen: "img/cama.jpg" },
  { codigo: "P-006", nombre: "Shampoo Antipulgas 500ml", descripcion: "Shampoo especial que elimina pulgas y garrapatas sin dañar la piel.", precio: 6990, stock: 25, stockCritico: 5, categoria: "Higiene", imagen: "img/shampoo.jpg" },
  { codigo: "P-007", nombre: "Rascador para Gatos", descripcion: "Rascador de sisal con plataforma, ideal para el afilado de uñas.", precio: 22990, stock: 8, stockCritico: 2, categoria: "Accesorios", imagen: "img/rascador.jpg" },
  { codigo: "P-008", nombre: "Arena Sanitaria 10kg", descripcion: "Arena aglomerante de alta absorción y control de olores.", precio: 9990, stock: 40, stockCritico: 8, categoria: "Higiene", imagen: "img/arena.jpg" },
];

// Usuario administrador para entrar al panel /admin
const ADMIN = {
  run: "11111111K",
  nombre: "Admin",
  apellidos: "CatDog",
  correo: "admin@duoc.cl",
  clave: "admin123",
};

async function sembrar() {
  const schema = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
  await query(schema);
  console.log("✔ Tablas creadas/actualizadas.");

  for (const p of productos) {
    await query(
      `INSERT INTO productos (codigo, nombre, descripcion, precio, stock, stock_critico, categoria, imagen)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (codigo) DO UPDATE
         SET nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion,
             categoria = EXCLUDED.categoria, imagen = EXCLUDED.imagen`,
      [p.codigo, p.nombre, p.descripcion, p.precio, p.stock, p.stockCritico, p.categoria, p.imagen]
    );
  }
  console.log(`✔ ${productos.length} productos listos.`);

  const claveHash = await bcrypt.hash(ADMIN.clave, 10);
  await query(
    `INSERT INTO usuarios (run, nombre, apellidos, correo, clave_hash, tipo_usuario, region, comuna, direccion)
     VALUES ($1,$2,$3,$4,$5,'Administrador','Región Metropolitana de Santiago','Santiago','Av. Principal 123')
     ON CONFLICT (correo) DO UPDATE SET tipo_usuario = 'Administrador'`,
    [ADMIN.run, ADMIN.nombre, ADMIN.apellidos, ADMIN.correo, claveHash]
  );
  console.log(`✔ Administrador listo: ${ADMIN.correo} / ${ADMIN.clave}`);

  await pool.end();
}

sembrar().catch((err) => {
  console.error("Error al sembrar datos:", err);
  process.exit(1);
});
