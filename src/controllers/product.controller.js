import Product from "../models/Product.js";
import logger from "../config/logger.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    return res.status(200).json({
      status: "success",
      message: "Products fetched successfully",
      payload: { products },
    });
  } catch (error) {
    logger.error("Error fetching products:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching products",
      payload: { error: error.message },
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product fetched successfully",
      payload: { product },
    });
  } catch (error) {
    logger.error("Error fetching product:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching product",
      payload: { error: error.message },
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Name, description and price are required",
        payload: null,
      });
    }

    if (price < 0) {
      return res.status(400).json({
        status: "error",
        message: "Price cannot be negative",
        payload: null,
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      image: image || "default-product.jpg",
      //   category,
    });

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      payload: { product },
    });
  } catch (error) {
    logger.error("Error creating product:", error);
    res.status(500).json({
      status: "error",
      message: "Error creating product",
      payload: { error: error.message },
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, isActive, image } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
        payload: null,
      });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({
        status: "error",
        message: "Price cannot be negative",
        payload: null,
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        status: "error",
        message: "Stock cannot be negative",
        payload: null,
      });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (image) product.image = image;
    // if (category) product.category = category;
    if (typeof isActive === "boolean") product.isActive = isActive;

    await product.save();

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      payload: { product },
    });
  } catch (error) {
    logger.error("Error updating product:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating product",
      payload: { error: error.message },
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      payload: null,
    });
  } catch (error) {
    logger.error("Error deleting product:", error);
    res.status(500).json({
      status: "error",
      message: "Error deleting product",
      payload: { error: error.message },
    });
  }
};
