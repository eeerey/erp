import express from "express";
import * as MasterBarangController from "../controllers/masterBarangController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();
router.use(verifyToken);

// Ambil semua barang (termasuk join nama jenis & satuan)
router.get("/", MasterBarangController.getAllBarang);

// Ambil barang by ID
router.get("/:id", MasterBarangController.getBarangById);

// Tambah barang baru
router.post("/", MasterBarangController.createBarang);

// Update barang
router.put("/:id", MasterBarangController.updateBarang);

// Hapus barang
router.delete("/:id", MasterBarangController.deleteBarang);

export default router;