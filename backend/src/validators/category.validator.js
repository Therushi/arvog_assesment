import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
});

export const updateCategorySchema = createCategorySchema;

export const categoryIdParamSchema = z.object({
  id: z.string().uuid("Invalid category id"),
});
