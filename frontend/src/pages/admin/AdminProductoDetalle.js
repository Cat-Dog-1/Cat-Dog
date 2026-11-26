import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatearPrecio } from "../../data/productos";
import { llamarApi, normalizarProducto } from "../../services/api";
import Imagen from "../../components/Imagen";

// Detalle de un producto en el panel (Administrador y Vendedor).
// Se pide directo al backend: GET /api/v1/productos/{id}
function AdminProductoDetalle() {
  const { id } = useParams();
  const { esAdmin } = useAuth();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    llamarApi(`/productos/${id}`)
      .then((fila) => setProducto(normalizarProducto(fila)))
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <>
      <div className="admin-topbar">
        <h1>Detalle del producto</h1>
        <Link to="/admin/productos" className="btn pequeno">Volver al listado</Link>
      </div>
      {error && <p className="mensaje-error" style={{ display: "block" }}>{error}</p>}
      {!producto && !error && <p>Cargando...</p>}
      {producto && (
        <div className="detalle-producto" style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
          <Imagen src={producto.imagen} alt={producto.nombre}
            style={{ width: "280px", height: "220px", objectFit: "cover", borderRadius: "10px" }} />
          <div>
            <h2>{producto.nombre}</h2>
            <table className="tabla-admin">
              <tbody>
                <tr><th>Código</th><td>{producto.codigo}</td></tr>
                <tr><th>Categoría</th><td>{producto.categoria}</td></tr>
                <tr><th>Precio</th><td>${formatearPrecio(producto.precio)}</td></tr>
                <tr>
                  <th>Stock</th>
                  <td>
                    {producto.stock}{" "}
                    {producto.stock <= producto.stockCritico
                      ? <span className="badge stock-critico">Crítico</span>
                      : <span className="badge stock-ok">OK</span>}
                  </td>
                </tr>
                <tr><th>Stock crítico</th><td>{producto.stockCritico}</td></tr>
                <tr><th>Descripción</th><td>{producto.descripcion || "—"}</td></tr>
              </tbody>
            </table>
            {esAdmin && (
              <p style={{ marginTop: "16px" }}>
                <Link to={`/admin/productos/editar/${producto.id}`} className="btn pequeno">Editar</Link>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminProductoDetalle;
