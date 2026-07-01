// backend/src/routes/report.routes.js
import { Router } from "express";
import { reportController } from "../controllers/report.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { generateReportSchema, reportIdParamSchema } from "../validators/report.validator.js";

export const reportRoutes = Router();

reportRoutes.post("/products", validate(generateReportSchema, "body"), reportController.generate);
reportRoutes.get("/:id", validate(reportIdParamSchema, "params"), reportController.getStatus);
reportRoutes.get("/:id/download", validate(reportIdParamSchema, "params"), reportController.download);
