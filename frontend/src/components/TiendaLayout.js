import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

// Estructura común de la tienda: Header arriba, página en el medio, Footer abajo
function TiendaLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default TiendaLayout;
