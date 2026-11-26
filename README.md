# CatDog — Frontend (React)

Tienda online de productos para mascotas (alimento, juguetes, accesorios e higiene).
DSY1104 Desarrollo Fullstack II · Duoc UC · **Karina Soto** y **Claudia González**.

> Backend (Spring Boot + MySQL + JWT): https://github.com/Cat-Dog-1/catdog-backend

---

## Funcionalidades

**Tienda (todos)**
- Catálogo con buscador y filtro por categoría (categorías desde la base de datos)
- Detalle de producto con stock disponible
- Carrito de compras (se guarda en el navegador)
- Registro, inicio y cierre de sesión con JWT
- Compra con boleta y página "Mis compras"
- Nosotros, Blogs y Contacto

**Panel `/admin`**

| Función | Vendedor | Administrador |
|---|:---:|:---:|
| Dashboard | ✔ | ✔ |
| Productos: listar y ver detalle | ✔ | ✔ |
| Productos: crear, editar, eliminar | | ✔ |
| Órdenes: listar y ver detalle | ✔ | ✔ |
| Órdenes: cambiar estado / anular | | ✔ |
| Categorías, Usuarios, Mensajes | | ✔ |

## Sesión y seguridad en el frontend

- `src/services/api.js`: un solo punto para llamar a la API (`http://localhost:8080/api/v1`). Envía `Authorization: Bearer <token>`,
  renueva el token con `/auth/refresh` cuando está por vencer o el backend responde 401, y cierra la sesión si no puede renovarlo.
- `src/context/AuthContext.js`: guarda la sesión en `localStorage` (sobrevive a recargar la página) y la valida con `/auth/me` al abrir la app.
- `src/components/RutaProtegida.js`: protege rutas por rol (`Administrador`, `Vendedor`, `Cliente`).

## Cómo ejecutarlo

Requisitos: Node.js LTS y el **backend encendido** en `http://localhost:8080` (ver su README).

```bash
cd frontend
npm install        # en PowerShell: npm.cmd install
npm start          # abre http://localhost:3000
```

Usuarios de prueba (los crea el backend): `admin@duoc.cl / admin123`, `vendedor@duoc.cl / vende123`, `cliente@gmail.com / cliente123`.

## Pruebas

```bash
npm test -- --watchAll=false   # Jest + Testing Library
npm run test:coverage          # Jest con cobertura
npm run test:karma             # Jasmine + Karma (Chrome Headless)
```

## Estructura

```
frontend/src
├── components/   Header, TarjetaProducto, Boleta, RutaProtegida, AdminLayout…
├── context/      AuthContext (sesión), ProductosContext, CarritoContext
├── pages/        Tienda y pages/admin (panel)
├── services/     api.js (fetch + JWT + refresh)
└── utils/        validaciones, roles, estados
```

Los archivos `.html` de la raíz son la versión de la Evaluación 1 (HTML/CSS/JS), que se conserva como historial.
