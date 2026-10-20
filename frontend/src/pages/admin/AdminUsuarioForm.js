import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormularioUsuario from "../../components/FormularioUsuario";
import { llamarApi } from "../../services/api";

// Nuevo usuario (sin id) o Editar usuario (con id en la URL)
function AdminUsuarioForm() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [inicial, setInicial] = useState(null); // datos del usuario a editar
  const [errorApi, setErrorApi] = useState("");

  // Si es edición, se piden los datos del usuario a la base de datos
  useEffect(() => {
    if (!id) return;
    llamarApi(`/usuarios/${id}`)
      .then((u) =>
        setInicial({
          run: u.run, nombre: u.nombre, apellidos: u.apellidos, correo: u.correo,
          telefono: u.telefono || "", tipo: u.tipo_usuario, region: u.region || "",
          comuna: u.comuna || "", direccion: u.direccion || "",
        })
      )
      .catch((err) => setErrorApi(err.message));
  }, [id]);

  async function guardar(datos) {
    const cuerpo = {
      run: datos.run.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      clave: datos.clave,
      telefono: datos.telefono.trim(),
      tipo: datos.tipo,
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim(),
    };
    try {
      if (id) {
        await llamarApi(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(cuerpo) });
      } else {
        await llamarApi("/usuarios", { method: "POST", body: JSON.stringify(cuerpo) });
      }
      navegar("/admin/usuarios");
      return false;
    } catch (err) {
      setErrorApi(err.message);
      return false;
    }
  }

  if (id && !inicial && !errorApi) return <p>Cargando...</p>;

  return (
    <>
      <div className="admin-topbar">
        <h1>{id ? "Editar usuario" : "Nuevo usuario"}</h1>
        <Link to="/admin/usuarios" className="btn pequeno">Volver al listado</Link>
      </div>
      <FormularioUsuario
        key={id || "nuevo"}
        inicial={inicial || undefined}
        conTipo
        claveOpcional={Boolean(id)}
        onGuardar={guardar}
        textoBoton="Guardar usuario"
        errorApi={errorApi}
      />
    </>
  );
}

export default AdminUsuarioForm;
