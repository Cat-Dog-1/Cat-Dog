import { normalizarProducto } from './api';

test('convierte un producto de la base de datos al formato de React', () => {
  const fila = { id: '7', codigo: 'P-007', nombre: 'Rascador', precio: '22990.00', stock: 8,
    stock_critico: 2, categoria: 'Accesorios', imagen: 'img/rascador.jpg' };
  expect(normalizarProducto(fila)).toEqual({
    id: 7, codigo: 'P-007', nombre: 'Rascador', descripcion: '', precio: 22990, stock: 8,
    stockCritico: 2, categoria: 'Accesorios', imagen: '/img/rascador.jpg',
  });
});
