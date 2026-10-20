import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { useProductos } from "../context/ProductosContext";
import { formatearPrecio } from "../data/productos";
import { llamarApi } from "../services/api";

function Carrito() {
  const { items, cambiarCantidad, eliminar, vaciar, total } = useCarrito();
  const { usuario } = useAuth();
  const { recargar } = useProductos();
  const navegar = useNavigate();
  const [error, setError] = useState("");
  const [pagando, setPagando] = useState(false);

  async function pagar() {
    setError("");
    // Para comprar hay que iniciar sesión
    if (!usuario) {
      navegar("/login", { state: { desde: "/carrito" } });
      return;
    }
    setPagando(true);
    try {
      const pedido = await llamarApi("/pedidos", {
        method: "POST",
        body: JSON.stringify({ items: items.map((i) => ({ id: i.id, cantidad: i.cantidad })) }),
      });
      vaciar();
      recargar(); // el stock cambió
      navegar("/compra-exitosa", { state: { pedido } });
    } catch (err) {
      setError(err.message);
    } finally {
      setPagando(false);
    }
  }

  return (
    <main className="contenedor">
      <h1 className="titulo-seccion">Mi carrito de compras</h1>
      <div className="carrito-layout">
        <section className="carrito-items">
          {items.length === 0 ? (
            <p className="carrito-vacio">
              Tu carrito está vacío. <Link to="/productos">Ver productos</Link>
            </p>
          ) : (
            items.map((item) => (
              <div className="item-carrito" key={item.id}>
                <div className="info-item">
                  <strong>{item.nombre}</strong>
                  <p>${formatearPrecio(item.precio)} c/u</p>
                </div>
                <div className="cantidad-controles">
                  <button type="button" onClick={() => cambiarCantidad(item.id, -1)}>−</button>
                  <span>{item.cantidad}</span>
                  <button type="button" onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                </div>
                <strong>${formatearPrecio(item.precio * item.cantidad)}</strong>
                <button type="button" className="btn pequeno peligro" onClick={() => eliminar(item.id)}>
                  Eliminar
                </button>
              </div>
            ))
          )}
        </section>

        <aside className="carrito-resumen">
          <h2>Resumen</h2>
          <p>Total: <strong>${formatearPrecio(total)}</strong></p>
          {error && <p className="mensaje-error" style={{ display: "block" }}>{error}</p>}
          <button
            type="button"
            className="btn secundario"
            style={{ background: "#eee", color: "#333" }}
            onClick={vaciar}
          >
            Vaciar carrito
          </button>
          <button
            type="button"
            className="btn"
            style={{ width: "100%", marginTop: "10px" }}
            onClick={pagar}
            disabled={items.length === 0 || pagando}
          >
            {pagando ? "Procesando..." : "Pagar"}
          </button>
          {!usuario && items.length > 0 && (
            <p className="pista">Debes iniciar sesión para pagar.</p>
          )}
        </aside>
      </div>
    </main>
  );
}

export default Carrito;
