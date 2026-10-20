import { useState } from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { formatearPrecio } from "../data/productos";
import Imagen from "./Imagen";

// Tarjeta de un producto. Recibe el producto por props.
function TarjetaProducto({ producto }) {
  const { agregar } = useCarrito();
  const [agregado, setAgregado] = useState(false);

  function manejarAgregar() {
    agregar(producto, 1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  }

  return (
    <article className="producto">
      <Imagen src={producto.imagen} alt={producto.nombre} textoReemplazo="PetShop" />
      <h3>{producto.nombre}</h3>
      <p className="precio">${formatearPrecio(producto.precio)}</p>
      <button type="button" className="btn pequeno" onClick={manejarAgregar}>
        {agregado ? "¡Agregado! ✓" : "Agregar al carrito"}
      </button>
      <Link className="ver-mas" to={`/producto/${producto.id}`}>Ver detalle</Link>
    </article>
  );
}

export default TarjetaProducto;
