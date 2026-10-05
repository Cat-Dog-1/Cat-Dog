import { Router } from "express";
import { query } from "../db.js";

const router = Router();

// GET /api/productos  -> lista completa
router.get("/", async (req, res) => {
  try {
    const resultado = await query("SELECT * FROM productos ORDER BY id ASC");
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// GET /api/productos/:id  -> detalle de un producto
router.get("/:id", async (req, res) => {
  try {
    const resultado = await query("SELECT * FROM productos WHERE id = $1", [req.params.id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// POST /api/productos  -> crear producto (para vista admin, a futuro)
router.post("/", async (req, res) => {
  const { codigo, nombre, descripcion, precio, stock, stockCritico, categoria, imagen } = req.body;
  if (!codigo || !nombre || precio == null || stock == null || !categoria) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  try {
    const resultado = await query(
      `INSERT INTO productos (codigo, nombre, descripcion, precio, stock, stock_critico, categoria, imagen)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [codigo, nombre, descripcion || null, precio, stock, stockCritico || 0, categoria, imagen || null]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

export default router;
