import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Boleta from "../components/Boleta";
import { llamarApi } from "../services/api";

function MisCompras() {
  const [pedidos, setPedidos] = useState(null); // null = cargando
  const [error, setError] = useState("");

  useEffect(() => {
    llamarApi("/pedidos/mios")
      .then(setPedidos)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="contenedor">
      <h1 className="titulo-seccion">Mis compras</h1>
      {error && <p className="mensaje-error" style={{ display: "block" }}>{error}</p>}
      {!error && pedidos === null && <p className="texto-centrado">Cargando...</p>}
      {pedidos?.length === 0 && (
        <p className="texto-centrado">Aún no tienes compras. <Link to="/productos">Ver productos</Link></p>
      )}
      {pedidos?.map((p) => (
        <div key={p.id} style={{ marginBottom: "20px" }}>
          <Boleta pedido={p} />
        </div>
      ))}
    </main>
  );
}

export default MisCompras;
