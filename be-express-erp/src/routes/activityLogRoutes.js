import { Router } from "express";
import { getActivityLogsForSuperAdmin } from "../controllers/activityLogController.js";
import { verifyToken, authorizeRoles } from "../middleware/jwt.js"; // 👈 Path dan fungsi yang benar

const router = Router();

// Endpoint ini sekarang terproteksi total untuk SUPERADMIN
router.get(
  "/activity-logs",
  verifyToken,
  authorizeRoles("SUPERADMIN"), // 👈 Menggunakan authorizeRoles dari jwt.js
  getActivityLogsForSuperAdmin,
);

export default router;
