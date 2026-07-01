export function sendSuccess(res, data = {}, message = "", code = 200) {
  return res.status(code).json({ success: true, data, message });
}

export function sendError(res, error = "Internal Server Error", code = 500) {
  return res.status(code).json({ success: false, error, code });
}
