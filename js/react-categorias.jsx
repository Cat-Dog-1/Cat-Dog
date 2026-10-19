// ===== Sección "Explora por categoría" hecha con React =====
// Usa los datos y funciones que ya existen en js/productos.js y js/carrito.js

// Componente 1: una tarjeta de producto (recibe el producto por props)
function TarjetaProducto({ producto }) {
  return (
    <article
      className="producto"
      data-id={producto.id}
      data-nombre={producto.nombre}
      data-precio={producto.precio}
      data-imagen={producto.imagen}
    >
      <img
        src={producto.imagen}
        alt={producto.nombre}
        onError={(e) => { e.target.src = "https://placehold.co/200x140?text=CatDog"; }}
      />
      <h3>{producto.nombre}</h3>
      <p className="precio">${formatearPrecio(producto.precio)}</p>
      <button type="button" className="btn pequeno btn-agregar">Agregar al carrito</button>
      <a className="ver-mas" href={"producto-detalle.html?id=" + producto.id}>Ver detalle</a>
    </article>
  );
}

// Componente 2: botones de categoría + lista filtrada (usa estado)
function ExplorarCategorias() {
  const [categoria, setCategoria] = React.useState("Todos");
  const categorias = ["Todos", "Alimento", "Juguetes", "Accesorios", "Higiene"];

  const lista = categoria === "Todos"
    ? productos
    : productos.filter((p) => p.categoria === categoria);

  return (
    <section className="contenedor">
      <h2 className="titulo-seccion">Explora por categoría</h2>

      <div className="texto-centrado" style={{ marginBottom: "20px" }}>
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
             className="btn pequeno"
            style={{
              margin: "4px",
              background: c === categoria ? "#ff7a3d" : "white",
              color: c === categoria ? "white" : "#2c3e50",
              border: "2px solid #ff7a3d"
            }}
            onClick={() => setCategoria(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid-productos">
        {lista.map((p) => (
          <TarjetaProducto key={p.id} producto={p} />
        ))}
      </div>
    </section>
  );
}

// Dibuja el componente dentro de <div id="react-raiz"> en index.html
ReactDOM.createRoot(document.getElementById("react-raiz")).render(<ExplorarCategorias />);