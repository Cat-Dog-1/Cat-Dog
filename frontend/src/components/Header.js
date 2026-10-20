import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

// Barra superior de la tienda. NavLink marca en naranjo la página actual.
function Header() {
  const { cantidadTotal } = useCarrito();
  const { usuario, esAdmin, cerrarSesion } = useAuth();
  const navegar = useNavigate();

  function salir() {
    cerrarSesion();
    navegar("/");
  }

  return (
    <header className="principal">
      <div className="barra-nav">
        <Link to="/" className="logo">
          <img src="/img/CatDog.png" alt="Logo CatDog" />
        </Link>

        <nav className="menu">
          <ul>
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/productos">Productos</NavLink></li>
            <li><NavLink to="/nosotros">Nosotros</NavLink></li>
            <li><NavLink to="/blogs">Blogs</NavLink></li>
            <li><NavLink to="/contacto">Contacto</NavLink></li>
          </ul>
        </nav>

        <div className="acciones-header">
          {usuario ? (
            <>
              <span>Hola, {usuario.nombre}</span>
              {esAdmin && <Link to="/admin">Admin</Link>}
              <Link to="/mis-compras">Mis compras</Link>
              <button type="button" className="enlace-boton" onClick={salir}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro">Registrarse</Link>
            </>
          )}
          <Link to="/carrito" id="contador-carrito">🛒 {cantidadTotal}</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
