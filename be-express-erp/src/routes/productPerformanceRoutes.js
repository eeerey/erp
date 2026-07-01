import express from "express";
import * as Controller from "../controllers/productPerformanceController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, Controller.getProductPerformance);
export default router;
