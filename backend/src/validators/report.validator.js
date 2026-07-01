// backend/src/validators/report.validator.js
import { z } from "zod";

export const generateReportSchema = z.object({
  format: z.enum(["csv", "xlsx"]),
  search: z.string().trim().max(255).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});

// BullMQ job ids are plain strings (not UUIDs) unless an explicit jobId is set —
// don't reuse the uuid-based param schemas from product/category validators.
export const reportIdParamSchema = z.object({
  id: z.string().min(1, "Report id is required"),
});
