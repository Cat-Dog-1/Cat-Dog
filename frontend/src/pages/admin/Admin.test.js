import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { simularBackend, iniciarSesionComo, irA } from '../../test-utils/simularBackend';
import { within } from '@testing-library/react';

const filaProducto = { id: 1, codigo: 'P-001', nombre: 'Alimento Perro', descripcion: '', precio: '24990.00',
  stock: 3, stock_critico: 5, categoria: 'Alimento', imagen: 'img/perro_alimento.jpg' };
const usuario = { id: 2, run: '19011022K', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com',
  telefono: null, region: 'Región de Ñuble', comuna: 'Chillán', direccion: 'Calle 1', tipo: 'Cliente' };
const pedido = { id: 7, total: 24990, estado: 'PAGADA', fecha: '2026-10-28T10:00:00', cliente: 'Ana Pérez', correo: 'ana@gmail.com',
  items: [{ nombre: 'Alimento Perro', precio: 24990, cantidad: 1 }] };

beforeEach(() => {
  localStorage.clear();
  iniciarSesionComo('Administrador', 'Admin');
  window.confirm = () => true;
});

test('el dashboard muestra métricas y productos con stock crítico', async () => {
  simularBackend({ 'GET /productos': [filaProducto], 'GET /usuarios': [usuario], 'GET /boletas': [pedido] });
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
  expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/productos/1', expect.objectContaining({ method: 'DELETE' }));
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
  escribir('Categoría', '2'); // id de Juguetes
  fireEvent.click(screen.getByText('Guardar producto'));
  await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/productos', expect.objectContaining({ method: 'POST' }))
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
  simularBackend({ 'GET /boletas': [pedido] });
  irA('/admin/pedidos');
  render(<App />);
  expect(await screen.findByText('1 × Alimento Perro')).toBeInTheDocument();
  expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
});

describe('Vendedor: solo ve productos y órdenes', () => {
  beforeEach(() => {
    localStorage.clear();
    iniciarSesionComo('Vendedor', 'Vera');
  });

  test('el menú no muestra Usuarios, Categorías ni Mensajes', async () => {
    simularBackend({ 'GET /boletas': [pedido] });
    irA('/admin');
    render(<App />);
    expect(await screen.findByText('¡Hola, Vera!')).toBeInTheDocument();
    const menu = within(screen.getByRole('navigation', { name: 'Menú del panel' }));
    expect(menu.getByText('Productos')).toBeInTheDocument();
    expect(menu.getByText('Órdenes')).toBeInTheDocument();
    expect(menu.queryByText('Usuarios')).toBeNull();
    expect(menu.queryByText('Categorías')).toBeNull();
    expect(menu.queryByText('Mensajes')).toBeNull();
    expect(screen.queryByText('Usuarios registrados')).toBeNull();
  });

  test('en productos puede ver pero no editar ni eliminar', async () => {
    simularBackend({ 'GET /productos': [filaProducto] });
    irA('/admin/productos');
    render(<App />);
    expect((await screen.findAllByText('Ver')).length).toBe(1); // solo el producto del backend
    expect(screen.queryByText('Editar')).toBeNull();
    expect(screen.queryByText('Eliminar')).toBeNull();
    expect(screen.queryByText('+ Nuevo producto')).toBeNull();
  });

  test('si escribe la dirección de usuarios, ve "Acceso restringido"', () => {
    irA('/admin/usuarios');
    render(<App />);
    expect(screen.getByText('Acceso restringido')).toBeInTheDocument();
  });

  test('puede abrir el detalle de una orden pero no cambiar su estado', async () => {
    simularBackend({ 'GET /boletas/7': pedido });
    irA('/admin/pedidos/7');
    render(<App />);
    expect(await screen.findByText('Boleta N° 7')).toBeInTheDocument();
    expect(screen.queryByText('Guardar estado')).toBeNull();
  });
});

test('el administrador puede anular una orden', async () => {
  const fetch = simularBackend({
    'GET /boletas/7': pedido,
    'PUT /boletas/7/estado': { ...pedido, estado: 'ANULADA' },
  });
  irA('/admin/pedidos/7');
  render(<App />);
  fireEvent.change(await screen.findByLabelText('Cambiar estado'), { target: { value: 'ANULADA' } });
  fireEvent.click(screen.getByText('Guardar estado'));
  expect(await screen.findByText('Estado actualizado a "Anulada".')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/boletas/7/estado',
    expect.objectContaining({ method: 'PUT', body: JSON.stringify({ estado: 'ANULADA' }) }));
});

test('categorías: lista y crea una nueva', async () => {
  const fetch = simularBackend({
    'GET /categorias': [{ id: 1, nombre: 'Alimento', descripcion: '' }],
    'POST /categorias': { id: 5, nombre: 'Snacks' },
  });
  irA('/admin/categorias');
  render(<App />);
  fireEvent.change(screen.getByLabelText('Nombre (máx. 50)'), { target: { value: 'Snacks' } });
  fireEvent.click(screen.getByText('Crear categoría'));
  expect(await screen.findByText('Se creó la categoría "Snacks".')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/categorias', expect.objectContaining({ method: 'POST' }));
});
