-- ===== Tablas de CatDog =====
-- Se crean automáticamente al correr "npm run seed" (no hace falta pegarlas en Neon).

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(500),
  precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  stock_critico INTEGER DEFAULT 0,
  categoria VARCHAR(50) NOT NULL,
  imagen VARCHAR(255),
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  run VARCHAR(9) UNIQUE NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  clave_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  region VARCHAR(100),
  comuna VARCHAR(100),
  direccion VARCHAR(300),
  tipo_usuario VARCHAR(20) DEFAULT 'Cliente',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Por si la tabla ya existía sin la columna teléfono
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);

CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  comentario VARCHAR(500) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Una compra (boleta)
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  total NUMERIC(12,2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'Pagado',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Los productos de cada compra
CREATE TABLE IF NOT EXISTS pedido_items (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id) ON DELETE SET NULL,
  nombre VARCHAR(100) NOT NULL,
  precio NUMERIC(10,2) NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0)
);
