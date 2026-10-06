import { Router } from "express";
import { query } from "../db.js";

const router = Router();

// POST /api/mensajes  -> guarda un mensaje del formulario de contacto
router.post("/", async (req, res) => {
  const { nombre, correo, comentario } = req.body;
  if (!nombre || !correo || !comentario) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  try {
    await query(
      "INSERT INTO mensajes_contacto (nombre, correo, comentario) VALUES ($1,$2,$3)",
      [nombre, correo, comentario]
    );
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar el mensaje" });
  }
});

export default router;
