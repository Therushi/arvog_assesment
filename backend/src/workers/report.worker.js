import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { REPORT_QUEUE_NAME } from "../queues/report.queue.js";
import { logger } from "../utils/logger.js";

// No-op processor stub. CSV/XLSX generation is implemented in Phase 6.
export const reportWorker = new Worker(
  REPORT_QUEUE_NAME,
  async (job) => {
    logger.info({ jobId: job.id }, "[report.worker] received job (stub)");
    return { file: null };
  },
  { connection: redisConnection },
);

reportWorker.on("failed", (job, err) =>
  logger.error({ jobId: job?.id, err }, "[report.worker] job failed"),
);
