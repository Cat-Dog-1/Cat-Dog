// Pruebas unitarias con Jasmine de las validaciones de formularios
import {
  validarCorreo, validarRun, validarClave, validarConfirmacion,
  validarTexto, validarNumeroNoNegativo, sinErrores,
} from "../src/utils/validaciones";

describe("validarCorreo", () => {
  it("acepta correos @duoc.cl, @profesor.duoc.cl y @gmail.com", () => {
    expect(validarCorreo("karina@duoc.cl")).toBe("");
    expect(validarCorreo("profe@profesor.duoc.cl")).toBe("");
    expect(validarCorreo("ana@gmail.com")).toBe("");
  });

  it("rechaza otros dominios", () => {
    expect(validarCorreo("ana@hotmail.com")).toContain("Solo se aceptan");
  });

  it("exige el correo", () => {
    expect(validarCorreo("")).toBe("El correo es obligatorio.");
  });
});

describe("validarRun", () => {
  it("acepta un RUN sin puntos ni guion", () => {
    expect(validarRun("19011022K")).toBe("");
  });

  it("rechaza un RUN con puntos y guion", () => {
    expect(validarRun("19.011.022-K")).not.toBe("");
  });
});

describe("contraseñas", () => {
  it("deben tener entre 4 y 10 caracteres", () => {
    expect(validarClave("1234")).toBe("");
    expect(validarClave("123")).not.toBe("");
    expect(validarClave("12345678901")).not.toBe("");
  });

  it("la confirmación debe coincidir", () => {
    expect(validarConfirmacion("abcd", "abcd")).toBe("");
    expect(validarConfirmacion("abcd", "abce")).toBe("Las contraseñas no coinciden.");
  });
});

describe("otros campos", () => {
  it("texto obligatorio con largo máximo", () => {
    expect(validarTexto("", 50)).toBe("Este campo es obligatorio.");
    expect(validarTexto("a".repeat(51), 50)).toBe("Máximo 50 caracteres.");
  });

  it("precio y stock no pueden ser negativos; el stock debe ser entero", () => {
    expect(validarNumeroNoNegativo("-1")).not.toBe("");
    expect(validarNumeroNoNegativo("2.5", { entero: true })).toBe("Debe ser un número entero.");
    expect(validarNumeroNoNegativo("10", { entero: true })).toBe("");
  });

  it("sinErrores es verdadero solo si no hay mensajes", () => {
    expect(sinErrores({ correo: "", clave: "" })).toBe(true);
    expect(sinErrores({ correo: "Error", clave: "" })).toBe(false);
  });
});
