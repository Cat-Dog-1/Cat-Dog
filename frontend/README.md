# CatDog — Frontend en React

Tienda CatDog hecha con React (`create-react-app`), conectada al backend Node/Express y a la base de datos Neon.

## Cómo correrlo

**Terminal 1: backend**
```
cd backend
npm install
npm run seed      (solo la primera vez: crea tablas, productos y el admin)
npm run dev
```

**Terminal 2: frontend**
```
cd frontend
npm install
npm start
```
Se abre en http://localhost:3000

> En Windows, si PowerShell bloquea `npm`, usa `npm.cmd` (ej: `npm.cmd start`).

## Usuario administrador de prueba

- Correo: `admin@duoc.cl`
- Contraseña: `admin123`

## Pruebas

| Comando | Herramienta | Qué corre |
|---|---|---|
| `npm test` | Jest + React Testing Library | `src/**/*.test.js` (17 pruebas) |
| `npm run test:karma` | Jasmine + Karma (Chrome) | `karma/**/*.spec.js` (18 pruebas) |

## Funcionalidades

- Tienda: inicio, catálogo con buscador y filtro, detalle, carrito, blogs, nosotros, contacto.
- Productos cargados desde la base de datos (si el backend está apagado, se usan productos de respaldo).
- Registro, inicio y cierre de sesión. El header muestra al usuario conectado.
- Compra: el botón Pagar exige sesión, descuenta stock y muestra la boleta. Página "Mis compras".
- Panel de administración (solo usuarios Administrador): dashboard, CRUD de productos, CRUD de usuarios y listado de compras.

## Estructura

- `src/App.js`: rutas de la aplicación (react-router-dom)
- `src/components/`: piezas reutilizables (Header, Footer, TarjetaProducto, Campo, RutaProtegida, Boleta…)
- `src/pages/`: una página por ruta, y `admin/` para el panel
- `src/context/`: AuthContext (sesión), ProductosContext (productos), CarritoContext (carrito)
- `src/services/api.js`: conexión con el backend
- `src/utils/validaciones.js`: validaciones de formularios
- `karma/` y `karma.conf.js`: pruebas con Jasmine + Karma
