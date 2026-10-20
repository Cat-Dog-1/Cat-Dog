// ===== Conexión con el backend (Node/Express + Neon) =====
// El backend debe estar encendido con "npm run dev" dentro de la carpeta backend.
export const API_URL = "http://localhost:3001/api";

const CLAVE_TOKEN = "catdog_token";

// Hace una petición al backend. Si hay sesión iniciada, envía el token
// para que el backend sepa quién es (y si es administrador).
export async function llamarApi(ruta, opciones = {}) {
  const token = localStorage.getItem(CLAVE_TOKEN);
  const headers = { "Content-Type": "application/json", ...(opciones.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new Error(datos.error || "Ocurrió un error al conectar con el servidor");
  }
  return datos;
}

// La base de datos usa nombres como "stock_critico" y la imagen sin "/" inicial.
// Esta función deja cada producto con el mismo formato que usa React.
export function normalizarProducto(fila) {
  const imagen = fila.imagen || "";
  return {
    id: Number(fila.id),
    codigo: fila.codigo || `P-${String(fila.id).padStart(3, "0")}`,
    nombre: fila.nombre,
    descripcion: fila.descripcion || "",
    precio: Number(fila.precio),
    stock: Number(fila.stock),
    stockCritico: Number(fila.stock_critico ?? fila.stockCritico ?? 0),
    categoria: fila.categoria,
    imagen: imagen && !imagen.startsWith("/") && !imagen.startsWith("http") ? `/${imagen}` : imagen,
  };
}
