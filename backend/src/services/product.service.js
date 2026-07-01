import { v4 as uuidv4 } from "uuid";
import { query } from "../models/db.js";
import { ApiError } from "../utils/ApiError.js";

const BASE_SELECT = `
  SELECT p.id, p.name, p.price, p.category_id AS categoryId,
         p.created_at, c.name AS categoryName
  FROM products p
  JOIN categories c ON c.id = p.category_id  
`;

async function list({ page, limit, sort, search }) {
  const where = [];
  const params = [];

  if (search) {
    where.push(`(p.name LIKE ? OR c.name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  const whereClause = where.length ? `WHERE ${where.join(` AND `)}` : "";
  const orderClause = sort
    ? `ORDER BY p.price ${sort === "asc" ? "ASC" : "DESC"}`
    : "ORDER BY p.created_at DESC";
  const offset = (page - 1) * limit;

  const rows = await query(
    `${BASE_SELECT} ${whereClause} ${orderClause} LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
    params,
  );

  const [{ total }] = await query(
    `SELECT COUNT(*) AS total FROM products p JOIN categories c ON c.id = p.category_id ${whereClause}`,
    params,
  );

  return { items: rows, total, page, limit };
}

async function findById(id) {
  const rows = await query(`${BASE_SELECT} WHERE p.id = ? LIMIT 1`, [id]);
  return rows[0] ?? null;
}

async function assertCategoryExists(categoryId) {
  const rows = await query("SELECT id FROM categories WHERE id = ? LIMIT 1", [
    categoryId,
  ]);
  if (!rows.length) {
    throw ApiError.badRequest("Category not found");
  }
}

async function create({ name, price, categoryId }) {
  await assertCategoryExists(categoryId);
  const id = uuidv4();
  await query(
    "INSERT INTO products (id, name, price, category_id) VALUES (?, ?, ?, ?)",
    [id, name, price, categoryId],
  );
  return findById(id);
}

async function update(id, { name, price, categoryId }) {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound("Product not found");
  }
  await assertCategoryExists(categoryId);
  await query(
    "UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?",
    [name, price, categoryId, id],
  );
  return findById(id);
}

async function remove(id) {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound("Product not found");
  }
  await query("DELETE FROM products WHERE id = ?", [id]);
}
export const productService = { list, findById, create, update, remove };
