import { Link, useParams } from "react-router-dom";
import { buscarBlogPorId } from "../data/blogs";
import Imagen from "../components/Imagen";

function BlogDetalle() {
  const { id } = useParams();
  const blog = buscarBlogPorId(id);

  if (!blog) {
    return (
      <main className="contenedor">
        <p>Artículo no encontrado. <Link to="/blogs">Volver a blogs</Link></p>
      </main>
    );
  }

  return (
    <main className="contenedor">
      <p><Link to="/blogs">&larr; Volver a blogs</Link></p>
      <Imagen
        src={blog.imagen}
        alt={blog.titulo}
        textoReemplazo="Blog"
        style={{ borderRadius: "10px", marginBottom: "16px", maxHeight: "380px", objectFit: "cover", width: "100%" }}
      />
      <h1>{blog.titulo}</h1>
      {blog.parrafos.map((texto, i) => (
        <p key={i}>{texto}</p>
      ))}
    </main>
  );
}

export default BlogDetalle;
