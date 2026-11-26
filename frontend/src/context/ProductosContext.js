// ===== Productos y categorías de la tienda =====
// Se cargan desde el backend (GET /productos y GET /categorias).
// Si el backend está apagado, se usan los datos de respaldo de data/productos.js
// para que la tienda igual se vea.
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import productosRespaldo, { categoriasRespaldo } from "../data/productos";
import { llamarApi, normalizarProducto } from "../services/api";

const ProductosContext = createContext(null);

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState(productosRespaldo);
  const [categorias, setCategorias] = useState(categoriasRespaldo);
  const [desdeApi, setDesdeApi] = useState(false); // true = vienen de la base de datos

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

  const recargarCategorias = useCallback(async () => {
    try {
      setCategorias(await llamarApi("/categorias"));
    } catch {
      setCategorias(categoriasRespaldo);
    }
  }, []);

  // Al abrir la página, se piden los productos y las categorías una vez
  useEffect(() => {
    recargar();
    recargarCategorias();
  }, [recargar, recargarCategorias]);

  function buscarPorId(id) {
    return productos.find((p) => p.id === Number(id));
  }

  return (
    <ProductosContext.Provider
      value={{ productos, categorias, desdeApi, recargar, recargarCategorias, buscarPorId }}
    >
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}
