import User from "../models/User.js";
import Role from "../models/Role.js";
import generateToken from "../utils/generateToken.js";
import logger from "../config/logger.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
        payload: null,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
        payload: null,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
        payload: null,
      });
    }

    const userRole = await Role.findOne({ name: "USER" });
    if (!userRole) {
      return res.status(500).json({
        status: "error",
        message: "Error: USER role does not exist in the database",
        payload: null,
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: userRole,
    });

    await user.populate("role");

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      payload: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role.name,
        },
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    logger.error("Error registering user", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error registering user",
      payload: { error: error.message },
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
        payload: null,
      });
    }

    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        payload: null,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      payload: {
        token: generateToken(user._id),
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role.name,
        },
      },
    });
  } catch (error) {
    logger.error("Error logging in", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error logging in",
      payload: { error: error.message },
    });
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Logout successful (token should be invalidated client-side)",
    payload: null,
  });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "You must provide the current and new password",
        payload: null,
      });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Current password is incorrect",
        payload: null,
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "New password must be at least 6 characters long",
        payload: null,
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      payload: null,
    });
  } catch (error) {
    logger.error("Error changing password", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error changing password",
      payload: { error: error.message },
    });
  }
};
