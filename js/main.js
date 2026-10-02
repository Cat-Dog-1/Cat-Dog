// Utilidades generales compartidas por todas las páginas de la tienda.
// Aquí se pueden agregar futuras funciones comunes (menú móvil, scroll, etc.)

document.addEventListener("DOMContentLoaded", () => {
  // Marca como activo el link del menú que corresponde a la página actual
  const rutaActual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.menu a").forEach(enlace => {
    if (enlace.getAttribute("href") === rutaActual) {
      enlace.style.color = "#ff7a3d";
    }
  });
});
