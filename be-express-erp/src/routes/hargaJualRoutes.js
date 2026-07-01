import express from "express";

import {
  getAllHargaJual,
  saveHargaJual,
} from "../controllers/hargaJualController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();


router.get("/", verifyToken, getAllHargaJual);
router.post("/", verifyToken, saveHargaJual);

export default router;