import { useCallback, useEffect, useState } from "react";
import { llamarApi } from "../../services/api";

// Mensajes enviados desde el formulario de Contacto. Solo Administrador.
function AdminMensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [error, setError] = useState("");

  const cargar = useCallback(() => {
    llamarApi("/mensajes").then(setMensajes).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function eliminar(m) {
    if (!window.confirm(`¿Eliminar el mensaje de ${m.nombre}?`)) return;
    try {
      await llamarApi(`/mensajes/${m.id}`, { method: "DELETE" });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>Mensajes de contacto</h1>
      </div>
      {error && <p className="mensaje-error" style={{ display: "block" }}>{error}</p>}
      {mensajes.length === 0 && !error && <p>No hay mensajes.</p>}
      {mensajes.length > 0 && (
        <table className="tabla-admin">
          <thead>
            <tr><th>Fecha</th><th>Nombre</th><th>Correo</th><th>Comentario</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {mensajes.map((m) => (
              <tr key={m.id}>
                <td>{new Date(m.fecha).toLocaleString("es-CL")}</td>
                <td>{m.nombre}</td>
                <td>{m.correo}</td>
                <td>{m.comentario}</td>
                <td>
                  <button type="button" className="btn pequeno peligro" onClick={() => eliminar(m)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default AdminMensajes;
