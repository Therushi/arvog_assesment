import { categoryService } from "../services/category.service.js";
import { sendSuccess } from "../utils/response.js";

async function list(req, res, next) {
  try {
    const categories = await categoryService.list();
    return sendSuccess(res, categories, "Categories fetched");
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const category = await categoryService.create(req.body.name);
    return sendSuccess(res, category, "Category created", 201);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const category = await categoryService.update(req.params.id, req.body.name);
    return sendSuccess(res, category, "Category updated");
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await categoryService.remove(req.params.id);
    return sendSuccess(res, {}, "Category deleted", 204);
  } catch (err) {
    next(err);
  }
}
export const categoryController = { list, create, update, remove };
