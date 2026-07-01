import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  listProductsQuerySchema,
} from "../validators/product.validator.js";

export const productRoutes = Router();

productRoutes.get(
  "/",
  validate(listProductsQuerySchema, "query"),
  productController.list,
);

productRoutes.post(
  "/",
  validate(createProductSchema, "body"),
  productController.create,
);

productRoutes.put(
  "/:id",
  validate(productIdParamSchema, "params"),
  validate(updateProductSchema, "body"),
  productController.update,
);

productRoutes.delete(
  "/:id",
  validate(productIdParamSchema, "params"),
  productController.remove,
);
