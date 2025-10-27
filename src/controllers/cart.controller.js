import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import logger from "../config/logger.js";

export const getMyCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Cart fetched successfully",
      payload: { cart },
    });
  } catch (error) {
    logger.error("Error fetching cart:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching cart",
      payload: { error: error.message },
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        status: "error",
        message: "Product ID and quantity are required",
        payload: null,
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        status: "error",
        message: "Quantity must be at least 1",
        payload: null,
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
        payload: null,
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        status: "error",
        message: "Product not available",
        payload: null,
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: `Insufficient stock. Available: ${product.stock}`,
        payload: null,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      status: "success",
      message: "Product added to cart",
      payload: { cart },
    });
  } catch (error) {
    logger.error("Error adding to cart:", error);
    res.status(500).json({
      status: "error",
      message: "Error adding to cart",
      payload: { error: error.message },
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: "error",
        message: "Quantity must be at least 1",
        payload: null,
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
        payload: null,
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        status: "error",
        message: "Product not found in cart",
        payload: null,
      });
    }

    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: `Insufficient stock. Available: ${product.stock}`,
        payload: null,
      });
    }

    item.quantity = quantity;
    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      status: "success",
      message: "Quantity updated",
      payload: { cart },
    });
  } catch (error) {
    logger.error("Error updating cart:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating cart",
      payload: { error: error.message },
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
        payload: null,
      });
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        status: "error",
        message: "Product not found in cart",
        payload: null,
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      status: "success",
      message: "Product removed from cart",
      payload: { cart },
    });
  } catch (error) {
    logger.error("Error removing from cart:", error);
    res.status(500).json({
      status: "error",
      message: "Error removing from cart",
      payload: { error: error.message },
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
        payload: null,
      });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Cart cleared successfully",
      payload: { cart },
    });
  } catch (error) {
    logger.error("Error clearing cart:", error);
    res.status(500).json({
      status: "error",
      message: "Error clearing cart",
      payload: { error: error.message },
    });
  }
};
