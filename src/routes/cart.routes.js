import { Router } from "express";
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.get("/", authorization, getMyCart);
router.post("/", authorization, addToCart);
router.put("/:productId", authorization, updateCartItem);
router.delete("/:productId", authorization, removeFromCart);
router.delete("/", authorization, clearCart);

export default router;
