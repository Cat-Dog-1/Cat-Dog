// ===== Validaciones de formularios =====
// Cada función recibe el valor y devuelve "" si está bien,
// o el mensaje de error si está mal. Así se pueden probar fácilmente.

const CORREOS_PERMITIDOS = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

export function validarRequerido(valor, mensaje = "Este campo es obligatorio.") {
  return String(valor ?? "").trim() ? "" : mensaje;
}

export function validarLargoMax(valor, max) {
  return String(valor ?? "").trim().length > max ? `Máximo ${max} caracteres.` : "";
}

export function validarTexto(valor, max) {
  return validarRequerido(valor) || validarLargoMax(valor, max);
}

export function validarCorreo(valor) {
  const correo = String(valor ?? "").trim();
  if (!correo) return "El correo es obligatorio.";
  if (correo.length > 100) return "Máximo 100 caracteres.";
  if (!CORREOS_PERMITIDOS.test(correo)) {
    return "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  }
  return "";
}

// RUN chileno sin puntos ni guion (7 a 9 caracteres). Ej: 19011022K
export function validarRun(valor) {
  const run = String(valor ?? "").trim().toUpperCase();
  if (!run) return "El RUN es obligatorio.";
  if (run.length < 7 || run.length > 9) return "El RUN debe tener entre 7 y 9 caracteres.";
  if (!/^[0-9]{6,8}[0-9K]$/.test(run)) return "Formato inválido. Ejemplo: 19011022K (sin puntos ni guion).";
  return "";
}

export function validarClave(valor) {
  const largo = String(valor ?? "").length;
  return largo < 4 || largo > 10 ? "La contraseña debe tener entre 4 y 10 caracteres." : "";
}

export function validarConfirmacion(clave, confirmacion) {
  return !confirmacion || clave !== confirmacion ? "Las contraseñas no coinciden." : "";
}

export function validarNumeroNoNegativo(valor, { entero = false } = {}) {
  if (valor === "" || valor === null || valor === undefined) return "Este campo es obligatorio.";
  const numero = Number(valor);
  if (Number.isNaN(numero) || numero < 0) return "No puede ser negativo.";
  if (entero && !Number.isInteger(numero)) return "Debe ser un número entero.";
  return "";
}

// Devuelve true si el objeto de errores no tiene ningún mensaje
export function sinErrores(errores) {
  return Object.values(errores).every((mensaje) => !mensaje);
}
