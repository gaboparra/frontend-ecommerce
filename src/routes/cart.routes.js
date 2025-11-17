import { Router } from "express";
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout,
} from "../controllers/cart.controller.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.post("/checkout", authorization, checkout);
router.get("/", authorization, getMyCart);
router.post("/", authorization, addToCart);
router.delete("/", authorization, clearCart);
router.put("/:productId", authorization, updateCartItem);
router.delete("/:productId", authorization, removeFromCart);

export default router;
