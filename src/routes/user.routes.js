import { Router } from "express";
import {
  getMyProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
} from "../controllers/user.controller.js";
import authorization from "../middlewares/authorization.js";
import checkPermission from "../middlewares/checkPermission.js";
import checkOwnerOrPermission from "../middlewares/checkOwnerOrPermission.js";

const router = Router();

router.get("/me", authorization, getMyProfile);
router.get("/", authorization, checkPermission("users:read"), getUsers);
router.get("/:id", authorization, checkPermission("users:read"), getUserById);
router.put("/:id", authorization, checkOwnerOrPermission("users:update"), updateUser);
router.delete("/:id", authorization, checkOwnerOrPermission("users:delete"), deleteUser);

router.patch("/:id/role", authorization, checkPermission("users:update"), updateUserRole);

export default router;
