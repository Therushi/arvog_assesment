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

const categories = [
  { name: "Electronics" },
  { name: "Clothing" },
  { name: "Home & Kitchen" },
  { name: "Books" },
  { name: "Sports & Outdoors" },
];

const categoryIds = {};

for (const cat of categories) {
  const [existing] = await query(`SELECT id FROM categories WHERE name = ?`, [cat.name]);
  if (existing) {
    categoryIds[cat.name] = existing.id;
    continue;
  }
  const id = uuidv4();
  await query(`INSERT INTO categories (id, name) VALUES (?, ?)`, [id, cat.name]);
  categoryIds[cat.name] = id;
}

console.log(`Seeded ${categories.length} categories`);

const products = [
  { name: "Wireless Mouse", price: 1499.0, category: "Electronics" },
  { name: "Mechanical Keyboard", price: 6999.0, category: "Electronics" },
  { name: "27-inch Monitor", price: 18999.0, category: "Electronics" },
  { name: "USB-C Hub", price: 2499.0, category: "Electronics" },
  { name: "Men's T-Shirt", price: 799.0, category: "Clothing" },
  { name: "Women's Jeans", price: 2199.0, category: "Clothing" },
  { name: "Running Shoes", price: 3499.0, category: "Clothing" },
  { name: "Winter Jacket", price: 4999.0, category: "Clothing" },
  { name: "Non-stick Frying Pan", price: 1299.0, category: "Home & Kitchen" },
  { name: "Coffee Maker", price: 3999.0, category: "Home & Kitchen" },
  { name: "Blender", price: 2999.0, category: "Home & Kitchen" },
  { name: "Cutlery Set", price: 1899.0, category: "Home & Kitchen" },
  { name: "The Pragmatic Programmer", price: 1999.0, category: "Books" },
  { name: "Clean Code", price: 1799.0, category: "Books" },
  { name: "Atomic Habits", price: 999.0, category: "Books" },
  { name: "Yoga Mat", price: 1199.0, category: "Sports & Outdoors" },
  { name: "Dumbbell Set", price: 3999.0, category: "Sports & Outdoors" },
  { name: "Camping Tent", price: 8999.0, category: "Sports & Outdoors" },
];

for (const prod of products) {
  const [existing] = await query(
    `SELECT id FROM products WHERE name = ? AND category_id = ?`,
    [prod.name, categoryIds[prod.category]]
  );
  if (existing) continue;
  await query(
    `INSERT INTO products (id, name, price, category_id) VALUES (?, ?, ?, ?)`,
    [uuidv4(), prod.name, prod.price, categoryIds[prod.category]]
  );
}

console.log(`Seeded ${products.length} products`);
process.exit(0);
