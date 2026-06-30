import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  host: env.postgres.host,
  port: env.postgres.port,
  database: env.postgres.db,
  user: env.postgres.user,
  password: env.postgres.password,
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function connectPostgres() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log(`[db] Postgres connected`);
  } catch (error) {
    console.error(`[db] Postgres connection failed`, error);
    throw error;
  } finally {
    client.release();
  }
}
