

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
  region VARCHAR(100),
  comuna VARCHAR(100),
  direccion VARCHAR(300),
  tipo_usuario VARCHAR(20) DEFAULT 'Cliente',
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  comentario VARCHAR(500) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);
