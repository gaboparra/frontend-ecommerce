import { Router } from "express";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissions,
  unassignPermissions,
} from "../controllers/role.controller.js";
import authorization from "../middlewares/authorization.js";
import checkPermission from "../middlewares/checkPermission.js";

const router = Router();

router.get("/", authorization, checkPermission("roles:read"), getRoles);
router.get("/:id", authorization, checkPermission("roles:read"), getRoleById);
router.post("/", authorization, checkPermission("roles:create"), createRole);
router.put("/:id", authorization, checkPermission("roles:update"), updateRole);
router.delete("/:id", authorization, checkPermission("roles:delete"), deleteRole);

router.put("/:id/permissions", authorization, checkPermission("roles:update"), assignPermissions);
router.delete("/:id/permissions", authorization, checkPermission("roles:delete"), unassignPermissions);

export default router;
