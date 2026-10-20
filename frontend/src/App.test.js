import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, '', '/');
});

test('muestra el título principal de la tienda', () => {
  render(<App />);
  expect(screen.getByText(/Todo lo que tu mascota necesita/i)).toBeInTheDocument();
});

test('al agregar un producto el contador del carrito sube a 1', () => {
  render(<App />);
  const botones = screen.getAllByText('Agregar al carrito');
  fireEvent.click(botones[0]);
  expect(screen.getByText('🛒 1')).toBeInTheDocument();
});

test('sin sesión, entrar a /admin lleva al login', async () => {
  window.history.pushState({}, '', '/admin');
  render(<App />);
  expect(await screen.findByText('Iniciar sesión', { selector: 'button' })).toBeInTheDocument();
});

test('un cliente (no admin) no puede ver el panel de administración', async () => {
  localStorage.setItem('catdog_token', 'token-de-prueba');
  localStorage.setItem('catdog_usuario', JSON.stringify({ id: 5, nombre: 'Ana', tipo: 'Cliente' }));
  window.history.pushState({}, '', '/admin');
  render(<App />);
  expect(await screen.findByText('Acceso restringido')).toBeInTheDocument();
});

test('con sesión iniciada el header saluda al usuario', () => {
  localStorage.setItem('catdog_usuario', JSON.stringify({ id: 5, nombre: 'Ana', tipo: 'Cliente' }));
  render(<App />);
  expect(screen.getByText('Hola, Ana')).toBeInTheDocument();
  expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
});
