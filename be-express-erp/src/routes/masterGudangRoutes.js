import express from "express";
import * as MasterGudangController from "../controllers/masterGudangController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, MasterGudangController.getAllGudang);

router.post("/", verifyToken, MasterGudangController.createGudang);

router.put("/:id", verifyToken, MasterGudangController.updateGudang);

router.delete("/:id", verifyToken, MasterGudangController.deleteGudang);

export default router;
