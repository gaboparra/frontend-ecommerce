import User from "../models/User.js";
import Role from "../models/Role.js";
import logger from "../config/logger.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("role");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile fetched successfully",
      payload: { user },
    });
  } catch (error) {
    logger.error("Error fetching profile", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error fetching profile",
      payload: { error: error.message },
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate({
      path: "role",
      select: "-permissions",
    });
    return res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      payload: { users },
    });
  } catch (error) {
    logger.error("Error fetching users", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error fetching users",
      payload: { error: error.message },
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("role");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      payload: { user },
    });
  } catch (error) {
    logger.error("Error fetching user", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error fetching user",
      payload: { error: error.message },
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (username !== undefined && username.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Username cannot be empty",
      });
    }

    if (email !== undefined) {
      if (email.trim() === "") {
        return res.status(400).json({
          status: "error",
          message: "Email cannot be empty",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid email format",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({
          status: "error",
          message: "Email is already registered",
        });
      }
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    await user.populate("role");

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      payload: user,
    });
  } catch (err) {
    logger.error("Error updating user", { message: err.message });
    res.status(500).json({
      status: "error",
      message: "Error updating user",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      payload: null,
    });
  } catch (error) {
    logger.error("Error deleting user", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error deleting user",
      payload: { error: error.message },
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({
        status: "error",
        message: "The 'roleName' field is required",
        payload: null,
      });
    }

    const role = await Role.findOne({ name: roleName.toUpperCase() });
    if (!role) {
      return res.status(404).json({
        status: "error",
        message: `The role '${roleName}' does not exist`,
        payload: null,
      });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        payload: null,
      });
    }

    user.role = role._id;
    await user.save();
    await user.populate("role");

    return res.status(200).json({
      status: "success",
      message: `Role updated to '${role.name}' successfully`,
      payload: { user },
    });
  } catch (error) {
    logger.error("Error updating user role", {
      message: error.message,
    });
    res.status(500).json({
      status: "error",
      message: "Error updating user role",
      payload: { error: error.message },
    });
  }
};
