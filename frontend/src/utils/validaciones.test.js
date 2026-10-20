import {
  validarCorreo, validarRun, validarClave, validarConfirmacion, validarTexto,
} from './validaciones';

test('acepta correos duoc y gmail', () => {
  expect(validarCorreo('karina@duoc.cl')).toBe('');
  expect(validarCorreo('profe@profesor.duoc.cl')).toBe('');
  expect(validarCorreo('alguien@gmail.com')).toBe('');
});

test('rechaza correos de otros dominios o vacíos', () => {
  expect(validarCorreo('alguien@hotmail.com')).not.toBe('');
  expect(validarCorreo('')).toBe('El correo es obligatorio.');
});

test('valida el RUN sin puntos ni guion', () => {
  expect(validarRun('19011022K')).toBe('');
  expect(validarRun('19.011.022-K')).not.toBe('');
  expect(validarRun('')).toBe('El RUN es obligatorio.');
});

test('la contraseña debe tener entre 4 y 10 caracteres', () => {
  expect(validarClave('1234')).toBe('');
  expect(validarClave('123')).not.toBe('');
  expect(validarClave('12345678901')).not.toBe('');
});

test('las contraseñas deben coincidir', () => {
  expect(validarConfirmacion('abcd', 'abcd')).toBe('');
  expect(validarConfirmacion('abcd', 'abce')).toBe('Las contraseñas no coinciden.');
});

test('texto obligatorio con largo máximo', () => {
  expect(validarTexto('', 50)).toBe('Este campo es obligatorio.');
  expect(validarTexto('a'.repeat(51), 50)).toBe('Máximo 50 caracteres.');
  expect(validarTexto('Karina', 50)).toBe('');
});
