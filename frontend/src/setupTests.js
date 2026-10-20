// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Necesario para que react-router funcione dentro de las pruebas (Jest)
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// En las pruebas no hay backend: cualquier llamada a fetch falla
// y la app usa los productos de respaldo.
beforeEach(() => {
  global.fetch = jest.fn(() => Promise.reject(new Error('Sin backend en las pruebas')));
});
