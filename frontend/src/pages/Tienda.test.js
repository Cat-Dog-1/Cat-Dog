import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';
import { simularBackend, iniciarSesionComo, irA } from '../test-utils/simularBackend';

beforeEach(() => {
  localStorage.clear();
  irA('/');
});

describe('Catálogo de productos', () => {
  test('muestra los 8 productos y filtra por categoría', () => {
    irA('/productos');
    render(<App />);
    expect(screen.getAllByText('Agregar al carrito')).toHaveLength(8);
    fireEvent.click(screen.getByRole('button', { name: 'Higiene' }));
    expect(screen.getAllByText('Agregar al carrito')).toHaveLength(2);
  });

  test('el buscador filtra por nombre y avisa cuando no hay resultados', () => {
    irA('/productos');
    render(<App />);
    fireEvent.change(screen.getByLabelText('Buscar producto'), { target: { value: 'gato' } });
    expect(screen.getAllByText('Agregar al carrito')).toHaveLength(2);
    fireEvent.change(screen.getByLabelText('Buscar producto'), { target: { value: 'zzz' } });
    expect(screen.getByText('No hay productos para mostrar.')).toBeInTheDocument();
  });

  test('el detalle muestra stock y agrega la cantidad elegida', () => {
    irA('/producto/3');
    render(<App />);
    expect(screen.getByText('Stock disponible: 50')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Cantidad:'), { target: { value: '3' } });
    fireEvent.click(screen.getByText('Añadir al carrito'));
    expect(screen.getByText('🛒 3')).toBeInTheDocument();
  });

  test('un producto que no existe muestra un aviso', () => {
    irA('/producto/999');
    render(<App />);
    expect(screen.getByText(/Producto no encontrado/)).toBeInTheDocument();
  });
});

describe('Carrito de compras', () => {
  function conProductoEnCarrito() {
    localStorage.setItem('petshop_carrito', JSON.stringify([{ id: 3, nombre: 'Pelota de Goma Resistente', precio: 4990, cantidad: 2 }]));
    irA('/carrito');
    render(<App />);
  }

  test('muestra el total y permite sumar, restar y eliminar', () => {
    conProductoEnCarrito();
    expect(screen.getAllByText('$9.980', { selector: 'strong' })).toHaveLength(2); // subtotal y total
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('🛒 3')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Eliminar'));
    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();
  });

  test('sin sesión, Pagar lleva al login', async () => {
    conProductoEnCarrito();
    fireEvent.click(screen.getByText('Pagar'));
    expect(await screen.findByText('Inicia sesión para continuar.')).toBeInTheDocument();
  });

  test('con sesión, Pagar registra la compra y muestra la boleta', async () => {
    iniciarSesionComo('Cliente');
    simularBackend({
      'POST /pedidos': { id: 12, total: 9980, estado: 'Pagado', creado_en: '2026-10-28T10:00:00',
        items: [{ nombre: 'Pelota de Goma Resistente', precio: 4990, cantidad: 2 }] },
    });
    conProductoEnCarrito();
    fireEvent.click(screen.getByText('Pagar'));
    expect(await screen.findByText('Boleta N° 12')).toBeInTheDocument();
    expect(screen.getByText('🛒 0')).toBeInTheDocument();
  });

  test('si no hay stock, muestra el error del backend y no vacía el carrito', async () => {
    iniciarSesionComo('Cliente');
    simularBackend({ 'POST /pedidos': { __error: 'No hay stock suficiente' } });
    conProductoEnCarrito();
    fireEvent.click(screen.getByText('Pagar'));
    expect(await screen.findByText('No hay stock suficiente')).toBeInTheDocument();
    expect(screen.getByText('🛒 2')).toBeInTheDocument();
  });
});

describe('Sesión de usuario', () => {
  test('login con datos inválidos muestra errores', () => {
    irA('/login');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('La contraseña debe tener entre 4 y 10 caracteres.')).toBeInTheDocument();
  });

  test('login correcto de un administrador lo lleva al panel', async () => {
    simularBackend({
      'POST /usuarios/login': { token: 't', usuario: { id: 1, nombre: 'Admin', tipo: 'Administrador' } },
      'GET /usuarios': [],
      'GET /pedidos': [],
    });
    irA('/login');
    render(<App />);
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'admin@duoc.cl' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByText('¡Hola, Admin!')).toBeInTheDocument();
  });

  test('cerrar sesión vuelve a mostrar "Iniciar sesión"', () => {
    iniciarSesionComo('Cliente');
    render(<App />);
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });
});

describe('Registro de usuario', () => {
  test('valida RUN, correo y que la comuna dependa de la región', () => {
    irA('/registro');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));
    expect(screen.getByText('El RUN es obligatorio.')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Región'), { target: { value: 'Región de Ñuble' } });
    const comunas = within(screen.getByLabelText('Comuna')).getAllByRole('option');
    expect(comunas.map((o) => o.textContent)).toContain('Chillán');
  });

  test('un registro válido muestra el mensaje de éxito', async () => {
    simularBackend({ 'POST /usuarios/registro': { id: 20 } });
    irA('/registro');
    render(<App />);
    const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
    escribir('RUN (sin puntos ni guion)', '19011022K');
    escribir('Nombre (máx. 50)', 'Ana');
    escribir('Apellidos (máx. 100)', 'Pérez');
    escribir('Correo electrónico', 'ana@gmail.com');
    escribir('Contraseña (4 a 10 caracteres)', 'abcd');
    escribir('Confirmar contraseña', 'abcd');
    escribir('Región', 'Región de Ñuble');
    escribir('Comuna', 'Chillán');
    escribir('Dirección (máx. 300 caracteres)', 'Calle 1');
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));
    expect(await screen.findByText('¡Registro exitoso! Ya puedes iniciar sesión.')).toBeInTheDocument();
  });
});

describe('Páginas informativas', () => {
  test('blogs lista los artículos y abre el detalle', () => {
    irA('/blogs');
    render(<App />);
    fireEvent.click(screen.getAllByText('Ver caso')[0]);
    expect(screen.getByText('¿Por qué los gatos ronronean?', { selector: 'h1' })).toBeInTheDocument();
  });

  test('nosotros muestra al equipo', () => {
    irA('/nosotros');
    render(<App />);
    expect(screen.getByText('Karina Soto')).toBeInTheDocument();
    expect(screen.getByText('Claudia Gonzalez')).toBeInTheDocument();
  });

  test('una dirección inexistente muestra "Página no encontrada"', () => {
    irA('/no-existe');
    render(<App />);
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
  });

  test('mis compras lista las boletas del usuario', async () => {
    iniciarSesionComo('Cliente');
    simularBackend({ 'GET /pedidos/mios': [{ id: 5, total: 4990, estado: 'Pagado', creado_en: '2026-10-28T10:00:00',
      items: [{ nombre: 'Pelota', precio: 4990, cantidad: 1 }] }] });
    irA('/mis-compras');
    render(<App />);
    expect(await screen.findByText('Boleta N° 5')).toBeInTheDocument();
  });
});
