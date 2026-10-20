import { useState } from "react";
import Campo from "../components/Campo";
import { llamarApi } from "../services/api";
import { validarCorreo, validarTexto, sinErrores } from "../utils/validaciones";

const vacio = { nombre: "", correo: "", comentario: "" };

function Contacto() {
  const [datos, setDatos] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorApi, setErrorApi] = useState("");

  function validar(valores) {
    return {
      nombre: validarTexto(valores.nombre, 100),
      correo: validarCorreo(valores.correo),
      comentario: validarTexto(valores.comentario, 500),
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
    setExito(false);

    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (!sinErrores(nuevosErrores)) return;

    try {
      await llamarApi("/mensajes", {
        method: "POST",
        body: JSON.stringify({
          nombre: datos.nombre.trim(),
          correo: datos.correo.trim(),
          comentario: datos.comentario.trim(),
        }),
      });
      setErrorApi("");
      setExito(true);
      setDatos(vacio);
      setEnviado(false);
    } catch (error) {
      setErrorApi(error.message);
    }
  }

  return (
    <main className="contenedor texto-centrado">
      <img src="/img/CatDog.png" alt="Logo CatDog" style={{ width: "90px", margin: "20px auto" }} />
      <h1>CatDog</h1>

      <form className="tarjeta-form" noValidate style={{ textAlign: "left" }} onSubmit={enviar}>
        {exito && <div className="alerta-exito" style={{ display: "block" }}>¡Tu mensaje fue enviado! Te responderemos pronto.</div>}
        {errorApi && <p className="mensaje-error" style={{ display: "block" }}>{errorApi}</p>}

        <h2 style={{ textAlign: "center" }}>Formulario de contacto</h2>

        <Campo id="nombre" etiqueta="Nombre completo" error={errores.nombre} mostrarEstado={enviado}>
          <input type="text" id="nombre" name="nombre" autoComplete="name"
            value={datos.nombre} onChange={cambiar} />
        </Campo>

        <Campo id="correo" etiqueta="Correo" error={errores.correo} mostrarEstado={enviado}>
          <input type="email" id="correo" name="correo" placeholder="nombre@duoc.cl"
            autoComplete="email" value={datos.correo} onChange={cambiar} />
        </Campo>

        <Campo id="comentario" etiqueta="Comentario (máx. 500 caracteres)" error={errores.comentario}
          mostrarEstado={enviado} pista={`${datos.comentario.length}/500`}>
          <textarea id="comentario" name="comentario" rows="5"
            value={datos.comentario} onChange={cambiar} />
        </Campo>

        <button type="submit" className="btn" style={{ width: "100%" }}>Enviar mensaje</button>
      </form>
    </main>
  );
}

export default Contacto;
