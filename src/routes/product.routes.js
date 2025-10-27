import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import authorization from "../middlewares/authorization.js";
import checkPermission from "../middlewares/checkPermission.js";

const router = Router();

router.get("/", authorization, getProducts);
router.get("/:id", authorization, getProductById);
router.post("/", authorization, checkPermission("products:create"), createProduct);
router.put("/:id", authorization, checkPermission("products:update"), updateProduct);
router.delete("/:id", authorization, checkPermission("products:delete"), deleteProduct);

export default router;