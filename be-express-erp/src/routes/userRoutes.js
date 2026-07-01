import express from "express";
import { 
  fetchAllUsers, 
  createNewUser, 
  updateUserController, 
  deleteUserController, 
  getUserByIdController 
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/jwt.js";
import { checkRole } from "../middleware/roleCheck.js";

const router = express.Router();

// Semua route memerlukan autentikasi
router.use(verifyToken);

// Get all users - Hanya SUPERADMIN yang bisa akses
router.get("/", checkRole(["SUPERADMIN", "SDM"]), fetchAllUsers);

// Get user by ID - Hanya SUPERADMIN yang bisa akses
router.get("/:id", checkRole(["SUPERADMIN", "SDM"]), getUserByIdController);

// Create new user - Hanya SUPERADMIN yang bisa akses
router.post("/", checkRole(["SUPERADMIN", "SDM"]), createNewUser);

// Update user - Hanya SUPERADMIN yang bisa akses
router.put("/:id", checkRole(["SUPERADMIN", "SDM"]), updateUserController);

// Delete user - Hanya SUPERADMIN yang bisa akses
router.delete("/:id", checkRole(["SUPERADMIN", "SDM"]), deleteUserController);

export default router;