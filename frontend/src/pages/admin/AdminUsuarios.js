import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { llamarApi } from "../../services/api";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargar = useCallback(() => {
    llamarApi("/usuarios")
      .then(setUsuarios)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function eliminar(u) {
    if (!window.confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}?`)) return;
    try {
      await llamarApi(`/usuarios/${u.id}`, { method: "DELETE" });
      setMensaje(`Se eliminó a ${u.nombre}.`);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>Listado de usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn pequeno">+ Nuevo usuario</Link>
      </div>

      {error && <p className="mensaje-error" style={{ display: "block" }}>{error}</p>}
      {mensaje && <div className="alerta-exito" style={{ display: "block" }}>{mensaje}</div>}

      <table className="tabla-admin">
        <thead>
          <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th>Comuna</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.run}</td>
              <td>{u.nombre} {u.apellidos}</td>
              <td>{u.correo}</td>
              <td>{u.tipo_usuario}</td>
              <td>{u.comuna}</td>
              <td className="acciones-fila">
                <Link to={`/admin/usuarios/editar/${u.id}`} className="btn pequeno">Editar</Link>
                <button type="button" className="btn pequeno peligro" onClick={() => eliminar(u)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AdminUsuarios;
