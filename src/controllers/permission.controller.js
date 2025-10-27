import Permission from "../models/Permission.js";
import logger from "../config/logger.js";

export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();

    return res.status(200).json({
      status: "success",
      message: "Permissions fetched successfully",
      payload: { permissions },
    });
  } catch (error) {
    logger.error("Error fetching permissions", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error fetching permissions",
      payload: { error: error.message },
    });
  }
};

export const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return res.status(404).json({
        status: "error",
        message: "Permission not found",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Permission fetched successfully",
      payload: { permission },
    });
  } catch (error) {
    logger.error("Error fetching permission", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error fetching permission",
      payload: { error: error.message },
    });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        status: "error",
        message: "Name and description are required",
        payload: null,
      });
    }

    const existingPermission = await Permission.findOne({ name });

    if (existingPermission) {
      return res.status(400).json({
        status: "error",
        message: "Permission already exists",
        payload: null,
      });
    }

    const permission = await Permission.create({ name, description });

    return res.status(201).json({
      status: "success",
      message: "Permission created successfully",
      payload: { permission },
    });
  } catch (error) {
    logger.error("Error creating permission", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error creating permission",
      payload: { error: error.message },
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Permission name cannot be empty",
        payload: null,
      });
    }

    if (description !== undefined && description.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Description cannot be empty",
        payload: null,
      });
    }

    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({
        status: "error",
        message: "Permission not found",
        payload: null,
      });
    }

    if (name && name !== permission.name) {
      const existingPermission = await Permission.findOne({ name });
      if (existingPermission) {
        return res.status(400).json({
          status: "error",
          message: "A permission with that name already exists",
          payload: null,
        });
      }
    }

    if (name) permission.name = name;
    if (description) permission.description = description;

    await permission.save();

    return res.status(200).json({
      status: "success",
      message: "Permission updated successfully",
      payload: { permission },
    });
  } catch (error) {
    logger.error("Error updating permission", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error updating permission",
      payload: { error: error.message },
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const deleted = await Permission.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Permission not found",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Permission deleted successfully",
      payload: null,
    });
  } catch (error) {
    logger.error("Error deleting permission", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error deleting permission",
      payload: { error: error.message },
    });
  }
};
