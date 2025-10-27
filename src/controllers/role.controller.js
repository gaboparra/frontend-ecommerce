import Role from "../models/Role.js";
import Permission from "../models/Permission.js";
import logger from "../config/logger.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();

    return res.status(200).json({
      status: "success",
      message: "Roles fetched successfully",
      payload: { roles },
    });
  } catch (error) {
    logger.error("Error fetching roles", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error fetching roles",
      payload: { error: error.message },
    });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate("permissions");

    if (!role) {
      return res.status(404).json({
        status: "error",
        message: "Role not found",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Role fetched successfully",
      payload: { role },
    });
  } catch (error) {
    logger.error("Error fetching role", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error fetching role",
      payload: { error: error.message },
    });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        status: "error",
        message: "Name and description are required",
        payload: null,
      });
    }

    const existingRole = await Role.findOne({ name: name.toUpperCase() });
    if (existingRole) {
      return res.status(400).json({
        status: "error",
        message: "Role already exists",
        payload: null,
      });
    }

    const role = await Role.create({
      name: name.toUpperCase(),
      description,
      permissions: [],
    });

    return res.status(201).json({
      status: "success",
      message: "Role created successfully",
      payload: { role },
    });
  } catch (error) {
    logger.error("Error creating role", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error creating role",
      payload: { error: error.message },
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Name cannot be empty",
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

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        status: "error",
        message: "Role not found",
        payload: null,
      });
    }

    if (name && name.toUpperCase() !== role.name) {
      const existingRole = await Role.findOne({ name: name.toUpperCase() });
      if (existingRole) {
        return res.status(400).json({
          status: "error",
          message: "A role with that name already exists",
          payload: null,
        });
      }
    }

    if (name) role.name = name.toUpperCase();
    if (description) role.description = description;

    await role.save();
    await role.populate("permissions");

    return res.status(200).json({
      status: "success",
      message: "Role updated successfully",
      payload: { role },
    });
  } catch (error) {
    logger.error("Error updating role", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error updating role",
      payload: { error: error.message },
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const deleted = await Role.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Role not found",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Role deleted successfully",
      payload: null,
    });
  } catch (error) {
    logger.error("Error deleting role", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error deleting role",
      payload: { error: error.message },
    });
  }
};

export const assignPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        status: "error",
        message: "You must provide an array of permission IDs",
        payload: null,
      });
    }

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        status: "error",
        message: "Role not found",
        payload: null,
      });
    }

    const foundPermissions = await Permission.find({
      _id: { $in: permissions },
    });

    if (foundPermissions.length !== permissions.length) {
      return res.status(400).json({
        status: "error",
        message: "Some permissions do not exist",
        payload: null,
      });
    }

    permissions.forEach((permId) => {
      if (!role.permissions.includes(permId)) {
        role.permissions.push(permId);
      }
    });

    await role.save();
    await role.populate("permissions");

    return res.status(200).json({
      status: "success",
      message: "Permissions added successfully",
      payload: { role },
    });
  } catch (error) {
    logger.error("Error adding permissions:", error);
    res.status(500).json({
      status: "error",
      message: "Error adding permissions",
      payload: { error: error.message },
    });
  }
};

export const unassignPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        status: "error",
        message: "You must provide an array of permission IDs",
        payload: null,
      });
    }

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        status: "error",
        message: "Role not found",
        payload: null,
      });
    }

    role.permissions = role.permissions.filter(
      (permId) => !permissions.includes(permId.toString())
    );

    await role.save();
    await role.populate("permissions");

    return res.status(200).json({
      status: "success",
      message: "Permissions removed successfully",
      payload: { role },
    });
  } catch (error) {
    logger.error("Error removing permissions:", error);
    res.status(500).json({
      status: "error",
      message: "Error removing permissions",
      payload: { error: error.message },
    });
  }
};
