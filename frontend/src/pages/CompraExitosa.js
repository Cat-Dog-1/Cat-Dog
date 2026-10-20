import { Link, Navigate, useLocation } from "react-router-dom";
import Boleta from "../components/Boleta";

// Se muestra después de pagar. El pedido llega desde la página Carrito.
function CompraExitosa() {
  const { state } = useLocation();
  if (!state?.pedido) return <Navigate to="/" replace />;

  return (
    <main className="contenedor">
      <h1 className="titulo-seccion">¡Gracias por tu compra! 🐾</h1>
      <Boleta pedido={state.pedido} />
      <p className="texto-centrado" style={{ marginTop: "20px" }}>
        <Link to="/productos" className="btn">Seguir comprando</Link>{" "}
        <Link to="/mis-compras" className="btn">Ver mis compras</Link>
      </p>
    </main>
  );
}

export default CompraExitosa;
