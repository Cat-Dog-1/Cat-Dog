// ===== Utilidades genéricas de validación =====
const CORREOS_PERMITIDOS = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

function mostrarError(campoId, mensaje) {
  const campo = document.getElementById(campoId).closest(".campo");
  campo.classList.add("invalido");
  campo.classList.remove("valido");
  campo.querySelector(".mensaje-error").textContent = mensaje;
}

function marcarValido(campoId) {
  const campo = document.getElementById(campoId).closest(".campo");
  campo.classList.remove("invalido");
  campo.classList.add("valido");
}

function validarRequerido(id, mensaje = "Este campo es obligatorio.") {
  const valor = document.getElementById(id).value.trim();
  if (!valor) { mostrarError(id, mensaje); return false; }
  marcarValido(id);
  return true;
}

function validarLargoMax(id, max, mensaje) {
  const valor = document.getElementById(id).value.trim();
  if (valor.length > max) { mostrarError(id, mensaje || `Máximo ${max} caracteres.`); return false; }
  return true;
}

function validarCorreo(id) {
  const valor = document.getElementById(id).value.trim();
  if (!valor) { mostrarError(id, "El correo es obligatorio."); return false; }
  if (valor.length > 100) { mostrarError(id, "Máximo 100 caracteres."); return false; }
  if (!CORREOS_PERMITIDOS.test(valor)) {
    mostrarError(id, "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
    return false;
  }
  marcarValido(id);
  return true;
}

// Validación simple de RUN chileno (sin puntos ni guion, 7 a 9 caracteres)
function validarRun(id) {
  const valor = document.getElementById(id).value.trim().toUpperCase();
  const regex = /^[0-9]{6,8}[0-9K]$/;
  if (!valor) { mostrarError(id, "El RUN es obligatorio."); return false; }
  if (valor.length < 7 || valor.length > 9) { mostrarError(id, "El RUN debe tener entre 7 y 9 caracteres."); return false; }
  if (!regex.test(valor)) { mostrarError(id, "Formato inválido. Ejemplo: 19011022K (sin puntos ni guion)."); return false; }
  marcarValido(id);
  return true;
}

// ===== LOGIN (login.html) =====
function inicializarFormularioLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let ok = true;
    if (!validarCorreo("login-correo")) ok = false;

    const clave = document.getElementById("login-clave").value;
    if (clave.length < 4 || clave.length > 10) {
      mostrarError("login-clave", "La contraseña debe tener entre 4 y 10 caracteres.");
      ok = false;
    } else marcarValido("login-clave");

    if (ok) {
      document.getElementById("mensaje-exito-login").style.display = "block";
      form.reset();
    }
  });
}

// ===== REGISTRO DE USUARIO (registro.html, admin-usuario-nuevo/editar.html) =====
function inicializarFormularioUsuario(formId, mensajeExitoId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let ok = true;

    if (!validarRun("run")) ok = false;
    if (!validarRequerido("nombre") || !validarLargoMax("nombre", 50, "Máximo 50 caracteres.")) ok = false;
    if (!validarRequerido("apellidos") || !validarLargoMax("apellidos", 100, "Máximo 100 caracteres.")) ok = false;
    if (!validarCorreo("correo")) ok = false;

    const claveEl = document.getElementById("clave");
    const confirmarEl = document.getElementById("confirmar-clave");
    if (claveEl) {
      if (claveEl.value.length < 4 || claveEl.value.length > 10) {
        mostrarError("clave", "La contraseña debe tener entre 4 y 10 caracteres.");
        ok = false;
      } else marcarValido("clave");

      if (confirmarEl.value !== claveEl.value || confirmarEl.value === "") {
        mostrarError("confirmar-clave", "Las contraseñas no coinciden.");
        ok = false;
      } else marcarValido("confirmar-clave");
    }

    if (!validarRequerido("region")) ok = false;
    if (!validarRequerido("comuna")) ok = false;
    if (!validarRequerido("direccion") || !validarLargoMax("direccion", 300, "Máximo 300 caracteres.")) ok = false;

    if (ok) {
      const mensaje = document.getElementById(mensajeExitoId);
      if (mensaje) mensaje.style.display = "block";
      form.reset();
    }
  });
}

// ===== CONTACTO (contacto.html) =====
function inicializarFormularioContacto() {
  const form = document.getElementById("form-contacto");
  if (!form) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let ok = true;
    if (!validarRequerido("contacto-nombre") || !validarLargoMax("contacto-nombre", 100)) ok = false;
    if (!validarCorreo("contacto-correo")) ok = false;
    if (!validarRequerido("contacto-comentario") || !validarLargoMax("contacto-comentario", 500, "Máximo 500 caracteres.")) ok = false;

    if (ok) {
      document.getElementById("mensaje-exito-contacto").style.display = "block";
      form.reset();
    }
  });
}

// ===== PRODUCTO — admin (admin-producto-nuevo.html / admin-producto-editar.html) =====
function inicializarFormularioProducto() {
  const form = document.getElementById("form-producto");
  if (!form) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let ok = true;

    if (!validarRequerido("codigo") || !(document.getElementById("codigo").value.trim().length >= 3)) {
      mostrarError("codigo", "Mínimo 3 caracteres.");
      ok = false;
    } else marcarValido("codigo");

    if (!validarRequerido("nombre-producto") || !validarLargoMax("nombre-producto", 100)) ok = false;
    validarLargoMax("descripcion-producto", 500); // opcional

    const precio = Number(document.getElementById("precio").value);
    if (document.getElementById("precio").value === "" || precio < 0) {
      mostrarError("precio", "El precio es obligatorio y no puede ser negativo.");
      ok = false;
    } else marcarValido("precio");

    const stock = document.getElementById("stock").value;
    if (stock === "" || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      mostrarError("stock", "El stock es obligatorio, entero y no puede ser negativo.");
      ok = false;
    } else marcarValido("stock");

    if (!validarRequerido("categoria")) ok = false;

    if (ok) {
      document.getElementById("mensaje-exito-producto").style.display = "block";
      form.reset();
    }
  });
}
