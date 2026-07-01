import { uploadService } from "../services/upload.service.js";
import { sendSuccess } from "../utils/response.js";
import { ApiError } from "../utils/ApiError.js";

async function uploadProducts(req, res, next) {
  try {
    if (!req.file) {
      throw ApiError.badRequest("CSV file is required");
    }
    const result = await uploadService.enqueue({
      filePath: req.file.path,
      originalName: req.file.originalname,
    });
    return sendSuccess(res, result, "Upload queued", 202);
  } catch (err) {
    next(err);
  }
}

async function getStatus(req, res, next) {
  try {
    const status = await uploadService.getStatus(req.params.jobId);
    return sendSuccess(res, status, "Upload status fetched");
  } catch (err) {
    next(err);
  }
}

export const uploadController = { uploadProducts, getStatus };
