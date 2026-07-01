import { Job } from "bullmq";
import { uploadQueue, UPLOAD_QUEUE_NAME } from "../queues/upload.queue.js";
import { redisConnection } from "../config/redis.js";
import { ApiError } from "../utils/ApiError.js";

async function enqueue({ filePath, originalName }) {
  const job = await uploadQueue.add("process-csv", { filePath, originalName });
  return { jobId: job.id };
}

async function getStatus(jobId) {
  const job = await Job.fromId(uploadQueue, jobId);
  if (!job) {
    throw ApiError.notFound("Upload job not found");
  }
  const state = await job.getState();
  return {
    jobId: job.id,
    state, // waiting | active | completed | failed | delayed
    result: job.returnvalue ?? null,
    failedReason: job.failedReason ?? null,
  };
}

export const uploadService = { enqueue, getStatus };
