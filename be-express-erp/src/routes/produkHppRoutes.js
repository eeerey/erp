import express from "express";
import {
  getProdukHpp,
} from "../controllers/produkHppController.js";

const router = express.Router();

// ======================
// GET PRODUK YANG SUDAH ADA HPP
// ======================
router.get("/", getProdukHpp);

export default router;