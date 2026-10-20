import TarjetaProducto from "./TarjetaProducto";

// Grilla de productos: dibuja una TarjetaProducto por cada elemento
function ListaProductos({ productos }) {
  if (productos.length === 0) {
    return <p className="texto-centrado">No hay productos para mostrar.</p>;
  }
  return (
    <div className="grid-productos">
      {productos.map((p) => (
        <TarjetaProducto key={p.id} producto={p} />
      ))}
    </div>
  );
}

export default ListaProductos;
