import express from "express";

import * as HppKalkulasiController from "../controllers/hppKalkulasiController.js";

import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// ======================================================
// MASTER BARANG
// ======================================================

router.get(
  "/master-barang",
  verifyToken,
  HppKalkulasiController.getMasterBarang,
);

// ======================================================
// HPP KALKULASI
// ======================================================

router.get("/", verifyToken, HppKalkulasiController.getAll);

router.get("/:id", verifyToken, HppKalkulasiController.getById);

router.post("/", verifyToken, HppKalkulasiController.create);

router.put("/:id", verifyToken, HppKalkulasiController.update);

router.delete("/:id", verifyToken, HppKalkulasiController.remove);

export default router;
