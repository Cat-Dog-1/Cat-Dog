// ===== Productos de la tienda =====
// Se cargan desde la base de datos (backend). Si el backend está apagado,
// se usan los productos de respaldo de data/productos.js para que la tienda
// igual se vea.
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import productosRespaldo from "../data/productos";
import { llamarApi, normalizarProducto } from "../services/api";

const ProductosContext = createContext(null);

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState(productosRespaldo);
  const [desdeApi, setDesdeApi] = useState(false); // true = vienen de Neon

  const recargar = useCallback(async () => {
    try {
      const filas = await llamarApi("/productos");
      setProductos(filas.map(normalizarProducto));
      setDesdeApi(true);
    } catch {
      setProductos(productosRespaldo);
      setDesdeApi(false);
    }
  }, []);

  // Al abrir la página, se piden los productos una vez
  useEffect(() => {
    recargar();
  }, [recargar]);

  function buscarPorId(id) {
    return productos.find((p) => p.id === Number(id));
  }

  return (
    <ProductosContext.Provider value={{ productos, desdeApi, recargar, buscarPorId }}>
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}
