// Envuelve un campo de formulario: etiqueta + input + mensaje de error.
// Si "error" tiene texto, el campo se pinta en rojo; si no, en verde.
function Campo({ id, etiqueta, error, mostrarEstado, pista, children }) {
  let clase = "campo";
  if (mostrarEstado) clase += error ? " invalido" : " valido";

  return (
    <div className={clase}>
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      <span className="mensaje-error">{error}</span>
      {pista && <p className="pista">{pista}</p>}
    </div>
  );
}

export default Campo;
