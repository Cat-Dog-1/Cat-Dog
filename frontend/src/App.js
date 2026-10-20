
import './App.css';

function App() {
  return (
    <div>
      <header className="principal">
        <div className="barra-nav">
          <a href="/" className="logo">
            <img
              src="/img/CatDog.png"
              alt="Logo CatDog"
            />
          </a>

          <nav className="menu">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/productos">Productos</a></li>
              <li><a href="/nosotros">Nosotros</a></li>
              <li><a href="/blogs">Blogs</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
          </nav>

          <div className="acciones-header">
            <a href="/login">Iniciar sesión</a>
            <a href="/registro">Registrarse</a>
            <a href="/carrito">🛒 0</a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="texto">
            <h1>Todo lo que tu mascota necesita</h1>
            <p>
              Alimento, juguetes, accesorios e higiene
              con despacho a todo Chile.
            </p>
            <a href="/productos" className="btn">
              Ver productos
            </a>
            {' '}
            <a href="/nosotros" className="btn secundario">
              Conócenos
            </a>
          </div>

          <div className="imagen">
            <img
              src="/img/tienda.png"
              alt="Tienda CatDog de perros y gatos"
            />
          </div>
        </section>

        <section className="contenedor">
          <h2 className="titulo-seccion">
            Bienvenido a Cat-Dog
          </h2>
          <p className="texto-centrado">
            Estamos preparando nuestra tienda para ti.
          </p>
        </section>
      </main>

      <footer className="principal">
        <p>© 2026 CatDog. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
