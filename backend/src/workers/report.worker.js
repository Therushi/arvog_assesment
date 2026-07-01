// backend/src/workers/report.worker.js
import path from "node:path";
import fs from "node:fs";
import { Worker } from "bullmq";
import { writeToPath } from "fast-csv";
import ExcelJS from "exceljs";
import { redisConnection } from "../config/redis.js";
import { REPORT_QUEUE_NAME } from "../queues/report.queue.js";
import { query } from "../models/db.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const reportsDir = path.resolve(env.uploadDir, "reports");
fs.mkdirSync(reportsDir, { recursive: true });

// Same JOIN/search/sort shape as product.service.js's list query, minus pagination —
// a report reflects the same filters a user sees in the product list.
const BASE_SELECT = `
  SELECT p.id, p.name, p.price, p.category_id AS categoryId,
         p.created_at AS createdAt, c.name AS categoryName
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

function buildQuery({ search, sort }) {
  const where = [];
  const params = [];
  if (search) {
    where.push("(p.name LIKE ? OR c.name LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const orderClause =
    sort === "asc" ? "ORDER BY p.price ASC" : sort === "desc" ? "ORDER BY p.price DESC" : "ORDER BY p.created_at DESC";
  return { sql: `${BASE_SELECT} ${whereClause} ${orderClause}`, params };
}

async function writeCsv(rows, filePath) {
  await new Promise((resolve, reject) => {
    writeToPath(filePath, rows, { headers: true })
      .on("finish", resolve)
      .on("error", reject);
  });
}

async function writeXlsx(rows, filePath) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Products");
  sheet.columns = [
    { header: "ID", key: "id", width: 36 },
    { header: "Name", key: "name", width: 30 },
    { header: "Price", key: "price", width: 12 },
    { header: "Category", key: "categoryName", width: 24 },
    { header: "Created At", key: "createdAt", width: 22 },
  ];
  rows.forEach((row) => sheet.addRow(row));
  await workbook.xlsx.writeFile(filePath);
}

async function processReport(job) {
  const { format, search, sort } = job.data;
  const { sql, params } = buildQuery({ search, sort });
  const rows = await query(sql, params);

  const filename = `${job.id}-products.${format}`;
  const filePath = path.join(reportsDir, filename);

  try {
    if (format === "xlsx") {
      await writeXlsx(rows, filePath);
    } else {
      await writeCsv(rows, filePath);
    }
  } catch (err) {
    fs.unlink(filePath, () => {});
    throw err;
  }

  logger.info({ jobId: job.id, format, rowCount: rows.length }, "[report.worker] generated report");

  return { format, filename, rowCount: rows.length };
}

export const reportWorker = new Worker(REPORT_QUEUE_NAME, processReport, {
  connection: redisConnection,
});

reportWorker.on("failed", (job, err) =>
  logger.error({ jobId: job?.id, err }, "[report.worker] job failed"),
);
