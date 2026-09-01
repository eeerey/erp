import { Router } from "express";
import * as AuthController from "../controllers/authController.js";
import { verifyToken } from "../middleware/jwt.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
// Cukup import uploadKaryawan dan handleUpload dari middleware
import { uploadKaryawan, handleUpload } from "../middleware/upload-foto.js";

const router = Router();

// Konfigurasi field upload file
const uploadKaryawanFiles = uploadKaryawan.fields([
  { name: "foto_karyawan", maxCount: 1 },
  { name: "foto_umkm", maxCount: 3 },
]);

/**
 * PUBLIC ROUTES
 */
router.post("/login", AuthController.login);
router.post("/google-login", AuthController.googleLogin);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/resend-verification", AuthController.resendVerificationToken);

/**
 * CONDITIONAL & REGISTRATION ROUTES
 */
router.post("/register", optionalAuth, AuthController.register);

// Gunakan handleUpload pada register-karyawan
router.post(
  "/register-karyawan",
  handleUpload(uploadKaryawanFiles),
  AuthController.registerKaryawan,
);

// Gunakan handleUpload pada register-owner
router.post(
  "/register-owner",
  handleUpload(uploadKaryawanFiles),
  AuthController.registerOwner,
);

/**
 * PROTECTED ROUTES
 */
router.get("/profile", verifyToken, AuthController.getProfile);

// Gunakan handleUpload pada update profile
router.put(
  "/profile",
  verifyToken,
  handleUpload(uploadKaryawanFiles),
  AuthController.updateProfile,
);

router.put("/change-password", verifyToken, AuthController.changePassword);
router.post("/logout", verifyToken, AuthController.logout);

/**
 * FORGOT PASSWORD ROUTES
 */
router.post("/forgot-password/send-otp", AuthController.forgotPasswordSendOtp);
router.post("/forgot-password/verify-otp", AuthController.verifyForgotOtp);
router.post("/forgot-password/reset", AuthController.resetPasswordWithOtp);

// Gunakan handleUpload pada complete-company
router.post(
  "/complete-company",
  verifyToken,
  AuthController.completeCompanyProfile,
);

export default router;
