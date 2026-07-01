import express from "express";
import * as LabaBarangController from "../controllers/labaBarangController.js";

const router = express.Router();

router.get("/", LabaBarangController.getLabaBarang);

export default router;