import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="principal">
      <p>© 2026 CatDog. Todos los derechos reservados.</p>
      <p>
        <Link to="/contacto">Contáctanos</Link> | <Link to="/nosotros">Sobre nosotros</Link> |{" "}
        <Link to="/admin">Administración</Link>
      </p>
    </footer>
  );
}

export default Footer;
