import express from "express";
import * as HppErpController from "../controllers/hppErpController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// PUBLIC
router.get("/master-barang", HppErpController.getMasterBarang);
router.get("/form-data", HppErpController.getFormData);
router.get("/produk", HppErpController.getMasterNamaProduk);

router.post("/fase2", verifyToken, HppErpController.createFase2);

// PROTECTED
router.get("/", verifyToken, HppErpController.getAllHppErp);
router.post("/", verifyToken, HppErpController.createHppErp);
router.put("/:id", verifyToken, HppErpController.updateHppErp);
router.delete("/:id", verifyToken, HppErpController.deleteHppErp);
router.get("/:id", verifyToken, HppErpController.getHppDetail);


export default router;