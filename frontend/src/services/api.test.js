import { llamarApi, normalizarProducto, tokenVencido, EVENTO_SESION_EXPIRADA } from './api';
import { simularBackend, tokenDePrueba } from '../test-utils/simularBackend';

beforeEach(() => localStorage.clear());

test('convierte un producto del backend al formato de React', () => {
  const fila = { id: 7, codigo: 'P-007', nombre: 'Rascador', precio: 22990, stock: 8,
    stockCritico: 2, categoriaId: 3, categoria: 'Accesorios', imagen: 'img/rascador.jpg' };
  expect(normalizarProducto(fila)).toEqual({
    id: 7, codigo: 'P-007', nombre: 'Rascador', descripcion: '', precio: 22990, stock: 8,
    stockCritico: 2, categoria: 'Accesorios', categoriaId: 3, imagen: '/img/rascador.jpg',
  });
});

test('detecta si un token JWT está vencido', () => {
  expect(tokenVencido(tokenDePrueba(900))).toBe(false);
  expect(tokenVencido(tokenDePrueba(-10))).toBe(true);
  expect(tokenVencido('no-es-un-jwt')).toBe(true);
});

test('envía el token en la cabecera Authorization', async () => {
  const token = tokenDePrueba(900);
  localStorage.setItem('catdog_token', token);
  const fetch = simularBackend({ 'GET /boletas/mias': [] });
  await llamarApi('/boletas/mias');
  expect(fetch.mock.calls[0][1].headers.Authorization).toBe(`Bearer ${token}`);
});

test('si el token venció, lo renueva con el refresh token antes de llamar', async () => {
  localStorage.setItem('catdog_token', tokenDePrueba(-10));
  localStorage.setItem('catdog_refresh', 'refresh-1');
  const nuevo = tokenDePrueba(900);
  const fetch = simularBackend({
    'POST /auth/refresh': { token: nuevo, refreshToken: 'refresh-2', usuario: { id: 1, nombre: 'Ana', tipo: 'Cliente' } },
    'GET /boletas/mias': [],
  });
  await llamarApi('/boletas/mias');
  expect(localStorage.getItem('catdog_token')).toBe(nuevo);
  expect(localStorage.getItem('catdog_refresh')).toBe('refresh-2');
  expect(fetch.mock.calls[1][1].headers.Authorization).toBe(`Bearer ${nuevo}`);
});

test('si no se puede renovar, cierra la sesión y avisa a la app', async () => {
  localStorage.setItem('catdog_token', tokenDePrueba(-10));
  localStorage.setItem('catdog_refresh', 'refresh-vencido');
  localStorage.setItem('catdog_usuario', JSON.stringify({ id: 1, nombre: 'Ana', tipo: 'Cliente' }));
  simularBackend({
    'POST /auth/refresh': { __error: 'La sesión expiró, vuelve a iniciar sesión', __estado: 401 },
    'GET /boletas/mias': { __error: 'Debes iniciar sesión', __estado: 401 },
  });
  const aviso = jest.fn();
  window.addEventListener(EVENTO_SESION_EXPIRADA, aviso);
  await expect(llamarApi('/boletas/mias')).rejects.toThrow('Debes iniciar sesión');
  window.removeEventListener(EVENTO_SESION_EXPIRADA, aviso);
  expect(aviso).toHaveBeenCalled();
  expect(localStorage.getItem('catdog_usuario')).toBeNull();
});
