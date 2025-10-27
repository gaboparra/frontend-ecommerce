import { Router } from "express";
import {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permission.controller.js";
import authorization from "../middlewares/authorization.js";
import checkPermission from "../middlewares/checkPermission.js";

const router = Router();

router.get("/", authorization, checkPermission("permissions:read"), getPermissions);
router.get("/:id", authorization, checkPermission("permissions:read"), getPermissionById);
router.post("/", authorization, checkPermission("permissions:create"), createPermission);
router.put("/:id", authorization, checkPermission("permissions:update"), updatePermission);
router.delete("/:id", authorization, checkPermission("permissions:delete"), deletePermission);

export default router;
