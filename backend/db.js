import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Neon exige SSL. Esta configuración funciona tanto en local como en producción.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Función de ayuda para ejecutar consultas desde cualquier parte del backend
export async function query(texto, parametros) {
  return pool.query(texto, parametros);
}
