import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const UPLOAD_QUEUE_NAME = "product-upload";

export const uploadQueue = new Queue(UPLOAD_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
