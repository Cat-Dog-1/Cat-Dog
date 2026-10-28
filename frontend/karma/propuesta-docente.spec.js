// Pruebas con Jasmine siguiendo la "Propuesta de pruebas" del docente:
// renderizado, renderizado condicional, props, estado y eventos.
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListaProductos from "../src/components/ListaProductos";
import Campo from "../src/components/Campo";
import FiltroCategorias from "../src/components/FiltroCategorias";
import Boleta from "../src/components/Boleta";
import Contacto from "../src/pages/Contacto";
import { CarritoProvider } from "../src/context/CarritoContext";

const productos = [
  { id: 1, nombre: "Alimento Perro", precio: 24990, imagen: "/img/a.jpg" },
  { id: 2, nombre: "Pelota", precio: 4990, imagen: "/img/b.jpg" },
  { id: 3, nombre: "Correa", precio: 8990, imagen: "/img/c.jpg" },
];

function conTienda(elemento) {
  return render(<MemoryRouter><CarritoProvider>{elemento}</CarritoProvider></MemoryRouter>);
}

describe("1. Renderizado correcto", () => {
  it("la lista de productos renderiza todos los elementos del arreglo", () => {
    conTienda(<ListaProductos productos={productos} />);
    expect(screen.getAllByRole("article").length).toBe(3);
    expect(screen.getByText("Pelota")).toBeTruthy();
  });

  it("la boleta muestra cada producto y el total", () => {
    render(<Boleta pedido={{ id: 4, total: 9980, estado: "Pagado", creado_en: "2026-10-28T10:00:00",
      items: [{ nombre: "Pelota", precio: 4990, cantidad: 2 }] }} />);
    expect(screen.getByText("Boleta N° 4")).toBeTruthy();
    expect(screen.getAllByText("$9.980").length).toBe(2); // subtotal y total
  });
});

describe("2. Renderizado condicional", () => {
  it("el mensaje de error solo se muestra cuando hay un error", () => {
    const { container, rerender } = render(
      <Campo id="c" etiqueta="Correo" error="" mostrarEstado><input id="c" /></Campo>
    );
    expect(container.querySelector(".campo").classList.contains("invalido")).toBe(false);

    rerender(<Campo id="c" etiqueta="Correo" error="El correo es obligatorio." mostrarEstado><input id="c" /></Campo>);
    expect(container.querySelector(".campo").classList.contains("invalido")).toBe(true);
  });

  it("una lista vacía muestra el aviso en vez de tarjetas", () => {
    conTienda(<ListaProductos productos={[]} />);
    expect(screen.getByText("No hay productos para mostrar.")).toBeTruthy();
    expect(screen.queryAllByRole("article").length).toBe(0);
  });
});

describe("3. Propiedades (props)", () => {
  it("cada botón recibe su etiqueta y la función onClick", () => {
    const onCambiar = jasmine.createSpy("onCambiar");
    render(<FiltroCategorias seleccionada="Todos" onCambiar={onCambiar} />);
    const etiquetas = screen.getAllByRole("button").map((b) => b.textContent);
    expect(etiquetas).toEqual(["Todos", "Alimento", "Juguetes", "Accesorios", "Higiene"]);
    fireEvent.click(screen.getByText("Accesorios"));
    expect(onCambiar).toHaveBeenCalledWith("Accesorios");
  });
});

describe("4. Estado (state)", () => {
  it("el estado del formulario cambia cuando el usuario escribe", () => {
    render(<Contacto />);
    const comentario = screen.getByLabelText("Comentario (máx. 500 caracteres)");
    fireEvent.change(comentario, { target: { value: "Hola CatDog" } });
    expect(comentario.value).toBe("Hola CatDog");
    expect(screen.getByText("11/500")).toBeTruthy(); // contador que depende del estado
  });
});

describe("5. Eventos", () => {
  it("al hacer clic en Enviar con el formulario vacío se muestran los errores", () => {
    render(<Contacto />);
    fireEvent.click(screen.getByText("Enviar mensaje"));
    expect(screen.getByText("El correo es obligatorio.")).toBeTruthy();
  });

  it("al hacer clic en Agregar al carrito cambia el estado del botón", () => {
    localStorage.clear();
    conTienda(<ListaProductos productos={productos} />);
    fireEvent.click(screen.getAllByText("Agregar al carrito")[0]);
    expect(screen.getByText("¡Agregado! ✓")).toBeTruthy();
  });
});
