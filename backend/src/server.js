import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { connectMysql } from "./config/db.js";
import { initDb } from "./config/initDb.js";
import { redisConnection } from "./config/redis.js";

import { uploadWorker } from "./workers/upload.worker.js";
import { reportWorker } from "./workers/report.worker.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry(label, fn, { attempts = 15, delayMs = 3000 } = {}) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === attempts) throw err;
      logger.warn(
        `[startup] ${label} not ready (attempt ${attempt}/${attempts}): ${err.message} — retrying in ${delayMs}ms`,
      );
      await sleep(delayMs);
    }
  }
}

async function bootstrap() {
  await withRetry("MySQL", connectMysql);
  await initDb();
  await withRetry("Redis", () => redisConnection.ping());
  logger.info(
    { queues: [uploadWorker.name, reportWorker.name] },
    "[workers] started",
  );

  const server = app.listen(env.port, () => {
    logger.info(
      `[server] listening on http://localhost:${env.port}${env.apiPrefix}`,
    );
  });

  const shutdown = async (signal) => {
    logger.info(`[server] ${signal} received, shutting down`);
    server.close();
    await Promise.allSettled([
      uploadWorker.close(),
      reportWorker.close(),
      redisConnection.quit(),
    ]);
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  console.error("[bootstrap] failed to start:", err);
  process.exit(1);
});
