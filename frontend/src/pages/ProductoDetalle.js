import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatearPrecio } from "../data/productos";
import { useProductos } from "../context/ProductosContext";
import { useCarrito } from "../context/CarritoContext";
import Imagen from "../components/Imagen";

function ProductoDetalle() {
  const { id } = useParams(); // el id viene de la URL: /producto/3
  const { buscarPorId } = useProductos();
  const producto = buscarPorId(id);
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  if (!producto) {
    return (
      <main className="contenedor">
        <p>Producto no encontrado. <Link to="/productos">Volver a productos</Link></p>
      </main>
    );
  }

  function manejarAgregar() {
    const n = Math.min(Math.max(Number(cantidad) || 1, 1), producto.stock);
    agregar(producto, n);
    setAgregado(true);
  }

  return (
    <main className="contenedor">
      <p><Link to="/productos">&larr; Volver a productos</Link></p>
      <div className="detalle-producto">
        <div className="galeria">
          <Imagen src={producto.imagen} alt={producto.nombre} textoReemplazo="PetShop" />
        </div>
        <div className="info">
          <h1>{producto.nombre}</h1>
          <p className="precio">${formatearPrecio(producto.precio)}</p>
          <p>{producto.descripcion}</p>
          <p className="pista">Stock disponible: {producto.stock}</p>
          <div className="selector-cantidad">
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              type="number"
              id="cantidad"
              min="1"
              max={producto.stock}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>
          <button type="button" className="btn" onClick={manejarAgregar} disabled={producto.stock === 0}>
            {producto.stock === 0 ? "Sin stock" : agregado ? "¡Agregado al carrito! ✓" : "Añadir al carrito"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductoDetalle;
