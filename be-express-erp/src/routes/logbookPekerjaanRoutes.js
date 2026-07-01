// routes/logbookPekerjaanRoutes.js
import express from "express";
import * as LogbookController from "../controllers/logbookPekerjaanController.js";
import { verifyToken } from "../middleware/jwt.js";
import { checkRole } from "../middleware/roleCheck.js";
import { uploadLogbook } from "../middleware/upload-foto.js"; // ✅ Import uploadLogbook

const router = express.Router();

// ✅ Semua route memerlukan autentikasi
router.use(verifyToken);

// ✅ GET: History validasi logbook (spesifik route)
router.get(
  "/:logbook_id/validasi",
  checkRole(["SUPERADMIN", "HR", "PRODUKSI", "GUDANG", "KEUANGAN", "SDM"]),
  LogbookController.getLogbookValidasi
);

// ✅ POST: Validate logbook - Approve/Reject (HANYA HR)
router.post(
  "/:logbook_id/validate",
  checkRole(["SUPERADMIN", "HR", "SDM"]),
  LogbookController.validateLogbook
);

// ✅ PATCH: Submit logbook (Produksi, Gudang, Keuangan)
router.patch(
  "/:id/submit",
  checkRole(["SUPERADMIN", "PRODUKSI", "GUDANG", "KEUANGAN", "SDM"]),
  LogbookController.submitLogbook
);

// ✅ GET: Ambil semua logbook
router.get(
  "/",
  checkRole(["SUPERADMIN", "HR", "PRODUKSI", "GUDANG", "KEUANGAN", "SDM"]),
  LogbookController.getAllLogbook
);

// ✅ POST: Buat logbook baru (dengan upload foto)
router.post(
  "/",
  checkRole(["SUPERADMIN", "PRODUKSI", "GUDANG", "KEUANGAN", "SDM"]),
  uploadLogbook.single("foto_bukti"), // ✅ Menggunakan uploadLogbook
  LogbookController.createLogbook
);

// ✅ PUT: Update logbook (dengan upload foto)
router.put(
  "/:id",
  checkRole(["SUPERADMIN", "PRODUKSI", "GUDANG", "KEUANGAN", "SDM"]),
  uploadLogbook.single("foto_bukti"), // ✅ Menggunakan uploadLogbook
  LogbookController.updateLogbook
);

// ✅ DELETE: Hapus logbook
router.delete(
  "/:id",
  checkRole(["SUPERADMIN", "PRODUKSI", "GUDANG", "KEUANGAN", "SDM"]),
  LogbookController.deleteLogbook
);

// ✅ GET: Ambil logbook by ID (PALING BAWAH)
router.get(
  "/:id",
  checkRole(["SUPERADMIN", "HR", "PRODUKSI", "GUDANG", "KEUANGAN", "SDM"]),
  LogbookController.getLogbookById
);

// ✅ POST: Revise logbook (ubah Rejected → Draft)
router.post(
  "/:id/revise",
  checkRole(["SUPERADMIN", "PRODUKSI", "GUDANG", "KEUANGAN", "SDM"]),
  LogbookController.reviseLogbook
);

// ✅ GET: History revisi logbook
router.get(
  "/:logbook_id/revisi",
  checkRole(["SUPERADMIN", "HR", "PRODUKSI", "GUDANG", "KEUANGAN", "SDM"]),
  LogbookController.getLogbookRevisi
);

export default router;