import { query } from "../models/db.js";

async function getStats() {
  const [[{ totalProducts }], [{ totalCategories }]] = await Promise.all([
    query("SELECT COUNT(*) AS totalProducts FROM products"),
    query("SELECT COUNT(*) AS totalCategories FROM categories"),
  ]);
  return { totalProducts, totalCategories };
}

export const dashboardService = { getStats };
