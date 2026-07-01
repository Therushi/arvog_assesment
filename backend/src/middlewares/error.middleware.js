import { ApiError } from "../utils/ApiError.js";
import { sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";

// Centralized error handler — must be registered LAST in the middleware chain.
// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message =
    err instanceof ApiError ? err.message : "Internal Server Error";

  if (statusCode >= 500) {
    logger.error({ err, path: req.originalUrl }, "Unhandled error");
  } else {
    logger.warn({ path: req.originalUrl, message }, "Request error");
  }

  return sendError(res, message, statusCode);
}

export function notFoundMiddleware(req, res) {
  return sendError(res, `Route not found: ${req.originalUrl}`, 404);
}
