import { productService } from "../services/product.service.js";
import { sendSuccess } from "../utils/response.js";

async function list(req, res, next) {
  try {
    const result = await productService.list(req.query);
    return sendSuccess(res, result, "Products fetched");
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const product = await productService.create(req.body);
    return sendSuccess(res, product, "Product created", 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const product = await productService.update(req.params.id, req.body);
    return sendSuccess(res, product, "Product updated");
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await productService.remove(req.params.id);
    return sendSuccess(res, {}, "Product deleted", 204);
  } catch (err) {
    next(err);
  }
}

export const productController = { list, create, update, remove };
