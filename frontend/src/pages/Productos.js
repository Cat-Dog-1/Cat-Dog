import { useState } from "react";
import { useProductos } from "../context/ProductosContext";
import ListaProductos from "../components/ListaProductos";
import FiltroCategorias from "../components/FiltroCategorias";

function Productos() {
  const [categoria, setCategoria] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const { productos } = useProductos(); // vienen de la base de datos

  // Filtra por categoría y por texto escrito en el buscador
  const lista = productos
    .filter((p) => categoria === "Todos" || p.categoria === categoria)
    .filter((p) => p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()));

  return (
    <main className="contenedor">
      <h1 className="titulo-seccion">Todos nuestros productos</h1>

      <div className="campo" style={{ maxWidth: "400px", margin: "0 auto 10px" }}>
        <label htmlFor="buscador">Buscar producto</label>
        <input
          id="buscador"
          type="text"
          placeholder="Ej: alimento, correa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <FiltroCategorias seleccionada={categoria} onCambiar={setCategoria} />
      <ListaProductos productos={lista} />
    </main>
  );
}

export default Productos;
