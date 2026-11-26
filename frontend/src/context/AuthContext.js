// ===== Sesión del usuario =====
// Guarda quién inició sesión y sus tokens para toda la app.
// - La sesión se guarda en localStorage: sigue activa aunque se recargue la página.
// - Al abrir la app se confirma con el backend (GET /auth/me) que el token sigue siendo válido.
// - Si el token de acceso vence, services/api.js lo renueva con el refresh token.
// - Si la renovación falla, se cierra la sesión automáticamente.
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  CLAVE_TOKEN, CLAVE_USUARIO, EVENTO_SESION_EXPIRADA, EVENTO_SESION_RENOVADA,
  borrarSesion, guardarSesion, llamarApi,
} from "../services/api";
import { PERSONAL, ROLES } from "../utils/roles";

const AuthContext = createContext(null);

function leerUsuarioGuardado() {
  try {
    const datos = localStorage.getItem(CLAVE_USUARIO);
    return datos ? JSON.parse(datos) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

  // Se llama cuando el backend responde OK al login: { token, refreshToken, usuario }
  const iniciarSesion = useCallback((respuesta) => {
    guardarSesion(respuesta);
    setUsuario(respuesta.usuario);
  }, []);

  const cerrarSesion = useCallback(() => {
    borrarSesion();
    setUsuario(null);
  }, []);

  // Al cargar la página: si hay token guardado, se valida con el backend.
  // Solo se cierra la sesión si el backend dice 401 (token inválido);
  // si el backend está apagado se mantiene la sesión guardada.
  useEffect(() => {
    if (!localStorage.getItem(CLAVE_TOKEN)) return;
    llamarApi("/auth/me")
      .then((datos) => {
        if (!datos) return;
        localStorage.setItem(CLAVE_USUARIO, JSON.stringify(datos));
        setUsuario(datos);
      })
      .catch((error) => {
        if (error.estado === 401) {
          borrarSesion();
          setUsuario(null);
        }
      });
  }, []);

  // Escucha los avisos de services/api.js y los cambios hechos en otra pestaña
  useEffect(() => {
    const alExpirar = () => setUsuario(null);
    const alRenovar = (e) => e.detail && setUsuario(e.detail);
    const alCambiarOtraPestana = (e) => {
      if (e.key === CLAVE_USUARIO || e.key === null) setUsuario(leerUsuarioGuardado());
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    window.addEventListener(EVENTO_SESION_RENOVADA, alRenovar);
    window.addEventListener("storage", alCambiarOtraPestana);
    return () => {
      window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
      window.removeEventListener(EVENTO_SESION_RENOVADA, alRenovar);
      window.removeEventListener("storage", alCambiarOtraPestana);
    };
  }, []);

  const rol = usuario?.tipo;
  const esAdmin = rol === ROLES.ADMIN;
  const esVendedor = rol === ROLES.VENDEDOR;
  const esPersonal = PERSONAL.includes(rol);
  const tieneRol = (roles) => Boolean(usuario) && roles.includes(rol);

  return (
    <AuthContext.Provider
      value={{ usuario, rol, esAdmin, esVendedor, esPersonal, tieneRol, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
