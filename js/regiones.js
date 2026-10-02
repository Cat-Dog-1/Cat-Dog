// Array de regiones y comunas (ejemplo, se puede ampliar)
const regionesComunas = [
  { region: "Región Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Maipú", "Puente Alto"] },
  { region: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué"] },
  { region: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Los Ángeles"] },
  { region: "Región de Ñuble", comunas: ["Chillán", "Bulnes", "San Carlos"] },
  { region: "Región de la Araucanía", comunas: ["Temuco", "Villarrica", "Angol"] },
];

// Pobla el <select> de regiones y actualiza comunas al cambiar
function inicializarSelectRegiones(idSelectRegion, idSelectComuna) {
  const selectRegion = document.getElementById(idSelectRegion);
  const selectComuna = document.getElementById(idSelectComuna);
  if (!selectRegion || !selectComuna) return;

  selectRegion.innerHTML = `<option value="">-- Seleccione la región --</option>` +
    regionesComunas.map(r => `<option value="${r.region}">${r.region}</option>`).join("");

  selectRegion.addEventListener("change", () => {
    const encontrada = regionesComunas.find(r => r.region === selectRegion.value);
    selectComuna.innerHTML = `<option value="">-- Seleccione la comuna --</option>` +
      (encontrada ? encontrada.comunas.map(c => `<option value="${c}">${c}</option>`).join("") : "");
  });
}
