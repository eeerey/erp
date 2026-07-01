import express from "express";
import * as Controller from "../controllers/customerProfitController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();
router.get("/", verifyToken, Controller.getCustomerProfit);

export default router;