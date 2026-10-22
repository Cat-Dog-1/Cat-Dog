# Cat-Dog
Tienda online de productos para mascotas (alimento, juguetes, accesorios e higiene)

---

## Funcionalidades

**Tienda**
- Catálogo con buscador y filtro por categoría
- Detalle de producto con stock disponible
- Carrito de compras (se guarda en el navegador)
- Registro, inicio y cierre de sesión
- Compra con boleta y página "Mis compras"
- Páginas de Nosotros, Blogs y Contacto
- Validaciones con mensajes personalizados (RUN, correo, contraseña, región y comuna)

**Panel de administración** (solo usuarios Administrador)
- Dashboard: productos, usuarios, compras, total vendido y stock crítico
- CRUD de productos y de usuarios
- Listado de compras

---

## Tecnologías

| Parte | Tecnología |
|---|---|
| Frontend | React (create-react-app), React Router, Context |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL en [Neon](https://neon.tech) |
| Seguridad | JWT (sesión y roles), bcrypt (contraseñas encriptadas) |
| Pruebas | Jest + React Testing Library, Jasmine + Karma |
| Versión clásica | HTML5, CSS3 y JavaScript |

---

## Estructura del proyecto

```
Cat-Dog/
├── frontend/ ← Aplicación React (versión principal)
│ ├── public/ ← index.html e imágenes (img/)
│ ├── src/
│ │ ├── App.js ← rutas de la aplicación
│ │ ├── components/ ← piezas reutilizables (Header, TarjetaProducto…)
│ │ ├── pages/ ← una página por ruta (+ admin/)
│ │ ├── context/ ← sesión, productos y carrito compartidos
│ │ ├── services/ ← conexión con el backend
│ │ └── utils/ ← validaciones
│ ├── karma/ ← pruebas con Jasmine
│ └── karma.conf.js ← configuración de Karma
│
├── backend/ ← API Node + Express
│ ├── routes/ ← productos, usuarios, pedidos, mensajes
│ ├── middleware/ ← verificación de token y rol admin
│ ├── schema.sql ← tablas de la base de datos
│ ├── seed.js ← crea tablas, productos y el admin
│ └── .env.example ← plantilla de configuración
│
└── *.html, css/, js/ ← versión clásica en HTML/CSS/JS
```

---

## Cómo ejecutar el proyecto

### Requisitos
- [Node.js](https://nodejs.org) (versión LTS)
- Una base de datos en Neon (cadena de conexión)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Cat-Dog-1/Cat-Dog.git
cd Cat-Dog
```

### 2. Backend
```bash
cd backend
npm install
```
Crear el archivo `backend/.env` (copiando `.env.example`) con:
```
DATABASE_URL=postgresql://usuario:clave@host/neondb?sslmode=require
JWT_SECRET=una-frase-secreta-larga
PORT=3001
```
Luego:
```bash
npm run seed # solo la primera vez: crea tablas, productos y el admin
npm run dev # enciende el backend en http://localhost:3001
```

### 3. Frontend (en otra terminal)
```bash
cd frontend
npm install
npm start # abre http://localhost:3000
```

> En Windows, si PowerShell bloquea `npm`, usa `npm.cmd` (ej: `npm.cmd start`).

### Usuario administrador de prueba
| Correo | Contraseña |
|---|---|
| `admin@duoc.cl` | `admin123` |

---

## Pruebas

Desde la carpeta `frontend/`:

| Comando | Herramienta | Pruebas |
|---|---|---|
| `npm test` | Jest + React Testing Library | 17 |
| `npm run test:karma` | Jasmine + Karma (Chrome) | 18 |

Cubren validaciones de formularios, carrito, componentes, rutas protegidas y conversión de datos del backend.

---

## API (backend)

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/productos` | Lista de productos | Público |
| POST / PUT / DELETE | `/api/productos(/:id)` | Crear, editar, eliminar producto | Admin |
| POST | `/api/usuarios/registro` | Registro de usuario | Público |
| POST | `/api/usuarios/login` | Inicio de sesión (entrega token) | Público |
| GET / POST / PUT / DELETE | `/api/usuarios(/:id)` | CRUD de usuarios | Admin |
| POST | `/api/pedidos` | Registrar una compra | Con sesión |
| GET | `/api/pedidos/mios` | Compras del usuario | Con sesión |
| GET | `/api/pedidos` | Todas las compras | Admin |
| POST | `/api/mensajes` | Mensaje de contacto | Público |

---

## Seguridad

- El archivo `.env` **no se sube a GitHub** (está en `.gitignore`).
- Las contraseñas se guardan encriptadas con bcrypt.
- Las rutas de administración se protegen en React y en el backend (token JWT + rol).

---

## Trabajo en equipo

Cada funcionalidad se desarrolla en su propia rama (`feature/...`) y se integra a `main` mediante pull request.
