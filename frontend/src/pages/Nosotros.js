import Imagen from "../components/Imagen";

const equipo = [
  { nombre: "Karina Soto", rol: "Desarrollo Frontend", foto: "/img/karina.JPG" },
  { nombre: "Claudia Gonzalez", rol: "Desarrollo Frontend", foto: "/img/claw.jpg" },
];

function Nosotros() {
  return (
    <main className="contenedor">
      <h1 className="titulo-seccion">Sobre nosotros</h1>

      <section>
        <h2>Nuestra historia</h2>
        <p>
          CatDog nació en Santiago con la misión de acercar productos de calidad para el cuidado de
          mascotas a todas las familias de Chile. Desde alimento balanceado hasta accesorios y
          juguetes, trabajamos con proveedores certificados para asegurar el bienestar de tu mascota.
        </p>
      </section>

      <section>
        <h2>Nuestro equipo</h2>
        <div className="grid-productos">
          {equipo.map((persona) => (
            <article className="producto" key={persona.nombre}>
              <Imagen src={persona.foto} alt={persona.nombre} textoReemplazo="Equipo" />
              <h3>{persona.nombre}</h3>
              <p>{persona.rol}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Nosotros;
