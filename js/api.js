// ===== Configuración de la API =====
// Esta es la ÚNICA línea que deberías tener que cambiar si tu backend
// corre en otra URL (por ejemplo, cuando lo subas a un hosting).
const API_URL = "http://localhost:3001/api";

// Función de ayuda: hace la petición y convierte la respuesta a JSON.
// La reutilizamos en todos los demás archivos .js para no repetir código.
async function llamarApi(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new Error(datos.error || "Ocurrió un error al conectar con el servidor");
  }
  return datos;
}
