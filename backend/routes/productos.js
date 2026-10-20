import { Router } from "express";
import { query } from "../db.js";
import { verificarToken, soloAdmin } from "../middleware/auth.js";

const router = Router();

// Revisa los datos de un producto antes de guardarlo
function validarProducto({ codigo, nombre, precio, stock, categoria }) {
  if (!codigo || String(codigo).trim().length < 3) return "El código debe tener al menos 3 caracteres";
  if (!nombre || String(nombre).trim().length > 100) return "El nombre es obligatorio (máx. 100)";
  if (precio === undefined || precio === "" || Number(precio) < 0) return "El precio no puede ser negativo";
  if (stock === undefined || stock === "" || Number(stock) < 0 || !Number.isInteger(Number(stock))) return "El stock debe ser un entero no negativo";
  if (!categoria) return "La categoría es obligatoria";
  return null;
}

// GET /api/productos  -> lista completa (pública)
router.get("/", async (req, res) => {
  try {
    const resultado = await query("SELECT * FROM productos ORDER BY id ASC");
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// GET /api/productos/:id  -> detalle de un producto (público)
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

// POST /api/productos  -> crear producto (solo admin)
router.post("/", verificarToken, soloAdmin, async (req, res) => {
  const error = validarProducto(req.body);
  if (error) return res.status(400).json({ error });

  const { codigo, nombre, descripcion, precio, stock, stockCritico, categoria, imagen } = req.body;
  try {
    const resultado = await query(
      `INSERT INTO productos (codigo, nombre, descripcion, precio, stock, stock_critico, categoria, imagen)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [codigo.trim(), nombre.trim(), descripcion || null, precio, stock, stockCritico || 0, categoria, imagen || null]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "Ya existe un producto con ese código" });
    console.error(error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// PUT /api/productos/:id  -> editar producto (solo admin)
router.put("/:id", verificarToken, soloAdmin, async (req, res) => {
  const error = validarProducto(req.body);
  if (error) return res.status(400).json({ error });

  const { codigo, nombre, descripcion, precio, stock, stockCritico, categoria, imagen } = req.body;
  try {
    const resultado = await query(
      `UPDATE productos
          SET codigo = $1, nombre = $2, descripcion = $3, precio = $4, stock = $5,
              stock_critico = $6, categoria = $7, imagen = $8
        WHERE id = $9
        RETURNING *`,
      [codigo.trim(), nombre.trim(), descripcion || null, precio, stock, stockCritico || 0, categoria, imagen || null, req.params.id]
    );
    if (resultado.rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(resultado.rows[0]);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "Ya existe un producto con ese código" });
    console.error(error);
    res.status(500).json({ error: "Error al editar el producto" });
  }
});

// DELETE /api/productos/:id  -> eliminar producto (solo admin)
router.delete("/:id", verificarToken, soloAdmin, async (req, res) => {
  try {
    const resultado = await query("DELETE FROM productos WHERE id = $1 RETURNING id", [req.params.id]);
    if (resultado.rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
