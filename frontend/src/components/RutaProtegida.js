import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Envuelve páginas que necesitan sesión.
// roles = lista de roles permitidos (ej: ["Administrador"]). Sin "roles", basta con tener sesión.
// Ojo: esto solo oculta pantallas; la seguridad real la aplica el backend con el token JWT.
function RutaProtegida({ roles, children }) {
  const { usuario } = useAuth();
  const ubicacion = useLocation();

  if (!usuario) {
    // Lo mandamos al login y recordamos a dónde quería ir
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (roles && !roles.includes(usuario.tipo)) {
    return (
      <main className="contenedor texto-centrado">
        <h1>Acceso restringido</h1>
        <p>Tu rol ({usuario.tipo}) no tiene permiso para ver esta sección.</p>
        <Link to="/" className="btn">Volver a la tienda</Link>
      </main>
    );
  }
  return children;
}

export default RutaProtegida;
