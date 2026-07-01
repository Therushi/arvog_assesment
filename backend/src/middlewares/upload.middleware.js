import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const uploadDir = path.resolve(env.uploadDir, "csv");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${crypto.randomUUID()}.csv`);
  },
});

function fileFilter(_req, file, cb) {
  const isCsv =
    file.mimetype === "text/csv" ||
    path.extname(file.originalname).toLowerCase() === ".csv";
  if (!isCsv) {
    return cb(ApiError.badRequest("Only .csv files are allowed"));
  }
  cb(null, true);
}

export const uploadCsv = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single("file");
