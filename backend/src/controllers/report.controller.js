// backend/src/controllers/report.controller.js
import fs from "node:fs";
import { reportService } from "../services/report.service.js";
import { sendSuccess } from "../utils/response.js";

async function generate(req, res, next) {
  try {
    const { format, search, sort } = req.body;
    const result = await reportService.enqueue({ format, search, sort });
    return sendSuccess(res, result, "Report generation queued", 202);
  } catch (err) {
    next(err);
  }
}

async function getStatus(req, res, next) {
  try {
    const status = await reportService.getStatus(req.params.id);
    return sendSuccess(res, status, "Report status fetched");
  } catch (err) {
    next(err);
  }
}

async function download(req, res, next) {
  try {
    const { filePath, filename, format } = await reportService.getDownload(req.params.id);
    const contentType =
      format === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const stream = fs.createReadStream(filePath);
    stream.on("error", next);
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
}

export const reportController = { generate, getStatus, download };
