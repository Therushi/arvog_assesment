import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  price: z.coerce.number().positive("Price must be greater than 0"),
  categoryId: z.string().uuid("Invalid category id"),
});

export const updateProductSchema = createProductSchema;

export const productIdParamSchema = z.object({
  id: z.string().uuid("Invalid product id"),
});

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(["asc", "desc"]).optional(),
  search: z.string().trim().max(255).optional(),
});
