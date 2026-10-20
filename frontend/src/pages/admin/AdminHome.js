import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProductos } from "../../context/ProductosContext";
import { llamarApi } from "../../services/api";
import { formatearPrecio } from "../../data/productos";

function AdminHome() {
  const { usuario } = useAuth();
  const { productos } = useProductos();
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Al entrar, se piden los usuarios y las compras a la base de datos
  useEffect(() => {
    llamarApi("/usuarios").then(setUsuarios).catch(() => {});
    llamarApi("/pedidos").then(setPedidos).catch(() => {});
  }, []);

  const stockCritico = productos.filter((p) => p.stock <= p.stockCritico);
  const ventas = pedidos.reduce((suma, p) => suma + Number(p.total), 0);

  const tarjetas = [
    { titulo: "Productos", valor: productos.length },
    { titulo: "Usuarios registrados", valor: usuarios.length },
    { titulo: "Compras", valor: pedidos.length },
    { titulo: "Total vendido", valor: `$${formatearPrecio(ventas)}` },
    { titulo: "Stock crítico", valor: stockCritico.length },
  ];

  return (
    <>
      <div className="admin-topbar">
        <h1>¡Hola, {usuario?.nombre}!</h1>
      </div>
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
