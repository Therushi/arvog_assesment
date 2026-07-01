import fs from "node:fs";
import { createReadStream } from "node:fs";
import csv from "csv-parser";
import { Worker } from "bullmq";
import { v4 as uuidv4 } from "uuid";
import { redisConnection } from "../config/redis.js";
import { UPLOAD_QUEUE_NAME } from "../queues/upload.queue.js";
import { query, pool } from "../models/db.js";
import { logger } from "../utils/logger.js";

const BATCH_SIZE = 500;
const MAX_ERRORS = 100;

function validateRow(row, categoryMap) {
  const name = row.name?.trim();
  const price = Number(row.price);
  const categoryName = row.category?.trim();
  const categoryId = categoryName
    ? categoryMap.get(categoryName.toLowerCase())
    : null;

  if (!name) return { error: "name is required" };
  if (!Number.isFinite(price) || price <= 0)
    return { error: "price must be a positive number" };
  if (!categoryId) return { error: `unknown category "${categoryName ?? ""}"` };

  return {
    product: {
      id: uuidv4(),
      name,
      image: row.image?.trim() || null,
      price,
      categoryId,
    },
  };
}

async function insertBatch(conn, rows) {
  if (!rows.length) return;
  const placeholders = rows.map(() => "(?, ?, ?, ?, ?)").join(", ");
  const params = rows.flatMap((r) => [
    r.id,
    r.name,
    r.image,
    r.price,
    r.categoryId,
  ]);
  await conn.execute(
    `INSERT INTO products (id, name, image, price, category_id) VALUES ${placeholders}`,
    params,
  );
}

async function processCsv(job) {
  const { filePath, originalName } = job.data;
  const categories = await query("SELECT id, name FROM categories");
  const categoryMap = new Map(
    categories.map((c) => [c.name.toLowerCase(), c.id]),
  );

  let total = 0;
  let inserted = 0;
  const errors = [];
  let batch = [];

  try {
    await new Promise((resolve, reject) => {
      createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          total += 1;
          const { product, error } = validateRow(row, categoryMap);
          if (error) {
            if (errors.length < MAX_ERRORS)
              errors.push({ row: total, reason: error });
            return;
          }
          batch.push(product);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Wrap all batches for this attempt in one transaction: if a later batch
    // fails, retries must not re-insert rows from batches that already
    // committed in this same attempt.
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (let i = 0; i < batch.length; i += BATCH_SIZE) {
        const chunk = batch.slice(i, i + BATCH_SIZE);
        await insertBatch(conn, chunk);
        inserted += chunk.length;
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      inserted = 0;
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    // BullMQ increments attemptsMade only *after* this call returns/throws, so
    // `attemptsMade + 1 >= attempts` here means this was the last allowed try.
    // Only delete the file once no retry will follow — otherwise every retry
    // after the first failure hits ENOENT and the configured retries/backoff
    // are wasted.
    const maxAttempts = job.opts?.attempts ?? 1;
    if (job.attemptsMade + 1 >= maxAttempts) {
      fs.unlink(filePath, () => {});
    }
    throw err;
  }

  fs.unlink(filePath, () => {});

  logger.info(
    { jobId: job.id, originalName, total, inserted, skipped: total - inserted },
    "[upload.worker] processed CSV",
  );

  return { total, inserted, skipped: total - inserted, errors };
}

export const uploadWorker = new Worker(UPLOAD_QUEUE_NAME, processCsv, {
  connection: redisConnection,
});

uploadWorker.on("failed", (job, err) =>
  logger.error({ jobId: job?.id, err }, "[upload.worker] job failed"),
);
