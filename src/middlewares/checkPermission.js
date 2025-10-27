import logger from "../config/logger.js";

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
          payload: null,
        });
      }

      if (!req.user.role || !req.user.role.permissions) {
        await req.user.populate({
          path: "role",
          populate: { path: "permissions" },
        });
      }

      const hasPermission = req.user.role.permissions.some(
        (perm) => perm.name === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({
          status: "error",
          message: `You do not have permission to perform this action. Required permission: ${requiredPermission}`,
          payload: null,
        });
      }

      next();
    } catch (error) {
      logger.error("Error checking permissions", { message: error.message });
      return res.status(500).json({
        status: "error",
        message: "Error checking permissions",
        payload: { error: error.message },
      });
    }
  };
};

export default checkPermission;
