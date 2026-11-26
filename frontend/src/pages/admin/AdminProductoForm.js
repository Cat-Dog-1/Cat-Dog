import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Campo from "../../components/Campo";
import { useProductos } from "../../context/ProductosContext";
import { llamarApi } from "../../services/api";
import {
  validarRequerido, validarLargoMax, validarTexto, validarNumeroNoNegativo, sinErrores,
} from "../../utils/validaciones";

const vacio = {
  codigo: "", nombre: "", descripcion: "", precio: "", stock: "",
  stockCritico: "", categoriaId: "", imagen: "img/",
};

// Sirve para "Nuevo producto" (sin id) y "Editar producto" (con id en la URL)
function AdminProductoForm() {
  const { id } = useParams();
  const { buscarPorId, recargar, categorias } = useProductos();
  const navegar = useNavigate();
  const existente = id ? buscarPorId(id) : null;

  const [datos, setDatos] = useState(
    existente
      ? {
          codigo: existente.codigo || "",
          nombre: existente.nombre,
          descripcion: existente.descripcion || "",
          precio: existente.precio,
          stock: existente.stock,
          stockCritico: existente.stockCritico,
          // categoriaId viene del backend; si no, se busca por el nombre
          categoriaId: String(existente.categoriaId
            ?? categorias.find((c) => c.nombre === existente.categoria)?.id ?? ""),
          imagen: (existente.imagen || "").replace(/^\//, ""), // en la BD se guarda sin "/"
        }
      : vacio
  );
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [errorApi, setErrorApi] = useState("");

  function validar(valores) {
    return {
      codigo: validarRequerido(valores.codigo) ||
        (String(valores.codigo).trim().length < 3 ? "Mínimo 3 caracteres." : ""),
      nombre: validarTexto(valores.nombre, 100),
      descripcion: validarLargoMax(valores.descripcion, 500),
      precio: validarNumeroNoNegativo(valores.precio),
      stock: validarNumeroNoNegativo(valores.stock, { entero: true }),
      categoriaId: validarRequerido(valores.categoriaId),
    };
  }

  function cambiar(e) {
    const nuevos = { ...datos, [e.target.name]: e.target.value };
    setDatos(nuevos);
    if (enviado) setErrores(validar(nuevos)); // revalida mientras escribe
  }

  async function enviar(e) {
    e.preventDefault();
    setEnviado(true);

    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (!sinErrores(nuevosErrores)) return;

    // Formato que espera el backend (ProductoRequest)
    const cuerpo = {
      codigo: datos.codigo.trim(),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      stockCritico: Number(datos.stockCritico) || 0,
      imagen: datos.imagen.trim(),
      categoriaId: Number(datos.categoriaId),
    };

    try {
      if (existente) {
        await llamarApi(`/productos/${existente.id}`, { method: "PUT", body: JSON.stringify(cuerpo) });
      } else {
        await llamarApi("/productos", { method: "POST", body: JSON.stringify(cuerpo) });
      }
      await recargar();
      navegar("/admin/productos");
    } catch (error) {
      setErrorApi(error.message);
    }
  }

  if (id && !existente) {
    return <p>Producto no encontrado. <Link to="/admin/productos">Volver</Link></p>;
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>{existente ? "Editar producto" : "Nuevo producto"}</h1>
        <Link to="/admin/productos" className="btn pequeno">Volver al listado</Link>
      </div>

      <form className="tarjeta-form ancho" style={{ margin: 0 }} noValidate onSubmit={enviar}>
        {errorApi && <p className="mensaje-error" style={{ display: "block" }}>{errorApi}</p>}

        <Campo id="codigo" etiqueta="Código de producto (mín. 3 caracteres)" error={errores.codigo} mostrarEstado={enviado}>
          <input type="text" id="codigo" name="codigo" placeholder="P-009" value={datos.codigo} onChange={cambiar} />
        </Campo>

        <Campo id="nombre" etiqueta="Nombre (máx. 100)" error={errores.nombre} mostrarEstado={enviado}>
          <input type="text" id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} />
        </Campo>

        <Campo id="descripcion" etiqueta="Descripción (opcional, máx. 500)" error={errores.descripcion} mostrarEstado={enviado}>
          <textarea id="descripcion" name="descripcion" rows="4" value={datos.descripcion} onChange={cambiar} />
        </Campo>

        <Campo id="precio" etiqueta="Precio" error={errores.precio} mostrarEstado={enviado}>
          <input type="number" id="precio" name="precio" min="0" value={datos.precio} onChange={cambiar} />
        </Campo>

        <Campo id="stock" etiqueta="Stock" error={errores.stock} mostrarEstado={enviado}>
          <input type="number" id="stock" name="stock" min="0" step="1" value={datos.stock} onChange={cambiar} />
        </Campo>

        <Campo id="stockCritico" etiqueta="Stock crítico (opcional)">
          <input type="number" id="stockCritico" name="stockCritico" min="0" step="1"
            value={datos.stockCritico} onChange={cambiar} />
        </Campo>

        <Campo id="categoriaId" etiqueta="Categoría" error={errores.categoriaId} mostrarEstado={enviado}>
          <select id="categoriaId" name="categoriaId" value={datos.categoriaId} onChange={cambiar}>
            <option value="">-- Seleccione --</option>
            {categorias.map((c) => <option key={c.id} value={String(c.id)}>{c.nombre}</option>)}
          </select>
        </Campo>

        <Campo id="imagen" etiqueta="Imagen (opcional)"
          pista="Nombre del archivo dentro de frontend/public/img. Ej: img/pelota.jpg">
          <input type="text" id="imagen" name="imagen" value={datos.imagen} onChange={cambiar} />
        </Campo>

        <button type="submit" className="btn" style={{ width: "100%" }}>Guardar producto</button>
      </form>
    </>
  );
}

export default AdminProductoForm;
