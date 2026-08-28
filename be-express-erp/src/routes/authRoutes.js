import { Router } from "express";
import * as AuthController from "../controllers/authController.js";
import { verifyToken } from "../middleware/jwt.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import upload from "../middleware/upload-foto.js";

// 1. Initialize router FIRST
const router = Router();

const uploadKaryawanFiles = upload.fields([
  { name: "foto_karyawan", maxCount: 1 },
  { name: "foto_ktp", maxCount: 1 },
]);

/**
 * PUBLIC ROUTES
 */
router.post("/login", AuthController.login);

// LOGIN VIA GOOGLE
router.post("/google-login", AuthController.googleLogin);

// VERIFIKASI EMAIL VIA OTP & RESEND OTP
router.post("/verify-email", AuthController.verifyEmail);
router.post("/resend-verification", AuthController.resendVerificationToken);

/**
 * CONDITIONAL ROUTES
 */
router.post("/register", optionalAuth, AuthController.register);

router.post(
  "/register-karyawan",
  uploadKaryawanFiles,
  AuthController.registerKaryawan,
);

router.post(
  "/register-owner",
  uploadKaryawanFiles,
  AuthController.registerOwner,
);

/**
 * PROTECTED ROUTES
 */
router.get("/profile", verifyToken, AuthController.getProfile);

// UPDATE PROFILE & BERKAS FOTO/KTP
router.put(
  "/profile",
  verifyToken,
  uploadKaryawanFiles,
  AuthController.updateProfile,
);

// UBAH PASSWORD
router.put("/change-password", verifyToken, AuthController.changePassword);

router.post("/logout", verifyToken, AuthController.logout);

/**
 * PUBLIC ROUTES
 */
router.post("/forgot-password/send-otp", AuthController.forgotPasswordSendOtp);
router.post("/forgot-password/verify-otp", AuthController.verifyForgotOtp);
router.post("/forgot-password/reset", AuthController.resetPasswordWithOtp);

export default router;
