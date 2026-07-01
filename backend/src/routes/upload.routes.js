import { Router } from "express";
import { uploadController } from "../controllers/upload.controller.js";
import { uploadCsv } from "../middlewares/upload.middleware.js";

export const uploadRoutes = Router();

uploadRoutes.post("/products", uploadCsv, uploadController.uploadProducts);
uploadRoutes.get("/:jobId/status", uploadController.getStatus);
