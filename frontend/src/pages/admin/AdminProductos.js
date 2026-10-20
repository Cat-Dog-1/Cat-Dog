import { useState } from "react";
import { Link } from "react-router-dom";
import { useProductos } from "../../context/ProductosContext";
import { formatearPrecio } from "../../data/productos";
import { llamarApi } from "../../services/api";

function AdminProductos() {
  const { productos, desdeApi, recargar } = useProductos();
  const [mensaje, setMensaje] = useState("");

  async function eliminar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    try {
      await llamarApi(`/productos/${producto.id}`, { method: "DELETE" });
      setMensaje(`Se eliminó "${producto.nombre}".`);
      recargar();
    } catch (error) {
      setMensaje(error.message);
    }
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>Listado de productos</h1>
        <Link to="/admin/productos/nuevo" className="btn pequeno">+ Nuevo producto</Link>
      </div>

      {!desdeApi && (
        <p className="aviso-respaldo">El backend está apagado: se muestran los productos de respaldo y no se pueden guardar cambios.</p>
      )}
      {mensaje && <div className="alerta-exito" style={{ display: "block" }}>{mensaje}</div>}

      <table className="tabla-admin">
        <thead>
          <tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.codigo || `P-${String(p.id).padStart(3, "0")}`}</td>
              <td>{p.nombre}</td>
              <td>${formatearPrecio(p.precio)}</td>
              <td>
                {p.stock}{" "}
                {p.stock <= p.stockCritico
                  ? <span className="badge stock-critico">Crítico</span>
                  : <span className="badge stock-ok">OK</span>}
              </td>
              <td>{p.categoria}</td>
              <td className="acciones-fila">
                <Link to={`/admin/productos/editar/${p.id}`} className="btn pequeno">Editar</Link>
                <button type="button" className="btn pequeno peligro" onClick={() => eliminar(p)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AdminProductos;
