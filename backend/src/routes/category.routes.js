import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from "../validators/category.validator.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", categoryController.list);

categoryRoutes.post(
  "/",
  validate(createCategorySchema, "body"),
  categoryController.create,
);

categoryRoutes.put(
  "/:id",
  validate(categoryIdParamSchema, "params"),
  validate(updateCategorySchema, "body"),
  categoryController.update,
);

categoryRoutes.delete(
  "/:id",
  validate(categoryIdParamSchema, "params"),
  categoryController.remove,
);
