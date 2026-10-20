import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../admin.css";

// Estructura del panel de administración: menú lateral + contenido
function AdminLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();
  const claseEnlace = ({ isActive }) => (isActive ? "activo" : undefined);

  function salir() {
    cerrarSesion();
    navegar("/");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="logo-admin">Cat<span>Dog</span> Admin</div>
        <nav>
          <ul>
            <li><NavLink to="/admin" end className={claseEnlace}>Dashboard</NavLink></li>
            <li><NavLink to="/admin/productos" className={claseEnlace}>Productos</NavLink></li>
            <li><NavLink to="/admin/usuarios" className={claseEnlace}>Usuarios</NavLink></li>
            <li><NavLink to="/admin/pedidos" className={claseEnlace}>Compras</NavLink></li>
            <li><Link to="/">Volver a la tienda</Link></li>
          </ul>
        </nav>
        <div style={{ padding: "20px", fontSize: "0.85rem" }}>
          <p style={{ margin: "0 0 8px" }}>👤 {usuario?.nombre}</p>
          <button type="button" className="btn pequeno" style={{ background: "#ff7a3d" }} onClick={salir}>Cerrar sesión</button>
        </div>
      </aside>

      <div className="admin-contenido">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
