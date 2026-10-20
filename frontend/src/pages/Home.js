import { useState } from "react";
import { Link } from "react-router-dom";
import { useProductos } from "../context/ProductosContext";
import ListaProductos from "../components/ListaProductos";
import FiltroCategorias from "../components/FiltroCategorias";
import Imagen from "../components/Imagen";

function Home() {
  // Estado: categoría elegida en "Explora por categoría"
  const [categoria, setCategoria] = useState("Todos");
  const { productos } = useProductos(); // vienen de la base de datos

  const destacados = productos.slice(0, 4);
  const filtrados =
    categoria === "Todos" ? productos : productos.filter((p) => p.categoria === categoria);

  return (
    <main>
      <section className="hero">
        <div className="texto">
          <h1>Todo lo que tu mascota necesita</h1>
          <p>Alimento, juguetes, accesorios e higiene con despacho a todo Chile.</p>
          <Link to="/productos" className="btn">Ver productos</Link>{" "}
          <Link to="/nosotros" className="btn secundario">Conócenos</Link>
        </div>
        <div className="imagen">
          <Imagen src="/img/tienda.png" alt="Tienda CatDog con perros y gatos" />
        </div>
      </section>

      <section className="contenedor">
        <h2 className="titulo-seccion">Productos destacados</h2>
        <ListaProductos productos={destacados} />
        <p className="texto-centrado" style={{ marginTop: "20px" }}>
          <Link to="/productos" className="btn">Ver todo el catálogo</Link>
        </p>
      </section>

      <section className="contenedor">
        <h2 className="titulo-seccion">Explora por categoría</h2>
        <FiltroCategorias seleccionada={categoria} onCambiar={setCategoria} />
        <ListaProductos productos={filtrados} />
      </section>
    </main>
  );
}

export default Home;
