import { Link } from "react-router-dom";
import blogs from "../data/blogs";
import Imagen from "../components/Imagen";

function Blogs() {
  return (
    <main className="contenedor">
      <h1 className="titulo-seccion">Noticias importantes</h1>

      {blogs.map((blog) => (
        <article className="blog-card" key={blog.id}>
          <Imagen src={blog.imagen} alt={blog.titulo} textoReemplazo="Blog" />
          <div className="contenido">
            <h2>Caso curioso #{blog.id}: {blog.titulo}</h2>
            <p>{blog.resumen}</p>
            <Link to={`/blogs/${blog.id}`} className="btn pequeno">Ver caso</Link>
          </div>
        </article>
      ))}
    </main>
  );
}

export default Blogs;
