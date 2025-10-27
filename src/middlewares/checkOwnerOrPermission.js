import logger from "../config/logger.js";

const checkOwnerOrPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
          payload: null,
        });
      }

      const userId = req.params.id;
      const currentUserId = req.user._id.toString();

      if (currentUserId === userId) {
        return next();
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

      if (hasPermission) {
        return next();
      }

      return res.status(403).json({
        status: "error",
        message: `You cannot modify or delete another user without sufficient permissions. You need the permission: ${requiredPermission}`,
        payload: null,
      });
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

export default checkOwnerOrPermission;
