import { Router } from "express";
import { pool, query } from "../db.js";
import { verificarToken, soloAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/pedidos  -> registra una compra del usuario con sesión iniciada.
// Recibe: { items: [ { id, cantidad }, ... ] }
// Los precios se leen de la base de datos (no se confía en los del navegador)
// y se descuenta el stock. Todo va en una transacción: o se guarda todo o nada.
router.post("/", verificarToken, async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (items.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío" });
  }

  const cliente = await pool.connect();
  try {
    await cliente.query("BEGIN");

    let total = 0;
    const detalle = [];

    for (const item of items) {
      const cantidad = Number(item.cantidad);
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw { estado: 400, mensaje: "Cantidad inválida" };
      }

      // FOR UPDATE bloquea la fila para que dos compras no usen el mismo stock
      const resultado = await cliente.query(
        "SELECT id, nombre, precio, stock FROM productos WHERE id = $1 FOR UPDATE",
        [item.id]
      );
      const producto = resultado.rows[0];
      if (!producto) throw { estado: 400, mensaje: "Un producto del carrito ya no existe" };
      if (producto.stock < cantidad) {
        throw { estado: 400, mensaje: `No hay stock suficiente de "${producto.nombre}" (quedan ${producto.stock})` };
      }

      total += Number(producto.precio) * cantidad;
      detalle.push({ producto_id: producto.id, nombre: producto.nombre, precio: Number(producto.precio), cantidad });

      await cliente.query("UPDATE productos SET stock = stock - $1 WHERE id = $2", [cantidad, producto.id]);
    }

    const pedido = await cliente.query(
      "INSERT INTO pedidos (usuario_id, total) VALUES ($1, $2) RETURNING *",
      [req.usuario.id, total]
    );
    const pedidoId = pedido.rows[0].id;

    for (const d of detalle) {
      await cliente.query(
        "INSERT INTO pedido_items (pedido_id, producto_id, nombre, precio, cantidad) VALUES ($1,$2,$3,$4,$5)",
        [pedidoId, d.producto_id, d.nombre, d.precio, d.cantidad]
      );
    }

    await cliente.query("COMMIT");
    res.status(201).json({ ...pedido.rows[0], items: detalle });
  } catch (error) {
    await cliente.query("ROLLBACK");
    if (error.estado) return res.status(error.estado).json({ error: error.mensaje });
    console.error(error);
    res.status(500).json({ error: "Error al registrar la compra" });
  } finally {
    cliente.release();
  }
});

// GET /api/pedidos/mios  -> compras del usuario con sesión
router.get("/mios", verificarToken, async (req, res) => {
  try {
    const resultado = await query(
      `SELECT p.*, COALESCE(json_agg(i.* ORDER BY i.id) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
         FROM pedidos p LEFT JOIN pedido_items i ON i.pedido_id = p.id
        WHERE p.usuario_id = $1
        GROUP BY p.id ORDER BY p.id DESC`,
      [req.usuario.id]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener tus compras" });
  }
});

// GET /api/pedidos  -> todas las compras (solo admin)
router.get("/", verificarToken, soloAdmin, async (req, res) => {
  try {
    const resultado = await query(
      `SELECT p.*, u.nombre || ' ' || u.apellidos AS cliente, u.correo,
              COALESCE(json_agg(i.* ORDER BY i.id) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
         FROM pedidos p
         LEFT JOIN usuarios u ON u.id = p.usuario_id
         LEFT JOIN pedido_items i ON i.pedido_id = p.id
        GROUP BY p.id, u.nombre, u.apellidos, u.correo
        ORDER BY p.id DESC`
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las compras" });
  }
});

export default router;
