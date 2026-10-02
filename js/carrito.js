// ===== Carrito de compras: persistido en localStorage =====
const CLAVE_CARRITO = "petshop_carrito";

function obtenerCarrito() {
  const datos = localStorage.getItem(CLAVE_CARRITO);
  return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(id, nombre, precio, cantidad = 1) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(item => item.id === Number(id));

  if (existente) {
    existente.cantidad += Number(cantidad);
  } else {
    carrito.push({ id: Number(id), nombre, precio: Number(precio), cantidad: Number(cantidad) });
  }
  guardarCarrito(carrito);
}

function cambiarCantidad(id, delta) {
  const carrito = obtenerCarrito();
  const item = carrito.find(i => i.id === Number(id));
  if (!item) return;
  item.cantidad += delta;
  const carritoFinal = item.cantidad <= 0 ? carrito.filter(i => i.id !== Number(id)) : carrito;
  guardarCarrito(carritoFinal);
  renderizarCarrito();
}

function eliminarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(i => i.id !== Number(id));
  guardarCarrito(carrito);
  renderizarCarrito();
}

function vaciarCarrito() {
  guardarCarrito([]);
  renderizarCarrito();
}

function totalCarrito() {
  return obtenerCarrito().reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

function cantidadTotalItems() {
  return obtenerCarrito().reduce((suma, item) => suma + item.cantidad, 0);
}

// Actualiza el contador "🛒 N" del header en cualquier página
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (contador) contador.textContent = `🛒 ${cantidadTotalItems()}`;
}

// Dibuja la vista completa del carrito (usado en carrito.html)
function renderizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalEl = document.getElementById("total-carrito");
  if (!lista) return;

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    lista.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío. <a href="productos.html">Ver productos</a></p>`;
  } else {
    lista.innerHTML = carrito.map(item => `
      <div class="item-carrito" data-id="${item.id}">
        <div class="info-item">
          <strong>${item.nombre}</strong>
          <p>$${item.precio.toLocaleString("es-CL")} c/u</p>
        </div>
        <div class="cantidad-controles">
          <button type="button" class="btn-restar" data-id="${item.id}">−</button>
          <span>${item.cantidad}</span>
          <button type="button" class="btn-sumar" data-id="${item.id}">+</button>
        </div>
        <strong>$${(item.precio * item.cantidad).toLocaleString("es-CL")}</strong>
        <button type="button" class="btn pequeno peligro btn-eliminar" data-id="${item.id}">Eliminar</button>
      </div>
    `).join("");
  }

  if (totalEl) totalEl.textContent = totalCarrito().toLocaleString("es-CL");
}

// Delegación de eventos para los botones "Agregar al carrito" del catálogo
document.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btn-agregar")) {
    const tarjeta = evento.target.closest(".producto");
    agregarAlCarrito(tarjeta.dataset.id, tarjeta.dataset.nombre, tarjeta.dataset.precio, 1);
    evento.target.textContent = "¡Agregado! ✓";
    setTimeout(() => (evento.target.textContent = "Agregar al carrito"), 1200);
  }

  if (evento.target.id === "btn-agregar-detalle") {
    const info = document.querySelector("#detalle-producto .info");
    const cantidad = document.getElementById("cantidad").value || 1;
    agregarAlCarrito(info.dataset.id, info.dataset.nombre, info.dataset.precio, cantidad);
    evento.target.textContent = "¡Agregado al carrito! ✓";
  }

  if (evento.target.classList.contains("btn-sumar")) cambiarCantidad(evento.target.dataset.id, 1);
  if (evento.target.classList.contains("btn-restar")) cambiarCantidad(evento.target.dataset.id, -1);
  if (evento.target.classList.contains("btn-eliminar")) eliminarDelCarrito(evento.target.dataset.id);
  if (evento.target.id === "vaciar-carrito") vaciarCarrito();
});


document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
