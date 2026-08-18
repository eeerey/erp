import express from "express";
import * as MasterRakController from "../controllers/masterRakController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Menampilkan semua rak
router.get("/", verifyToken, MasterRakController.getAllRak);

// Menampilkan rak berdasarkan gudang
router.get(
  "/gudang/:kode_gudang",
  verifyToken,
  MasterRakController.getRakByGudang,
);

// Menambah rak
router.post("/", verifyToken, MasterRakController.createRak);

// Update
router.put("/:id", verifyToken, MasterRakController.updateRak);

// Delete
router.delete("/:id", verifyToken, MasterRakController.deleteRak);

export default router;
