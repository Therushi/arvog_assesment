import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { UPLOAD_QUEUE_NAME } from "../queues/upload.queue.js";
import { logger } from "../utils/logger.js";

// No-op processor stub. CSV parsing + bulk insert is implemented in Phase 5.
export const uploadWorker = new Worker(
  UPLOAD_QUEUE_NAME,
  async (job) => {
    logger.info({ jobId: job.id }, "[upload.worker] received job (stub)");
    return { processed: 0 };
  },
  { connection: redisConnection },
);

uploadWorker.on("failed", (job, err) =>
  logger.error({ jobId: job?.id, err }, "[upload.worker] job failed"),
);
