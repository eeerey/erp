import express from "express";
import * as ProdukController from "../controllers/produkController.js";

const router = express.Router();

router.get("/", ProdukController.getMasterNamaProduk);

export default router;