import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

export const authRoutes = Router();

authRoutes.post("/login", validate(loginSchema, "body"), authController.login);
