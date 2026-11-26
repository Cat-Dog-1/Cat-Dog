// ===== Conexión con el backend (Spring Boot + MySQL) =====
// El backend debe estar encendido (mvnw spring-boot:run). Todas las rutas usan la versión v1.
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

// Claves donde se guarda la sesión en el navegador (sobrevive a recargar la página)
export const CLAVE_TOKEN = "catdog_token";
export const CLAVE_REFRESH = "catdog_refresh";
export const CLAVE_USUARIO = "catdog_usuario";

export const EVENTO_SESION_EXPIRADA = "catdog:sesion-expirada";
export const EVENTO_SESION_RENOVADA = "catdog:sesion-renovada";

// ----- Manejo de la sesión guardada -----

export function guardarSesion({ token, refreshToken, usuario }) {
  if (token) localStorage.setItem(CLAVE_TOKEN, token);
  if (refreshToken) localStorage.setItem(CLAVE_REFRESH, refreshToken);
  if (usuario) localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_REFRESH);
  localStorage.removeItem(CLAVE_USUARIO);
}

// Lee la parte central de un JWT (el "payload") sin verificar la firma.
// Solo se usa para saber cuándo expira; quien verifica la firma es el backend.
export function leerPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// true si el token ya expiró o le quedan menos de "margen" segundos
export function tokenVencido(token, margen = 30) {
  const payload = leerPayload(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 <= Date.now() + margen * 1000;
}

function avisarSesionExpirada() {
  borrarSesion();
  window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
}

// ----- Renovación del token (refresh) -----
// Si varias peticiones necesitan renovar al mismo tiempo, comparten la misma promesa.
let renovacionEnCurso = null;

export function renovarToken() {
  const refreshToken = localStorage.getItem(CLAVE_REFRESH);
  if (!refreshToken) return Promise.reject(new Error("No hay sesión que renovar"));

  if (!renovacionEnCurso) {
    renovacionEnCurso = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (respuesta) => {
        const datos = await respuesta.json().catch(() => ({}));
        if (!respuesta.ok) throw new Error(datos.error || "La sesión expiró");
        guardarSesion(datos);
        window.dispatchEvent(new CustomEvent(EVENTO_SESION_RENOVADA, { detail: datos.usuario }));
        return datos;
      })
      .finally(() => {
        renovacionEnCurso = null;
      });
  }
  return renovacionEnCurso;
}

// ----- Petición principal -----
// 1. Si el token está por vencer, lo renueva antes de llamar.
// 2. Envía "Authorization: Bearer <token>".
// 3. Si el backend responde 401, intenta renovar UNA vez y repite la petición.
// 4. Si no se puede renovar, cierra la sesión y avisa a la app.
export async function llamarApi(ruta, opciones = {}, reintentar = true) {
  let token = localStorage.getItem(CLAVE_TOKEN);
  const esRutaDeSesion = ruta.startsWith("/auth/login") || ruta.startsWith("/auth/refresh")
    || ruta.startsWith("/auth/registro");

  if (token && !esRutaDeSesion && tokenVencido(token) && localStorage.getItem(CLAVE_REFRESH)) {
    try {
      token = (await renovarToken()).token;
    } catch {
      avisarSesionExpirada();
      token = null;
    }
  }

  const headers = { "Content-Type": "application/json", ...(opciones.headers || {}) };
  if (token && !esRutaDeSesion) headers.Authorization = `Bearer ${token}`;

  const respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers });

  if (respuesta.status === 401 && reintentar && !esRutaDeSesion && localStorage.getItem(CLAVE_REFRESH)) {
    try {
      await renovarToken();
      return llamarApi(ruta, opciones, false);
    } catch {
      avisarSesionExpirada();
    }
  }

  if (respuesta.status === 204) return null; // DELETE correcto, sin contenido
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(datos.error || "Ocurrió un error al conectar con el servidor");
    error.estado = respuesta.status;
    throw error;
  }
  return datos;
}

// El backend envía el producto con "categoria" (nombre) y "categoriaId".
// La imagen se guarda sin "/" inicial ("img/pelota.jpg"): aquí se agrega.
export function normalizarProducto(fila) {
  const imagen = fila.imagen || "";
  return {
    id: Number(fila.id),
    codigo: fila.codigo || `P-${String(fila.id).padStart(3, "0")}`,
    nombre: fila.nombre,
    descripcion: fila.descripcion || "",
    precio: Number(fila.precio),
    stock: Number(fila.stock),
    stockCritico: Number(fila.stockCritico ?? fila.stock_critico ?? 0),
    categoria: typeof fila.categoria === "object" && fila.categoria ? fila.categoria.nombre : fila.categoria,
    categoriaId: fila.categoriaId != null ? Number(fila.categoriaId) : null,
    imagen: imagen && !imagen.startsWith("/") && !imagen.startsWith("http") ? `/${imagen}` : imagen,
  };
}
