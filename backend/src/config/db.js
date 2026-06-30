import pg from "pg";
import { env } from "dotenv";

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
    console.log(`Something went wrong while connecting DB`);
  } finally {
    client.release();
  }
}
