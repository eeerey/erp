import express from "express";
import * as ProduksiGudangController from "../controllers/produksiGudangController.js";

const router = express.Router();

router.get("/", ProduksiGudangController.getProduksiGudang);

export default router;