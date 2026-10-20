// Pruebas de componentes React con Jasmine (se dibujan en el navegador de Karma)
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FiltroCategorias from "../src/components/FiltroCategorias";
import Campo from "../src/components/Campo";
import TarjetaProducto from "../src/components/TarjetaProducto";
import { CarritoProvider } from "../src/context/CarritoContext";

describe("FiltroCategorias", () => {
  it("muestra un botón por categoría más 'Todos'", () => {
    render(<FiltroCategorias seleccionada="Todos" onCambiar={() => {}} />);
    expect(screen.getAllByRole("button").length).toBe(5);
  });

  it("avisa al padre la categoría elegida (usando un espía de Jasmine)", () => {
    const espia = jasmine.createSpy("onCambiar");
    render(<FiltroCategorias seleccionada="Todos" onCambiar={espia} />);
    fireEvent.click(screen.getByText("Juguetes"));
    expect(espia).toHaveBeenCalledWith("Juguetes");
  });
});

describe("Campo", () => {
  it("se pinta en rojo y muestra el mensaje cuando hay error", () => {
    const { container } = render(
      <Campo id="correo" etiqueta="Correo" error="El correo es obligatorio." mostrarEstado>
        <input id="correo" />
      </Campo>
    );
    expect(container.querySelector(".campo").classList.contains("invalido")).toBe(true);
    expect(screen.getByText("El correo es obligatorio.")).toBeTruthy();
  });

  it("se pinta en verde cuando no hay error", () => {
    const { container } = render(
      <Campo id="correo" etiqueta="Correo" error="" mostrarEstado>
        <input id="correo" />
      </Campo>
    );
    expect(container.querySelector(".campo").classList.contains("valido")).toBe(true);
  });
});

describe("TarjetaProducto", () => {
  const pelota = { id: 3, nombre: "Pelota de Goma", precio: 4990, imagen: "/img/pelota.jpg" };

  function dibujar() {
    return render(
      <MemoryRouter>
        <CarritoProvider>
          <TarjetaProducto producto={pelota} />
        </CarritoProvider>
      </MemoryRouter>
    );
  }

  beforeEach(() => localStorage.clear());

  it("muestra el nombre y el precio con formato chileno", () => {
    dibujar();
    expect(screen.getByText("Pelota de Goma")).toBeTruthy();
    expect(screen.getByText("$4.990")).toBeTruthy();
  });

  it("al agregar al carrito cambia el texto del botón y guarda en localStorage", () => {
    dibujar();
    fireEvent.click(screen.getByText("Agregar al carrito"));
    expect(screen.getByText("¡Agregado! ✓")).toBeTruthy();
    const carrito = JSON.parse(localStorage.getItem("petshop_carrito"));
    expect(carrito[0].cantidad).toBe(1);
  });
});
