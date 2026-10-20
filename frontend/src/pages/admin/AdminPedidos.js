import { useEffect, useState } from "react";
import { llamarApi } from "../../services/api";
import { formatearPrecio } from "../../data/productos";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    llamarApi("/pedidos").then(setPedidos).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <div className="admin-topbar">
        <h1>Compras realizadas</h1>
      </div>
      {error && <p className="mensaje-error" style={{ display: "block" }}>{error}</p>}
      {pedidos.length === 0 && !error && <p>Aún no hay compras.</p>}

      {pedidos.length > 0 && (
        <table className="tabla-admin">
          <thead>
            <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Productos</th><th>Total</th></tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{new Date(p.creado_en).toLocaleString("es-CL")}</td>
                <td>{p.cliente || "—"}<br /><small>{p.correo}</small></td>
                <td>{p.items.map((i) => `${i.cantidad} × ${i.nombre}`).join(", ")}</td>
                <td>${formatearPrecio(p.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default AdminPedidos;
