import { Link } from "react-router-dom";

function NoEncontrada() {
  return (
    <main className="contenedor texto-centrado">
      <h1>Página no encontrada</h1>
      <p><Link to="/" className="btn">Volver al inicio</Link></p>
    </main>
  );
}

export default NoEncontrada;
