import { formatearPrecio } from "../data/productos";
import { fechaBoleta, textoEstado } from "../utils/estados";

// Detalle de una compra: número, fecha, productos y total
function Boleta({ pedido }) {
  return (
    <div className="boleta">
      <h2>Boleta N° {pedido.id}</h2>
      <p>Fecha: {fechaBoleta(pedido)} · Estado: {textoEstado(pedido.estado)}</p>
      <table>
        <thead>
          <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          {pedido.items.map((item, i) => (
            <tr key={i}>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>
              <td>${formatearPrecio(item.precio)}</td>
              <td>${formatearPrecio(item.subtotal ?? Number(item.precio) * item.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="total">Total: <strong>${formatearPrecio(pedido.total)}</strong></p>
    </div>
  );
}

export default Boleta;
