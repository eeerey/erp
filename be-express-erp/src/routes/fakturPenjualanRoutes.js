import express from "express";

import {
  getAllFakturPenjualan,
  getDetailFaktur,
  createFakturPenjualan,
  generateNoFaktur,
  deleteFaktur,
} from "../controllers/fakturPenjualanController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

/**
 * GET ALL FAKTUR (HEADER LIST)
 */
router.get("/", verifyToken, getAllFakturPenjualan);

/**
 * GET DETAIL PER FAKTUR
 */
router.get("/detail/:noFaktur", verifyToken, getDetailFaktur);

/**
 * GENERATE NO FAKTUR
 */
router.get("/generate-no-faktur", verifyToken, generateNoFaktur);

/**
 * CREATE FAKTUR + DETAIL
 */
router.post("/", verifyToken, createFakturPenjualan);

/**
 * DELETE FAKTUR (HEADER + DETAIL)
 */
router.delete("/:noFaktur", verifyToken, deleteFaktur);

export default router;