import { categorias } from "../data/productos";

// Botones para filtrar por categoría.
// "seleccionada" y "onCambiar" vienen del componente padre (props).
function FiltroCategorias({ seleccionada, onCambiar }) {
  const opciones = ["Todos", ...categorias];

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
