import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Verify the Bearer JWT and attach the decoded payload to `req.user`.
 * Wired in Phase 1; consumed by protected routes from Phase 2 onward.
 */
export function authMiddleware(req, _res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(ApiError.unauthorized("Missing or invalid Authorization header"));
  }

  try {
    req.user = jwt.verify(token, env.jwt.secret);
    return next();
  } catch {
    return next(ApiError.unauthorized("Invalid or expired token"));
  }
}
