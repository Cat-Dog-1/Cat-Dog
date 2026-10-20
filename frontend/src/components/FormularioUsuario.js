import { useState } from "react";
import Campo from "./Campo";
import SelectRegionComuna from "./SelectRegionComuna";
import {
  validarRun, validarTexto, validarCorreo, validarClave,
  validarConfirmacion, validarRequerido, sinErrores,
} from "../utils/validaciones";

const vacio = {
  run: "", nombre: "", apellidos: "", correo: "", clave: "", confirmarClave: "",
  telefono: "", tipo: "", region: "", comuna: "", direccion: "",
};

// Formulario de usuario reutilizable: lo usan Registro y el panel de administración.
// Props:
//  - inicial: datos para editar (opcional)
//  - conTipo: muestra el select "Tipo de usuario" (solo admin)
//  - claveOpcional: al editar, la contraseña solo se valida si se escribe una nueva
//  - onGuardar(datos): función del padre que guarda; si devuelve true, se limpia el formulario
function FormularioUsuario({ inicial, conTipo = false, claveOpcional = false, onGuardar, textoBoton, mensajeExito, errorApi }) {
  const [datos, setDatos] = useState({ ...vacio, ...inicial });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function validar(valores) {
    return {
      run: validarRun(valores.run),
      nombre: validarTexto(valores.nombre, 50),
      apellidos: validarTexto(valores.apellidos, 100),
      correo: validarCorreo(valores.correo),
      clave: claveOpcional && !valores.clave ? "" : validarClave(valores.clave),
      confirmarClave: claveOpcional && !valores.clave ? "" : validarConfirmacion(valores.clave, valores.confirmarClave),
      tipo: conTipo ? validarRequerido(valores.tipo) : "",
      region: validarRequerido(valores.region),
      comuna: validarRequerido(valores.comuna),
      direccion: validarTexto(valores.direccion, 300),
    };
  }

  // Actualiza el estado; si ya se intentó enviar, vuelve a validar al instante
  function actualizar(nuevos) {
    setDatos(nuevos);
    if (enviado) setErrores(validar(nuevos));
  }

  function cambiar(e) {
    actualizar({ ...datos, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();
    setEnviado(true);

    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (!sinErrores(nuevosErrores)) return;

    const limpiar = await onGuardar(datos);
    if (limpiar) {
      setDatos(vacio);
      setEnviado(false);
    }
  }

  return (
    <form className="tarjeta-form ancho" noValidate onSubmit={enviar}>
      {mensajeExito && <div className="alerta-exito" style={{ display: "block" }}>{mensajeExito}</div>}
      {errorApi && <p className="mensaje-error" style={{ display: "block" }}>{errorApi}</p>}

      <Campo id="run" etiqueta="RUN (sin puntos ni guion)" error={errores.run} mostrarEstado={enviado}>
        <input type="text" id="run" name="run" placeholder="19011022K" autoComplete="off"
          value={datos.run} onChange={cambiar} />
      </Campo>

      <Campo id="nombre" etiqueta="Nombre (máx. 50)" error={errores.nombre} mostrarEstado={enviado}>
        <input type="text" id="nombre" name="nombre" autoComplete="given-name"
          value={datos.nombre} onChange={cambiar} />
      </Campo>

      <Campo id="apellidos" etiqueta="Apellidos (máx. 100)" error={errores.apellidos} mostrarEstado={enviado}>
        <input type="text" id="apellidos" name="apellidos" autoComplete="family-name"
          value={datos.apellidos} onChange={cambiar} />
      </Campo>

      <Campo id="correo" etiqueta="Correo electrónico" error={errores.correo} mostrarEstado={enviado}
        pista="Solo @duoc.cl, @profesor.duoc.cl o @gmail.com">
        <input type="email" id="correo" name="correo" placeholder="nombre@duoc.cl" autoComplete="email"
          value={datos.correo} onChange={cambiar} />
      </Campo>

      <Campo id="clave" etiqueta="Contraseña (4 a 10 caracteres)" error={errores.clave} mostrarEstado={enviado}
        pista={claveOpcional ? "Déjala vacía para mantener la contraseña actual." : undefined}>
        <input type="password" id="clave" name="clave" autoComplete="new-password"
          value={datos.clave} onChange={cambiar} />
      </Campo>

      <Campo id="confirmarClave" etiqueta="Confirmar contraseña" error={errores.confirmarClave} mostrarEstado={enviado}>
        <input type="password" id="confirmarClave" name="confirmarClave" autoComplete="new-password"
          value={datos.confirmarClave} onChange={cambiar} />
      </Campo>

      <Campo id="telefono" etiqueta="Teléfono (opcional)">
        <input type="tel" id="telefono" name="telefono" autoComplete="tel"
          value={datos.telefono} onChange={cambiar} />
      </Campo>

      {conTipo && (
        <Campo id="tipo" etiqueta="Tipo de usuario" error={errores.tipo} mostrarEstado={enviado}>
          <select id="tipo" name="tipo" value={datos.tipo} onChange={cambiar}>
            <option value="">-- Seleccione --</option>
            <option value="Administrador">Administrador</option>
            <option value="Vendedor">Vendedor</option>
            <option value="Cliente">Cliente</option>
          </select>
        </Campo>
      )}

      <SelectRegionComuna
        region={datos.region}
        comuna={datos.comuna}
        onCambiar={({ region, comuna }) => actualizar({ ...datos, region, comuna })}
        errores={errores}
        mostrarEstado={enviado}
      />

      <Campo id="direccion" etiqueta="Dirección (máx. 300 caracteres)" error={errores.direccion} mostrarEstado={enviado}>
        <input type="text" id="direccion" name="direccion" autoComplete="street-address"
          value={datos.direccion} onChange={cambiar} />
      </Campo>

      <button type="submit" className="btn" style={{ width: "100%" }}>{textoBoton}</button>
    </form>
  );
}

export default FormularioUsuario;
