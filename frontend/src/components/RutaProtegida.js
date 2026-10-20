import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Envuelve páginas que necesitan sesión.
// soloAdmin = true → además debe ser Administrador.
function RutaProtegida({ soloAdmin = false, children }) {
  const { usuario, esAdmin } = useAuth();
  const ubicacion = useLocation();

  if (!usuario) {
    // Lo mandamos al login y recordamos a dónde quería ir
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (soloAdmin && !esAdmin) {
    return (
      <main className="contenedor texto-centrado">
        <h1>Acceso restringido</h1>
        <p>Esta sección es solo para administradores.</p>
      </main>
    );
  }
  return children;
}

export default RutaProtegida;
