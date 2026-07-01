import mysql from "mysql2/promise";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const pool = mysql.createPool({
  host: env.mysql.host,
  port: env.mysql.port,
  database: env.mysql.db,
  user: env.mysql.user,
  password: env.mysql.password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
});

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function connectMysql() {
  const conn = await pool.getConnection();
  try {
    await conn.query("SELECT 1");
    logger.info("[db] MySQL connected");
  } catch (error) {
    logger.error({ err: error }, "[db] MySQL connection failed");
    throw error;
  } finally {
    conn.release();
  }
}
