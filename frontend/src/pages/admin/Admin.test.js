import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { simularBackend, iniciarSesionComo, irA } from '../../test-utils/simularBackend';

const filaProducto = { id: 1, codigo: 'P-001', nombre: 'Alimento Perro', descripcion: '', precio: '24990.00',
  stock: 3, stock_critico: 5, categoria: 'Alimento', imagen: 'img/perro_alimento.jpg' };
const usuario = { id: 2, run: '19011022K', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com',
  telefono: null, region: 'Región de Ñuble', comuna: 'Chillán', direccion: 'Calle 1', tipo_usuario: 'Cliente' };
const pedido = { id: 7, total: 24990, creado_en: '2026-10-28T10:00:00', cliente: 'Ana Pérez', correo: 'ana@gmail.com',
  items: [{ nombre: 'Alimento Perro', precio: 24990, cantidad: 1 }] };

beforeEach(() => {
  localStorage.clear();
  iniciarSesionComo('Administrador', 'Admin');
  window.confirm = () => true;
});

test('el dashboard muestra métricas y productos con stock crítico', async () => {
  simularBackend({ 'GET /productos': [filaProducto], 'GET /usuarios': [usuario], 'GET /pedidos': [pedido] });
  irA('/admin');
  render(<App />);
  expect(await screen.findByText('$24.990')).toBeInTheDocument(); // total vendido
  expect(screen.getByText('Alimento Perro: quedan 3')).toBeInTheDocument();
});

test('listado de productos: marca stock crítico y permite eliminar', async () => {
  const fetch = simularBackend({ 'GET /productos': [filaProducto], 'DELETE /productos/1': { ok: true } });
  irA('/admin/productos');
  render(<App />);
  expect(await screen.findByText('Crítico')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Eliminar'));
  expect(await screen.findByText('Se eliminó "Alimento Perro".')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/productos/1', expect.objectContaining({ method: 'DELETE' }));
});

test('nuevo producto: valida campos y envía un POST', async () => {
  const fetch = simularBackend({ 'POST /productos': { id: 9 }, 'GET /productos': [filaProducto] });
  irA('/admin/productos/nuevo');
  render(<App />);
  fireEvent.click(screen.getByText('Guardar producto'));
  expect(screen.getAllByText('Este campo es obligatorio.').length).toBeGreaterThan(0);
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
  escribir('Código de producto (mín. 3 caracteres)', 'P-009');
  escribir('Nombre (máx. 100)', 'Hueso');
  escribir('Precio', '3990');
  escribir('Stock', '12');
  escribir('Categoría', 'Juguetes');
  fireEvent.click(screen.getByText('Guardar producto'));
  await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/productos', expect.objectContaining({ method: 'POST' }))
  );
});

test('usuarios: lista desde la base de datos y abre la edición', async () => {
  simularBackend({ 'GET /usuarios': [usuario], 'GET /usuarios/2': usuario });
  irA('/admin/usuarios');
  render(<App />);
  expect(await screen.findByText('ana@gmail.com')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Editar'));
  expect(await screen.findByDisplayValue('Pérez')).toBeInTheDocument();
  expect(screen.getByText('Déjala vacía para mantener la contraseña actual.')).toBeInTheDocument();
});

test('compras: muestra cliente, productos y total', async () => {
  simularBackend({ 'GET /pedidos': [pedido] });
  irA('/admin/pedidos');
  render(<App />);
  expect(await screen.findByText('1 × Alimento Perro')).toBeInTheDocument();
  expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
});
