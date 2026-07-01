import { dashboardService } from "../services/dashboard.service.js";
import { sendSuccess } from "../utils/response.js";

async function getStats(req, res, next) {
  try {
    const stats = await dashboardService.getStats();
    return sendSuccess(res, stats, "Dashboard stats fetched");
  } catch (err) {
    next(err);
  }
}

export const dashboardController = { getStats };
