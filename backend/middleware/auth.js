import jwt from "jsonwebtoken";

// Revisa que la petición traiga un token válido (usuario con sesión iniciada).
// El frontend lo envía en el encabezado:  Authorization: Bearer <token>
export function verificarToken(req, res, next) {
  const encabezado = req.headers.authorization || "";
  const token = encabezado.startsWith("Bearer ") ? encabezado.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Debes iniciar sesión" });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET); // { id, correo, tipo }
    next();
  } catch {
    return res.status(401).json({ error: "Tu sesión expiró, vuelve a iniciar sesión" });
  }
}

// Solo deja pasar a usuarios de tipo Administrador (usar después de verificarToken)
export function soloAdmin(req, res, next) {
  if (req.usuario?.tipo !== "Administrador") {
    return res.status(403).json({ error: "No tienes permisos de administrador" });
  }
  next();
}
