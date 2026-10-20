import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { verificarToken, soloAdmin } from "../middleware/auth.js";

const router = Router();

const TIPOS = ["Administrador", "Vendedor", "Cliente"];
// Columnas que se devuelven (nunca se devuelve la contraseña)
const COLUMNAS = "id, run, nombre, apellidos, correo, telefono, region, comuna, direccion, tipo_usuario, creado_en";

// ===== Rutas públicas =====

// POST /api/usuarios/registro  -> cualquier persona crea su cuenta (tipo Cliente)
router.post("/registro", async (req, res) => {
  const { run, nombre, apellidos, correo, clave, telefono, region, comuna, direccion } = req.body;

  if (!run || !nombre || !apellidos || !correo || !clave) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const existente = await query("SELECT id FROM usuarios WHERE run = $1 OR correo = $2", [run, correo]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: "Ya existe un usuario con ese RUN o correo" });
    }

    const claveHash = await bcrypt.hash(clave, 10);
    const resultado = await query(
      `INSERT INTO usuarios (run, nombre, apellidos, correo, clave_hash, telefono, region, comuna, direccion)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING ${COLUMNAS}`,
      [run, nombre, apellidos, correo, claveHash, telefono || null, region || null, comuna || null, direccion || null]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// POST /api/usuarios/login  -> devuelve un token y los datos del usuario
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

// ===== Rutas del administrador =====

// GET /api/usuarios  -> listado
router.get("/", verificarToken, soloAdmin, async (req, res) => {
  try {
    const resultado = await query(`SELECT ${COLUMNAS} FROM usuarios ORDER BY id ASC`);
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// GET /api/usuarios/:id  -> un usuario
router.get("/:id", verificarToken, soloAdmin, async (req, res) => {
  try {
    const resultado = await query(`SELECT ${COLUMNAS} FROM usuarios WHERE id = $1`, [req.params.id]);
    if (resultado.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});

// POST /api/usuarios  -> el admin crea un usuario de cualquier tipo
router.post("/", verificarToken, soloAdmin, async (req, res) => {
  const { run, nombre, apellidos, correo, clave, telefono, tipo, region, comuna, direccion } = req.body;
  if (!run || !nombre || !apellidos || !correo || !clave || !TIPOS.includes(tipo)) {
    return res.status(400).json({ error: "Faltan campos obligatorios o el tipo no es válido" });
  }
  try {
    const claveHash = await bcrypt.hash(clave, 10);
    const resultado = await query(
      `INSERT INTO usuarios (run, nombre, apellidos, correo, clave_hash, telefono, tipo_usuario, region, comuna, direccion)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING ${COLUMNAS}`,
      [run, nombre, apellidos, correo, claveHash, telefono || null, tipo, region || null, comuna || null, direccion || null]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "Ya existe un usuario con ese RUN o correo" });
    console.error(error);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});

// PUT /api/usuarios/:id  -> editar (la contraseña solo cambia si se envía una nueva)
router.put("/:id", verificarToken, soloAdmin, async (req, res) => {
  const { run, nombre, apellidos, correo, clave, telefono, tipo, region, comuna, direccion } = req.body;
  if (!run || !nombre || !apellidos || !correo || !TIPOS.includes(tipo)) {
    return res.status(400).json({ error: "Faltan campos obligatorios o el tipo no es válido" });
  }
  try {
    const resultado = await query(
      `UPDATE usuarios
          SET run = $1, nombre = $2, apellidos = $3, correo = $4, telefono = $5,
              tipo_usuario = $6, region = $7, comuna = $8, direccion = $9
        WHERE id = $10
        RETURNING ${COLUMNAS}`,
      [run, nombre, apellidos, correo, telefono || null, tipo, region || null, comuna || null, direccion || null, req.params.id]
    );
    if (resultado.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    if (clave) {
      const claveHash = await bcrypt.hash(clave, 10);
      await query("UPDATE usuarios SET clave_hash = $1 WHERE id = $2", [claveHash, req.params.id]);
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "Ya existe un usuario con ese RUN o correo" });
    console.error(error);
    res.status(500).json({ error: "Error al editar el usuario" });
  }
});

// DELETE /api/usuarios/:id
router.delete("/:id", verificarToken, soloAdmin, async (req, res) => {
  if (Number(req.params.id) === req.usuario.id) {
    return res.status(400).json({ error: "No puedes eliminar tu propia cuenta" });
  }
  try {
    const resultado = await query("DELETE FROM usuarios WHERE id = $1 RETURNING id", [req.params.id]);
    if (resultado.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

export default router;
