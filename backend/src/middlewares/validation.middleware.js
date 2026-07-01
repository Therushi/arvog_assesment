import { ApiError } from "../utils/ApiError.js";

/**
 * Validate a request section against a zod schema.
 * Usage: router.post("/", validate(schema), controller)
 * `source` is one of "body" | "query" | "params".
 */
export function validate(schema, source = "body") {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      return next(ApiError.badRequest(message));
    }
    req[source] = result.data;
    return next();
  };
}
