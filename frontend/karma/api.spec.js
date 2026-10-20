// Prueba de la conversión de datos que llegan desde la base de datos
import { normalizarProducto } from "../src/services/api";
import { formatearPrecio } from "../src/data/productos";

describe("normalizarProducto", () => {
  it("convierte precio a número, stock_critico a stockCritico y agrega '/' a la imagen", () => {
    const p = normalizarProducto({
      id: "1", codigo: "P-001", nombre: "Alimento", precio: "24990.00",
      stock: 30, stock_critico: 5, categoria: "Alimento", imagen: "img/perro_alimento.jpg",
    });
    expect(p.precio).toBe(24990);
    expect(p.stockCritico).toBe(5);
    expect(p.imagen).toBe("/img/perro_alimento.jpg");
  });
});

describe("formatearPrecio", () => {
  it("usa punto como separador de miles", () => {
    expect(formatearPrecio(24990)).toBe("24.990");
  });
});
