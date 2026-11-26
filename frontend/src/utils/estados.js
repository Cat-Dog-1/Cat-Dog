// Estados de una boleta tal como los envía el backend, con un texto amigable
export const ESTADOS_BOLETA = {
  PAGADA: "Pagada",
  ENVIADA: "Enviada",
  ENTREGADA: "Entregada",
  ANULADA: "Anulada",
};

export function textoEstado(estado) {
  return ESTADOS_BOLETA[estado] || estado || "—";
}

// El backend envía "fecha"; se acepta "creado_en" por compatibilidad
export function fechaBoleta(boleta) {
  const valor = boleta.fecha || boleta.creado_en;
  return valor ? new Date(valor).toLocaleString("es-CL") : "—";
}
