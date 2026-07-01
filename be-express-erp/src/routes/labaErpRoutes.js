import express from "express";
import * as LabaErpController from "../controllers/labaErpController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, LabaErpController.getLabaErp);

export default router;