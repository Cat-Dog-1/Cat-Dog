import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";

const router = Router();

// POST /api/usuarios/registro
router.post("/registro", async (req, res) => {
  const { run, nombre, apellidos, correo, clave, region, comuna, direccion } = req.body;

  if (!run || !nombre || !apellidos || !correo || !clave) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const existente = await query(
      "SELECT id FROM usuarios WHERE run = $1 OR correo = $2",
      [run, correo]
    );
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: "Ya existe un usuario con ese RUN o correo" });
    }

    const claveHash = await bcrypt.hash(clave, 10);
    const resultado = await query(
      `INSERT INTO usuarios (run, nombre, apellidos, correo, clave_hash, region, comuna, direccion)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, run, nombre, apellidos, correo, tipo_usuario`,
      [run, nombre, apellidos, correo, claveHash, region || null, comuna || null, direccion || null]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// POST /api/usuarios/login
router.post("/login", async (req, res) => {
  const { correo, clave } = req.body;
  if (!correo || !clave) {
    return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
  }

  try {
    const resultado = await query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
    const usuario = resultado.rows[0];

    if (!usuario || !(await bcrypt.compare(clave, usuario.clave_hash))) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, tipo: usuario.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, tipo: usuario.tipo_usuario },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

export default router;
