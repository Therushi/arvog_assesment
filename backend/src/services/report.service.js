// backend/src/services/report.service.js
import path from "node:path";
import fs from "node:fs";
import { Job } from "bullmq";
import { reportQueue } from "../queues/report.queue.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const reportsDir = path.resolve(env.uploadDir, "reports");

async function enqueue({ format, search, sort }) {
  const job = await reportQueue.add("generate-report", { format, search, sort });
  return { jobId: job.id };
}

async function getStatus(jobId) {
  const job = await Job.fromId(reportQueue, jobId);
  if (!job) {
    throw ApiError.notFound("Report job not found");
  }
  const state = await job.getState();
  return {
    jobId: job.id,
    state, // waiting | active | completed | failed | delayed
    result: job.returnvalue ?? null,
    failedReason: job.failedReason ?? null,
  };
}

async function getDownload(jobId) {
  const job = await Job.fromId(reportQueue, jobId);
  if (!job) {
    throw ApiError.notFound("Report job not found");
  }
  const state = await job.getState();
  if (state !== "completed") {
    throw ApiError.badRequest(`Report is not ready yet (state: ${state})`);
  }

  const { filename, format } = job.returnvalue ?? {};
  if (!filename) {
    throw ApiError.notFound("Report file not found");
  }

  const filePath = path.join(reportsDir, filename);
  if (!fs.existsSync(filePath)) {
    throw ApiError.notFound("Report file not found on disk");
  }

  return { filePath, filename, format };
}

export const reportService = { enqueue, getStatus, getDownload };
