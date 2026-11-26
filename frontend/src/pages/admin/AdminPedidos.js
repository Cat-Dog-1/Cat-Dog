import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { llamarApi } from "../../services/api";
import { formatearPrecio } from "../../data/productos";
import { fechaBoleta, textoEstado } from "../../utils/estados";

// Órdenes de compra (boletas). Administrador y Vendedor.
function AdminPedidos() {
  const [boletas, setBoletas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    llamarApi("/boletas").then(setBoletas).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <div className="admin-topbar">
        <h1>Órdenes de compra</h1>
      </div>
      {error && <p className="mensaje-error" style={{ display: "block" }}>{error}</p>}
      {boletas.length === 0 && !error && <p>Aún no hay compras.</p>}

      {boletas.length > 0 && (
        <table className="tabla-admin">
          <thead>
            <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {boletas.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{fechaBoleta(b)}</td>
                <td>{b.cliente || "—"}<br /><small>{b.correo}</small></td>
                <td>{b.items.map((i) => `${i.cantidad} × ${i.nombre}`).join(", ")}</td>
                <td>${formatearPrecio(b.total)}</td>
                <td>
                  <span className={`badge ${b.estado === "ANULADA" ? "stock-critico" : "stock-ok"}`}>
                    {textoEstado(b.estado)}
                  </span>
                </td>
                <td><Link to={`/admin/pedidos/${b.id}`} className="btn pequeno">Ver detalle</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default AdminPedidos;
