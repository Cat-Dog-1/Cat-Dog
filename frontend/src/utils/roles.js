// ===== Roles del sistema =====
// Mismos nombres que envía el backend en "usuario.tipo".
export const ROLES = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  CLIENTE: "Cliente",
};

// Personal de la tienda: puede entrar al panel /admin
export const PERSONAL = [ROLES.ADMIN, ROLES.VENDEDOR];
export const SOLO_ADMIN = [ROLES.ADMIN];
