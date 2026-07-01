import "dotenv/config";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { query } from "../models/db.js";
import { initDb } from "../config/initDb.js";

await initDb();

const email = "admin@test.com";
const password = "password123";
const hash = await bcrypt.hash(password, 10);

await query(`INSERT IGNORE INTO users (id, email, password) VALUES (?, ?, ?)`, [
  uuidv4(),
  email,
  hash,
]);

console.log(`Seeded user: ${email} / ${password}`);
process.exit(0);
