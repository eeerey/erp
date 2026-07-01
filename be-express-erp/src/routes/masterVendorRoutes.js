import express from "express";
import * as MasterVendorController from "../controllers/masterVendorController.js";
import { verifyToken } from "../middleware/jwt.js";
import { checkRole } from "../middleware/roleCheck.js";

const router = express.Router();

// Semua route memerlukan autentikasi
router.use(verifyToken);

// Ambil semua vendor - Hanya SUPERADMIN yang bisa akses
router.get("/", checkRole(["SUPERADMIN", "SDM"]), MasterVendorController.getAllVendor);

// Ambil vendor by ID - Hanya SUPERADMIN yang bisa akses
router.get("/:id", checkRole(["SUPERADMIN", "SDM"]), MasterVendorController.getVendorById);

// Tambah vendor - Hanya SUPERADMIN yang bisa akses
router.post("/", checkRole(["SUPERADMIN", "SDM"]), MasterVendorController.createVendor);

// Update vendor - Hanya SUPERADMIN yang bisa akses
router.put("/:id", checkRole(["SUPERADMIN", "SDM"]), MasterVendorController.updateVendor);

// Hapus vendor - Hanya SUPERADMIN yang bisa akses
router.delete("/:id", checkRole(["SUPERADMIN", "SDM"]), MasterVendorController.deleteVendor);

export default router;