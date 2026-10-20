// ===== Sesión del usuario =====
// Guarda quién inició sesión (y su token) para toda la app.
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function leerUsuarioGuardado() {
  try {
    const datos = localStorage.getItem("catdog_usuario");
    return datos ? JSON.parse(datos) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

  // Se llama cuando el backend responde OK al login
  function iniciarSesion({ token, usuario: datosUsuario }) {
    localStorage.setItem("catdog_token", token);
    localStorage.setItem("catdog_usuario", JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  }

  function cerrarSesion() {
    localStorage.removeItem("catdog_token");
    localStorage.removeItem("catdog_usuario");
    setUsuario(null);
  }

  const esAdmin = usuario?.tipo === "Administrador";

  return (
    <AuthContext.Provider value={{ usuario, esAdmin, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
