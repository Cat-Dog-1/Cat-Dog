// Imagen que muestra un recuadro de reemplazo si el archivo no existe
function Imagen({ src, alt, textoReemplazo = "CatDog", ...resto }) {
  return (
    <img
      src={src}
      alt={alt}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = `https://placehold.co/300x200?text=${encodeURIComponent(textoReemplazo)}`;
      }}
      {...resto}
    />
  );
}

export default Imagen;
