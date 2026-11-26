import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PERSONAL, SOLO_ADMIN } from "../utils/roles";
import "../admin.css";

// Opciones del menú lateral y qué roles las ven.
// El Vendedor solo ve Dashboard, Productos y Órdenes: el resto ni siquiera aparece.
const MENU = [
  { ruta: "/admin", texto: "Dashboard", roles: PERSONAL, exacta: true },
  { ruta: "/admin/productos", texto: "Productos", roles: PERSONAL },
  { ruta: "/admin/pedidos", texto: "Órdenes", roles: PERSONAL },
  { ruta: "/admin/categorias", texto: "Categorías", roles: SOLO_ADMIN },
  { ruta: "/admin/usuarios", texto: "Usuarios", roles: SOLO_ADMIN },
  { ruta: "/admin/mensajes", texto: "Mensajes", roles: SOLO_ADMIN },
];

// Estructura del panel: menú lateral + contenido
function AdminLayout() {
  const { usuario, tieneRol, cerrarSesion } = useAuth();
  const navegar = useNavigate();
  const claseEnlace = ({ isActive }) => (isActive ? "activo" : undefined);

  function salir() {
    cerrarSesion();
    navegar("/");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="logo-admin">Cat<span>Dog</span> Panel</div>
        <nav aria-label="Menú del panel">
          <ul>
            {MENU.filter((op) => tieneRol(op.roles)).map((op) => (
              <li key={op.ruta}>
                <NavLink to={op.ruta} end={op.exacta} className={claseEnlace}>{op.texto}</NavLink>
              </li>
            ))}
            <li><Link to="/">Volver a la tienda</Link></li>
          </ul>
        </nav>
        <div style={{ padding: "20px", fontSize: "0.85rem" }}>
          <p style={{ margin: "0 0 4px" }}>👤 {usuario?.nombre}</p>
          <p style={{ margin: "0 0 8px" }}><span className="badge stock-ok">{usuario?.tipo}</span></p>
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
