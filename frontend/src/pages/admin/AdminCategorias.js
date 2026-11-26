import { useState } from "react";
import Campo from "../../components/Campo";
import { useProductos } from "../../context/ProductosContext";
import { llamarApi } from "../../services/api";
import { validarLargoMax, validarTexto, sinErrores } from "../../utils/validaciones";

const vacio = { nombre: "", descripcion: "" };

// CRUD de categorías (tabla CATEGORIA). Solo Administrador.
function AdminCategorias() {
  const { categorias, productos, recargarCategorias, desdeApi } = useProductos();
  const [datos, setDatos] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorApi, setErrorApi] = useState("");

  function validar(valores) {
    return {
      nombre: validarTexto(valores.nombre, 50),
      descripcion: validarLargoMax(valores.descripcion, 255),
    };
  }

  function cambiar(e) {
    const nuevos = { ...datos, [e.target.name]: e.target.value };
    setDatos(nuevos);
    if (enviado) setErrores(validar(nuevos));
  }

  function limpiar() {
    setDatos(vacio);
    setEditandoId(null);
    setEnviado(false);
    setErrores({});
  }

  function editar(categoria) {
    setDatos({ nombre: categoria.nombre, descripcion: categoria.descripcion || "" });
    setEditandoId(categoria.id);
    setMensaje("");
    setErrorApi("");
  }

  async function guardar(e) {
    e.preventDefault();
    setEnviado(true);
    setMensaje("");
    setErrorApi("");
    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (!sinErrores(nuevosErrores)) return;

    const cuerpo = JSON.stringify({ nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim() });
    try {
      if (editandoId) {
        await llamarApi(`/categorias/${editandoId}`, { method: "PUT", body: cuerpo });
        setMensaje(`Se actualizó la categoría "${datos.nombre.trim()}".`);
      } else {
        await llamarApi("/categorias", { method: "POST", body: cuerpo });
        setMensaje(`Se creó la categoría "${datos.nombre.trim()}".`);
      }
      limpiar();
      recargarCategorias();
    } catch (err) {
      setErrorApi(err.message);
    }
  }

  async function eliminar(categoria) {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;
    setMensaje("");
    setErrorApi("");
    try {
      await llamarApi(`/categorias/${categoria.id}`, { method: "DELETE" });
      setMensaje(`Se eliminó la categoría "${categoria.nombre}".`);
      recargarCategorias();
    } catch (err) {
      setErrorApi(err.message);
    }
  }

  const cantidadProductos = (c) => productos.filter((p) => p.categoria === c.nombre).length;

  return (
    <>
      <div className="admin-topbar">
        <h1>Categorías</h1>
      </div>
      {!desdeApi && (
        <p className="aviso-respaldo">El backend está apagado: se muestran las categorías de respaldo.</p>
      )}
      {mensaje && <div className="alerta-exito" style={{ display: "block" }}>{mensaje}</div>}
      {errorApi && <p className="mensaje-error" style={{ display: "block" }}>{errorApi}</p>}

      <form className="tarjeta-form ancho" style={{ margin: "0 0 24px" }} noValidate onSubmit={guardar}>
        <h2>{editandoId ? "Editar categoría" : "Nueva categoría"}</h2>
        <Campo id="nombre" etiqueta="Nombre (máx. 50)" error={errores.nombre} mostrarEstado={enviado}>
          <input type="text" id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} />
        </Campo>
        <Campo id="descripcion" etiqueta="Descripción (opcional)" error={errores.descripcion} mostrarEstado={enviado}>
          <input type="text" id="descripcion" name="descripcion" value={datos.descripcion} onChange={cambiar} />
        </Campo>
        <button type="submit" className="btn">{editandoId ? "Guardar cambios" : "Crear categoría"}</button>{" "}
        {editandoId && <button type="button" className="btn pequeno" onClick={limpiar}>Cancelar</button>}
      </form>

      <table className="tabla-admin">
        <thead>
          <tr><th>Nombre</th><th>Descripción</th><th>Productos</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.descripcion || "—"}</td>
              <td>{cantidadProductos(c)}</td>
              <td className="acciones-fila">
                <button type="button" className="btn pequeno" onClick={() => editar(c)}>Editar</button>
                <button type="button" className="btn pequeno peligro" onClick={() => eliminar(c)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AdminCategorias;
