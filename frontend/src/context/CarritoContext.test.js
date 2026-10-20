import { renderHook, act } from '@testing-library/react';
import { CarritoProvider, useCarrito } from './CarritoContext';

const pelota = { id: 3, nombre: 'Pelota', precio: 4990 };
const correa = { id: 4, nombre: 'Correa', precio: 8990 };

beforeEach(() => localStorage.clear());

function usarCarrito() {
  return renderHook(() => useCarrito(), { wrapper: CarritoProvider });
}

test('suma cantidades y calcula el total', () => {
  const { result } = usarCarrito();
  act(() => result.current.agregar(pelota, 2));
  act(() => result.current.agregar(correa, 1));
  expect(result.current.cantidadTotal).toBe(3);
  expect(result.current.total).toBe(4990 * 2 + 8990);
});

test('al restar hasta 0 el producto sale del carrito', () => {
  const { result } = usarCarrito();
  act(() => result.current.agregar(pelota, 1));
  act(() => result.current.cambiarCantidad(3, -1));
  expect(result.current.items).toEqual([]);
});

test('el carrito se guarda en localStorage', () => {
  const { result } = usarCarrito();
  act(() => result.current.agregar(pelota, 1));
  const guardado = JSON.parse(localStorage.getItem('petshop_carrito'));
  expect(guardado[0].nombre).toBe('Pelota');
});
