import regionesComunas from "../data/regiones";
import Campo from "./Campo";

// Dos select enlazados: al elegir una región se cargan sus comunas
function SelectRegionComuna({ region, comuna, onCambiar, errores, mostrarEstado }) {
  const encontrada = regionesComunas.find((r) => r.region === region);
  const comunas = encontrada ? encontrada.comunas : [];

  return (
    <>
      <Campo id="region" etiqueta="Región" error={errores.region} mostrarEstado={mostrarEstado}>
        <select
          id="region"
          value={region}
          onChange={(e) => onCambiar({ region: e.target.value, comuna: "" })}
        >
          <option value="">-- Seleccione la región --</option>
          {regionesComunas.map((r) => (
            <option key={r.region} value={r.region}>{r.region}</option>
          ))}
        </select>
      </Campo>

      <Campo id="comuna" etiqueta="Comuna" error={errores.comuna} mostrarEstado={mostrarEstado}>
        <select
          id="comuna"
          value={comuna}
          onChange={(e) => onCambiar({ region, comuna: e.target.value })}
        >
          <option value="">-- Seleccione la comuna --</option>
          {comunas.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Campo>
    </>
  );
}

export default SelectRegionComuna;
