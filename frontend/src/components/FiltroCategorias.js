import { useProductos } from "../context/ProductosContext";
import { categoriasRespaldo } from "../data/productos";

// Botones para filtrar por categoría (las categorías vienen del backend, tabla CATEGORIA).
// "seleccionada" y "onCambiar" vienen del componente padre (props).
// Si se usa fuera de ProductosProvider (ej: en una prueba), usa las categorías de respaldo.
function FiltroCategorias({ seleccionada, onCambiar }) {
  const categorias = useProductos()?.categorias ?? categoriasRespaldo;
  const opciones = ["Todos", ...categorias.map((c) => c.nombre)];

  return (
    <div className="texto-centrado" style={{ marginBottom: "20px" }}>
      {opciones.map((c) => (
        <button
          key={c}
          type="button"
          className="btn pequeno"
          style={{
            margin: "4px",
            background: c === seleccionada ? "#ff7a3d" : "white",
            color: c === seleccionada ? "white" : "#2f4858",
            border: "2px solid #ff7a3d",
          }}
          onClick={() => onCambiar(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export default FiltroCategorias;
