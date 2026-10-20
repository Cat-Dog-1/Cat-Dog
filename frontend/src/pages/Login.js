import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Campo from "../components/Campo";
import { llamarApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { validarClave, validarCorreo, sinErrores } from "../utils/validaciones";

function Login() {
  const [datos, setDatos] = useState({ correo: "", clave: "" });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false); // ya se intentó enviar
  const [errorApi, setErrorApi] = useState("");
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  function validar(valores) {
    return {
      correo: validarCorreo(valores.correo),
      clave: validarClave(valores.clave),
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

    try {
      const respuesta = await llamarApi("/usuarios/login", {
        method: "POST",
        body: JSON.stringify({ correo: datos.correo.trim(), clave: datos.clave }),
      });
      iniciarSesion(respuesta);

      // Si venía de una página protegida, vuelve ahí. Si es admin, va al panel.
      const destino = ubicacion.state?.desde
        || (respuesta.usuario.tipo === "Administrador" ? "/admin" : "/");
      navegar(destino, { replace: true });
    } catch (error) {
      setErrorApi(error.message);
    }
  }

  return (
    <main className="contenedor texto-centrado">
      <img src="/img/CatDog.png" alt="Logo CatDog" style={{ width: "100px", margin: "20px auto" }} />
      <h1>CatDog</h1>

      <form className="tarjeta-form" noValidate style={{ textAlign: "left" }} onSubmit={enviar}>
        {ubicacion.state?.desde && !errorApi && (
          <p className="aviso-respaldo">Inicia sesión para continuar.</p>
        )}
        {errorApi && <p className="mensaje-error" style={{ display: "block" }}>{errorApi}</p>}

        <Campo id="correo" etiqueta="Correo" error={errores.correo} mostrarEstado={enviado}>
          <input type="email" id="correo" name="correo" placeholder="nombre@duoc.cl"
            autoComplete="email" value={datos.correo} onChange={cambiar} />
        </Campo>

        <Campo id="clave" etiqueta="Contraseña" error={errores.clave} mostrarEstado={enviado}
          pista="Entre 4 y 10 caracteres.">
          <input type="password" id="clave" name="clave" autoComplete="current-password"
            value={datos.clave} onChange={cambiar} />
        </Campo>

        <button type="submit" className="btn" style={{ width: "100%" }}>Iniciar sesión</button>
        <p className="texto-centrado" style={{ marginTop: "14px" }}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
