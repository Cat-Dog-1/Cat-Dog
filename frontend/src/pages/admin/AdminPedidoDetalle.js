import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Boleta from "../../components/Boleta";
import { useAuth } from "../../context/AuthContext";
import { useProductos } from "../../context/ProductosContext";
import { llamarApi } from "../../services/api";
import { ESTADOS_BOLETA } from "../../utils/estados";

// Detalle de una orden. Administrador y Vendedor la ven;
// solo el Administrador puede cambiar su estado (al anular, vuelve el stock).
function AdminPedidoDetalle() {
  const { id } = useParams();
  const { esAdmin } = useAuth();
  const { recargar } = useProductos();
  const [boleta, setBoleta] = useState(null);
  const [estado, setEstado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    llamarApi(`/boletas/${id}`)
      .then((b) => {
        setBoleta(b);
        setEstado(b.estado);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  async function cambiarEstado(e) {
    e.preventDefault();
    if (estado === "ANULADA" && !window.confirm("¿Anular la orden? El stock volverá a los productos.")) return;
    setMensaje("");
    setError("");
    try {
      const actualizada = await llamarApi(`/boletas/${id}/estado`, {
        method: "PUT",
        body: JSON.stringify({ estado }),
      });
      setBoleta(actualizada);
      setMensaje(`Estado actualizado a "${ESTADOS_BOLETA[actualizada.estado]}".`);
      if (actualizada.estado === "ANULADA") recargar(); // el stock cambió
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>Detalle de la orden</h1>
        <Link to="/admin/pedidos" className="btn pequeno">Volver a órdenes</Link>
      </div>
      {mensaje && <div className="alerta-exito" style={{ display: "block" }}>{mensaje}</div>}
      {error && <p className="mensaje-error" style={{ display: "block" }}>{error}</p>}
      {!boleta && !error && <p>Cargando...</p>}

      {boleta && (
        <>
          <p><strong>Cliente:</strong> {boleta.cliente} ({boleta.correo})</p>
          <Boleta pedido={boleta} />

          {esAdmin && boleta.estado !== "ANULADA" && (
            <form className="tarjeta-form" style={{ marginTop: "20px" }} onSubmit={cambiarEstado}>
              <label htmlFor="estado">Cambiar estado</label>
              <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                {Object.entries(ESTADOS_BOLETA).map(([valor, texto]) => (
                  <option key={valor} value={valor}>{texto}</option>
                ))}
              </select>
              <button type="submit" className="btn" style={{ marginTop: "10px" }}>Guardar estado</button>
            </form>
          )}
        </>
      )}
    </>
  );
}

export default AdminPedidoDetalle;
