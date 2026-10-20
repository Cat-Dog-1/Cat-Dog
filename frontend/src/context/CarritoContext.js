// ===== Carrito de compras compartido por toda la app =====
// Usa Context para que cualquier componente (Header, tarjetas, página Carrito)
// pueda leer y cambiar el carrito. Se guarda en localStorage.
import { createContext, useContext, useEffect, useState } from "react";

const CLAVE_CARRITO = "petshop_carrito";
const CarritoContext = createContext(null);

function leerCarritoGuardado() {
  try {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarritoGuardado);

  // Cada vez que cambia el carrito, se guarda en localStorage
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }, [items]);

  function agregar(producto, cantidad = 1) {
    setItems((actuales) => {
      const existente = actuales.find((i) => i.id === producto.id);
      if (existente) {
        return actuales.map((i) =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [...actuales, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad }];
    });
  }

  function cambiarCantidad(id, delta) {
    setItems((actuales) =>
      actuales
        .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter((i) => i.cantidad > 0)
    );
  }

  function eliminar(id) {
    setItems((actuales) => actuales.filter((i) => i.id !== id));
  }

  function vaciar() {
    setItems([]);
  }

  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ items, agregar, cambiarCantidad, eliminar, vaciar, total, cantidadTotal }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

// Atajo para usar el carrito: const { agregar } = useCarrito();
export function useCarrito() {
  return useContext(CarritoContext);
}
