// Ayuda para las pruebas: reemplaza fetch por un "backend falso".
// rutas = { "GET /productos": datos, "POST /pedidos": datos, ... }
// Si una ruta no está, responde con error (como si el backend estuviera apagado).
export function simularBackend(rutas = {}) {
  global.fetch = jest.fn((url, opciones = {}) => {
    const metodo = opciones.method || "GET";
    const ruta = url.replace("http://localhost:3001/api", "");
    const clave = `${metodo} ${ruta}`;
    if (!(clave in rutas)) return Promise.reject(new Error("Sin backend"));
    const respuesta = rutas[clave];
    const ok = !(respuesta && respuesta.__error);
    return Promise.resolve({
      ok,
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

export function irA(ruta) {
  window.history.pushState({}, "", ruta);
}
