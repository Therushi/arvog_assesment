import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { categoryRoutes } from "./category.routes.js";
import { productRoutes } from "./product.routes.js";
import { uploadRoutes } from "./upload.routes.js";
import { reportRoutes } from "./report.routes.js";
import { dashboardRoutes } from "./dashboard.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "ok", uptime: process.uptime() },
    message: "Server online",
  });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/categories", authMiddleware, categoryRoutes);
apiRouter.use("/products", authMiddleware, productRoutes);
apiRouter.use("/upload", authMiddleware, uploadRoutes);
apiRouter.use("/reports", authMiddleware, reportRoutes);
apiRouter.use("/dashboard", authMiddleware, dashboardRoutes);
