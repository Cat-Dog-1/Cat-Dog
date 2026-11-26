// Ayuda para las pruebas: reemplaza fetch por un "backend falso".
// rutas = { "GET /productos": datos, "POST /boletas": datos, ... }
// Para simular un error: { __error: "mensaje", __estado: 400 }
// Si una ruta no está, falla como si el backend estuviera apagado.
import { API_URL } from "../services/api";

export function simularBackend(rutas = {}) {
  global.fetch = jest.fn((url, opciones = {}) => {
    const metodo = opciones.method || "GET";
    const ruta = url.replace(API_URL, "");
    const clave = `${metodo} ${ruta}`;
    if (!(clave in rutas)) return Promise.reject(new Error("Sin backend"));
    let respuesta = rutas[clave];
    if (typeof respuesta === "function") respuesta = respuesta(opciones);
    const ok = !(respuesta && respuesta.__error);
    return Promise.resolve({
      ok,
      status: ok ? 200 : respuesta.__estado || 400,
      json: () => Promise.resolve(ok ? respuesta : { error: respuesta.__error }),
    });
  });
  return global.fetch;
}

// Deja la sesión iniciada como el tipo de usuario indicado
export function iniciarSesionComo(tipo = "Cliente", nombre = "Ana") {
  localStorage.setItem("catdog_token", "token-de-prueba");
  localStorage.setItem("catdog_usuario", JSON.stringify({ id: 9, nombre, tipo }));
}

// Crea un JWT de prueba (sin firma real) que vence en "segundos"
export function tokenDePrueba(segundos = 900) {
  const payload = btoa(JSON.stringify({ sub: "ana@gmail.com", exp: Math.floor(Date.now() / 1000) + segundos }));
  return `cabecera.${payload}.firma`;
}

export function irA(ruta) {
  window.history.pushState({}, "", ruta);
}
