import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProductos } from "../../context/ProductosContext";
import { llamarApi } from "../../services/api";
import { formatearPrecio } from "../../data/productos";

function AdminHome() {
  const { usuario, esAdmin } = useAuth();
  const { productos } = useProductos();
  const [usuarios, setUsuarios] = useState([]);
  const [boletas, setBoletas] = useState([]);

  // Al entrar se piden las órdenes; los usuarios solo si es Administrador
  // (para un Vendedor el backend respondería 403).
  useEffect(() => {
    llamarApi("/boletas").then(setBoletas).catch(() => {});
    if (esAdmin) llamarApi("/usuarios").then(setUsuarios).catch(() => {});
  }, [esAdmin]);

  const stockCritico = productos.filter((p) => p.stock <= p.stockCritico);
  const ventas = boletas
    .filter((b) => b.estado !== "ANULADA")
    .reduce((suma, b) => suma + Number(b.total), 0);

  const tarjetas = [
    { titulo: "Productos", valor: productos.length },
    { titulo: "Órdenes", valor: boletas.length },
    { titulo: "Total vendido", valor: `$${formatearPrecio(ventas)}` },
    { titulo: "Stock crítico", valor: stockCritico.length },
  ];
  if (esAdmin) tarjetas.splice(1, 0, { titulo: "Usuarios registrados", valor: usuarios.length });

  return (
    <>
      <div className="admin-topbar">
        <h1>¡Hola, {usuario?.nombre}!</h1>
        <span className="badge stock-ok">Rol: {usuario?.tipo}</span>
      </div>
      {!esAdmin && (
        <p className="aviso-respaldo">
          Como Vendedor puedes revisar los <Link to="/admin/productos">productos</Link> y
          las <Link to="/admin/pedidos">órdenes</Link> (solo lectura).
        </p>
      )}
      <section className="grid-productos">
        {tarjetas.map((t) => (
          <article className="producto" key={t.titulo}>
            <h3>{t.titulo}</h3>
            <p className="precio">{t.valor}</p>
          </article>
        ))}
      </section>

      {stockCritico.length > 0 && (
        <>
          <h2 style={{ marginTop: "30px" }}>Productos con stock crítico</h2>
          <ul>
            {stockCritico.map((p) => (
              <li key={p.id}>{p.nombre}: quedan {p.stock}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default AdminHome;
