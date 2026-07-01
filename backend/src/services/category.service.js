import { v4 as uuidv4 } from "uuid";
import { query } from "../models/db.js";
import { ApiError } from "../utils/ApiError.js";

async function list() {
  return query(
    `SELECT id, name, created_at FROM categories ORDER BY created_at DESC`,
  );
}

async function findById(id) {
  const rows = await query(
    `SELECT id, name, created_at FROM categories WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

async function create(name) {
  const id = uuidv4();
  await query(`INSERT INTO categories (id, name) VALUES (?, ?)`, [id, name]);
  return findById(id);
}

async function update(id, name) {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound("Category not found");
  }
  await query(`UPDATE categories SET name = ? WHERE id = ?`, [name, id]);
  return findById(id);
}

async function remove(id) {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound("Category not found");
  }
  await query(`DELETE FROM categories WHERE id = ?`, [id]);
}
export const categoryService = { list, findById, create, update, remove };
