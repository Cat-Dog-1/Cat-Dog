import { render, screen, fireEvent } from '@testing-library/react';
import Contacto from './Contacto';

test('muestra errores si se envía el formulario vacío', () => {
  render(<Contacto />);
  fireEvent.click(screen.getByText('Enviar mensaje'));
  expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument();
});

test('el error desaparece al escribir un correo válido', () => {
  render(<Contacto />);
  fireEvent.click(screen.getByText('Enviar mensaje'));
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'karina@duoc.cl' } });
  expect(screen.queryByText('El correo es obligatorio.')).not.toBeInTheDocument();
});
