import express from "express";
import * as ProduksiController from "../controllers/jenisProduksiController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();


router.get("/", verifyToken, ProduksiController.getProduksi);
router.post("/", verifyToken, ProduksiController.createProduksi);
router.put("/:id", verifyToken, ProduksiController.updateProduksi);
router.delete("/:id", verifyToken, ProduksiController.deleteProduksi);

export default router;