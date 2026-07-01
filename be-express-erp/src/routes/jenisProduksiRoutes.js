import express from "express";
import * as ProduksiController from "../controllers/jenisProduksiController.js";

const router = express.Router();

router.get("/", ProduksiController.getProduksi);
router.post("/", ProduksiController.createProduksi);
router.put("/:id", ProduksiController.updateProduksi);
router.delete("/:id", ProduksiController.deleteProduksi);

export default router;