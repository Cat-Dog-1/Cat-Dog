import { useState } from "react";
import FormularioUsuario from "../components/FormularioUsuario";
import { llamarApi } from "../services/api";

function Registro() {
  const [exito, setExito] = useState(false);
  const [errorApi, setErrorApi] = useState("");

  // Se ejecuta cuando el formulario pasó todas las validaciones
  async function guardar(datos) {
    setExito(false);
    try {
      await llamarApi("/usuarios/registro", {
        method: "POST",
        body: JSON.stringify({
          run: datos.run.trim().toUpperCase(),
          nombre: datos.nombre.trim(),
          apellidos: datos.apellidos.trim(),
          correo: datos.correo.trim(),
          clave: datos.clave,
          region: datos.region,
          comuna: datos.comuna,
          direccion: datos.direccion.trim(),
          telefono: datos.telefono.trim(),
        }),
      });
      setErrorApi("");
      setExito(true);
      return true; // true = limpiar formulario
    } catch (error) {
      setErrorApi(error.message);
      return false;
    }
  }

  return (
    <main className="contenedor">
      <h1 className="titulo-seccion">Registro de usuario</h1>
      <FormularioUsuario
        onGuardar={guardar}
        textoBoton="Registrar"
        mensajeExito={exito ? "¡Registro exitoso! Ya puedes iniciar sesión." : ""}
        errorApi={errorApi}
      />
    </main>
  );
}

export default Registro;
