// Usuarios de ejemplo para el panel de administración
const usuarios = [
  { id: 1, run: "190110221", nombre: "Karina", apellidos: "Soto", correo: "karina@duoc.cl", tipo: "Administrador",
    region: "Región Metropolitana de Santiago", comuna: "Santiago", direccion: "Av. Siempre Viva 123" },
  { id: 2, run: "178654321", nombre: "Claudia", apellidos: "González", correo: "claudia@duoc.cl", tipo: "Vendedor",
    region: "Región Metropolitana de Santiago", comuna: "Maipú", direccion: "Los Aromos 456" },
  { id: 3, run: "209876543", nombre: "María", apellidos: "López", correo: "maria.lopez@gmail.com", tipo: "Cliente",
    region: "Región de Valparaíso", comuna: "Viña del Mar", direccion: "Calle 5 Norte 789" },
];

export function buscarUsuarioPorId(id) {
  return usuarios.find((u) => u.id === Number(id));
}

export default usuarios;
