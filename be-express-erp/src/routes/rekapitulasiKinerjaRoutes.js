import express from "express";
import * as RekapController from "../controllers/rekapitulasiKinerjaController.js";
import { verifyToken } from "../middleware/jwt.js";
import { checkRole } from "../middleware/roleCheck.js";

const router = express.Router();

router.use(verifyToken);

// ✅ GET: My Rekapitulasi (Karyawan)
router.get(
  "/my",
  checkRole(["SUPERADMIN", "PRODUKSI", "GUDANG", "KEUANGAN", "HR", "SDM"]),
  RekapController.getMyRekapitulasi
);

// ✅ GET: All Rekapitulasi (HR only)
router.get(
  "/all",
  checkRole(["SUPERADMIN", "HR", "SDM"]),
  RekapController.getAllRekapitulasi
);

// ✅ GET: Performance Ranking (HR only)
router.get(
  "/ranking",
  checkRole(["SUPERADMIN", "HR", "SDM"]),
  RekapController.getPerformanceRanking
);

// ✅ GET: Rekapitulasi by Karyawan (HR only)
router.get(
  "/karyawan/:karyawan_id",
  checkRole(["SUPERADMIN", "HR", "SDM"]),
  RekapController.getRekapitulasiByKaryawan
);

// ✅ GET: Export to Excel
router.get(
  "/export",
  checkRole(["SUPERADMIN", "PRODUKSI", "GUDANG", "KEUANGAN", "HR", "SDM"]),
  RekapController.exportRekapitulasi
);

export default router;