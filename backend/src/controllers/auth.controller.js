import { authService } from "../services/auth.service.js";
import { sendSuccess } from "../utils/response.js";

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return sendSuccess(res, result, "Login successful");
  } catch (err) {
    next(err);
  }
}
export const authController = { login };
