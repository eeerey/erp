import fs from "fs/promises";
import path from "path";
import { db } from "../core/config/knex.js";
import { getUserByEmail } from "../models/userModel.js";
import { addLoginHistory } from "../models/loginHistoryModel.js";
import { sendVerificationEmail, generateOTP } from "../utils/email.js";
import {
  countSuperAdmin,
  getUserProfileById,
  blacklistToken,
  checkEmailExists,
  checkNikExists,
  createKaryawan,
  generateKaryawanId,
} from "../models/authModel.js";
import { createCompany, getCompanyByName } from "../models/companyModel.js";
import {
  registerSchema,
  loginSchema,
  registerKaryawanSchema,
  resendVerificationSchema,
} from "../schemas/authSchema.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { datetime, status } from "../utils/general.js";
import { OAuth2Client } from "google-auth-library";
import {
  createActivityLog,
  updateActivityLogOnLogout,
} from "../models/activityLogModel.js";
import { removeFile } from "../middleware/upload-foto.js";
import { sendEmailOtp } from "../utils/reset_password.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Helper Hapus Orphan Files Fisik
 */
const removeUploadedFiles = async (...filePaths) => {
  for (const filePath of filePaths) {
    if (filePath) {
      removeFile(filePath);
    }
  }
};

/**
 * REGISTER GENERAL USER
 */
export const register = async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Validasi gagal",
        datetime: datetime(),
        errors: validation.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    const { name, email, password, role, company_name } = validation.data;
    const totalSuperAdmin = await countSuperAdmin();

    if (totalSuperAdmin > 0) {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token || !req.user || req.user.role !== "SUPERADMIN") {
        return res.status(403).json({
          status: status.GAGAL,
          message: "Hanya SUPERADMIN yang dapat mendaftarkan user baru",
          datetime: datetime(),
        });
      }
    }

    if (role === "SUPERADMIN" && totalSuperAdmin >= 3) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Maksimal 3 Super Admin sudah terdaftar.",
        datetime: datetime(),
      });
    }

    const otpCode = generateOTP(); // 6 Digit OTP
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 Menit
    const hashedPassword = await hashPassword(password);
    const isSuperAdminRole = role === "SUPERADMIN";

    const user = await db.transaction(async (trx) => {
      const existingUser = await trx("users").where({ email }).first();
      if (existingUser) throw new Error("EMAIL_EXISTS");

      const companyExists = await trx("companies")
        .where({ nama_perusahaan: company_name })
        .first();
      if (companyExists) throw new Error("COMPANY_EXISTS");

      const [companyInsert] = await trx("companies")
        .insert({ nama_perusahaan: company_name })
        .returning("id");
      const companyId =
        typeof companyInsert === "object" ? companyInsert.id : companyInsert;

      const [userInsert] = await trx("users")
        .insert({
          name,
          email,
          password: hashedPassword,
          role,
          company_id: companyId,
          is_verified: isSuperAdminRole ? true : false,
          verification_token: isSuperAdminRole ? null : otpCode,
          token_expires_at: isSuperAdminRole ? null : tokenExpiresAt,
          created_at: new Date(),
        })
        .returning("id");
      const userId =
        typeof userInsert === "object" ? userInsert.id : userInsert;

      return trx("users").where({ id: userId }).first();
    });

    if (!isSuperAdminRole) {
      try {
        await sendVerificationEmail(email, otpCode);
      } catch (emailErr) {
        console.error("Gagal mengirim email verifikasi:", emailErr);
      }
    }

    return res.status(201).json({
      status: status.SUKSES,
      message: isSuperAdminRole
        ? "Super Admin berhasil didaftarkan dan dapat langsung login."
        : "User berhasil didaftarkan. Silakan periksa email Anda untuk kode OTP verifikasi.",
      datetime: datetime(),
      expiresAt: isSuperAdminRole ? null : tokenExpiresAt,
      otp_dev: isSuperAdminRole ? null : otpCode,
    });
  } catch (error) {
    console.error("Error register:", error);
    if (error.message === "EMAIL_EXISTS") {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email sudah terdaftar",
        datetime: datetime(),
      });
    }
    if (error.message === "COMPANY_EXISTS") {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Nama perusahaan sudah digunakan",
        datetime: datetime(),
      });
    }
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * LOGIN (WAJIB VERIFIKASI OTP)
 */
export const login = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Validasi gagal",
        datetime: datetime(),
        errors: validation.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    const { email, password } = validation.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email atau password salah",
        datetime: datetime(),
      });
    }

    // 1. Cek Akun Google
    const isGoogleAccount =
      !existingUser.password || existingUser.password === "";

    if (isGoogleAccount) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message:
          "Akun ini terdaftar menggunakan Google. Silakan login menggunakan tombol Google Login.",
        datetime: datetime(),
      });
    }

    // 2. Cek Password
    const isPasswordTrue = await comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordTrue) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email atau password salah",
        datetime: datetime(),
      });
    }

    // 3. TOLAK LOGIN JIKA BELUM VERIFIKASI OTP
    if (!existingUser.is_verified) {
      return res.status(401).json({
        status: status.GAGAL,
        message:
          "Akun Anda belum terverifikasi. Silakan masukkan kode OTP yang dikirim ke email Anda terlebih dahulu.",
        datetime: datetime(),
        is_verified: false,
      });
    }

    let karyawanId = null;
    if (!["SUPERADMIN"].includes(existingUser.role)) {
      const karyawan = await db("master_karyawan")
        .where("EMAIL", existingUser.email)
        .select("KARYAWAN_ID")
        .first();

      if (karyawan) karyawanId = karyawan.KARYAWAN_ID;
    }

    const logId = await createActivityLog(existingUser.id);

    const token = await generateToken({
      userId: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
      karyawan_id: karyawanId,
      company_id: existingUser.company_id,
      log_id: logId,
    });

    addLoginHistory({
      userId: existingUser.id,
      action: "LOGIN",
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "unknown",
    }).catch((err) => console.error("Gagal menyimpan login history:", err));

    return res.status(200).json({
      status: status.SUKSES,
      message: "Login berhasil",
      datetime: datetime(),
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        karyawan_id: karyawanId,
        log_id: logId,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * GET PROFILE
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: status.TIDAK_ADA_TOKEN,
        message: "Token tidak valid atau tidak ditemukan",
        datetime: datetime(),
      });
    }

    const user = await getUserProfileById(userId);
    if (!user) {
      return res.status(404).json({
        status: status.GAGAL,
        message: "User tidak ditemukan",
        datetime: datetime(),
      });
    }

    // 👈 Parsing FOTO_KTP (yang berisi string JSON Foto UMKM) menjadi Array
    if (user.karyawan && user.karyawan.FOTO_KTP) {
      try {
        // Jika format di DB adalah JSON string ["/uploads/foto_umkm/file1.jpg", ...]
        user.karyawan.FOTO_UMKM = JSON.parse(user.karyawan.FOTO_KTP);
      } catch (e) {
        // Jika data lama hanya berupa 1 string path biasa
        user.karyawan.FOTO_UMKM = [user.karyawan.FOTO_KTP];
      }
    } else if (user.karyawan) {
      user.karyawan.FOTO_UMKM = [];
    }

    return res.status(200).json({
      status: status.SUKSES,
      message: "Berhasil mengambil profil user",
      datetime: datetime(),
      user,
    });
  } catch (error) {
    console.error("Error getProfile:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * LOGOUT
 */
export const logout = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const userId = req.user?.userId || req.user?.id;
    const logId = req.user?.log_id;

    if (!token || !userId) {
      return res.status(401).json({
        status: status.TIDAK_ADA_TOKEN,
        message: "Token tidak valid atau tidak ditemukan",
        datetime: datetime(),
      });
    }

    if (logId) {
      await updateActivityLogOnLogout(logId);
    }

    const expiryDate = req.user?.exp
      ? new Date(req.user.exp * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    await blacklistToken(token, expiryDate);

    addLoginHistory({
      userId,
      action: "LOGOUT",
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "unknown",
    }).catch((err) => console.error("Gagal menyimpan logout history:", err));

    return res.status(200).json({
      status: status.SUKSES,
      message: "Logout berhasil, token sudah tidak berlaku",
      datetime: datetime(),
    });
  } catch (error) {
    console.error("Error logout:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * REGISTER KARYAWAN
 */
export const registerKaryawan = async (req, res) => {
  const files = req.files || {};
  const fotoKaryawanFile = files.foto_karyawan?.[0] || null;
  const fotoKtpFile = files.foto_ktp?.[0] || null;

  const fotoPath = fotoKaryawanFile
    ? `/uploads/foto_karyawan/${fotoKaryawanFile.filename}`
    : null;
  const fotoKtpPath = fotoKtpFile
    ? `/uploads/foto_ktp/${fotoKtpFile.filename}`
    : null;

  try {
    if (!fotoKtpFile) {
      await removeUploadedFiles(fotoPath);
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Foto KTP wajib diunggah!",
        datetime: datetime(),
      });
    }

    const validation = registerKaryawanSchema.safeParse(req.body);
    if (!validation.success) {
      await removeUploadedFiles(fotoPath, fotoKtpPath);
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Validasi gagal",
        datetime: datetime(),
        errors: validation.error.errors,
      });
    }

    const parsed = validation.data;
    let company = await getCompanyByName(parsed.company_name);
    if (!company) {
      company = await createCompany(parsed.company_name);
    }
    const companyId = company.id;

    if (await checkEmailExists(parsed.email)) {
      await removeUploadedFiles(fotoPath, fotoKtpPath);
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email sudah terdaftar",
        datetime: datetime(),
      });
    }

    if (await checkNikExists(parsed.nik)) {
      await removeUploadedFiles(fotoPath, fotoKtpPath);
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "NIK sudah terdaftar",
        datetime: datetime(),
      });
    }

    const otpCode = generateOTP();
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const { karyawanId } = await createKaryawan(
      {
        EMAIL: parsed.email,
        NIK: parsed.nik,
        NAMA: parsed.nama,
        GENDER: parsed.gender,
        TEMPAT_LAHIR: parsed.tempat_lahir || null,
        TGL_LAHIR: parsed.tgl_lahir || null,
        ALAMAT: parsed.alamat || null,
        NO_TELP: parsed.no_telp || null,
        DEPARTEMEN: parsed.departemen,
        JABATAN: parsed.jabatan,
        TANGGAL_MASUK: parsed.tanggal_masuk || new Date(),
        STATUS_KARYAWAN: parsed.status_karyawan || "Kontrak",
        STATUS_AKTIF: "Aktif",
        SHIFT: parsed.shift || null,
        PENDIDIKAN_TERAKHIR: parsed.pendidikan_terakhir || null,
        FOTO: fotoPath,
        NPWP: parsed.npwp || null,
        NIB: parsed.nib || null,
        FOTO_KTP: fotoKtpPath,
      },
      {
        name: parsed.nama,
        email: parsed.email,
        password: parsed.password,
        role: parsed.role,
        company_id: companyId,
      },
      {
        token: otpCode,
        expiresAt: tokenExpiresAt,
      },
    );

    try {
      await sendVerificationEmail(parsed.email, otpCode);
    } catch (emailErr) {
      console.error("Gagal kirim email karyawan:", emailErr);
    }

    return res.status(201).json({
      status: status.SUKSES,
      message:
        "Registrasi berhasil! Cek email kamu untuk kode OTP verifikasi akun.",
      datetime: datetime(),
      karyawan_id: karyawanId,
      otp_dev: otpCode,
    });
  } catch (err) {
    await removeUploadedFiles(fotoPath, fotoKtpPath);
    console.error("Error registerKaryawan:", err);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${err.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * VERIFY OTP (VERIFIKASI EMAIL)
 */
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email dan Kode OTP wajib diisi.",
        datetime: datetime(),
      });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: status.BAD_REQUEST,
        message: "User tidak ditemukan.",
        datetime: datetime(),
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Akun ini sudah terverifikasi. Silakan login.",
        datetime: datetime(),
      });
    }

    if (user.verification_token !== otp) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Kode OTP tidak cocok / salah.",
        datetime: datetime(),
      });
    }

    if (new Date() > new Date(user.token_expires_at)) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Kode OTP sudah kadaluwarsa. Silakan minta kode OTP baru.",
        datetime: datetime(),
      });
    }

    await db("users").where({ id: user.id }).update({
      is_verified: true,
      verification_token: null,
      token_expires_at: null,
      updated_at: new Date(),
    });

    return res.status(200).json({
      status: status.SUKSES,
      message: "Verifikasi akun berhasil! Silakan login.",
      datetime: datetime(),
    });
  } catch (err) {
    console.error("Error verifyEmail:", err);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${err.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * RESEND OTP CODE
 */
export const resendVerificationToken = async (req, res) => {
  try {
    const validation = resendVerificationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Validasi gagal",
        datetime: datetime(),
        errors: validation.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    const { email } = validation.data;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(200).json({
        status: status.SUKSES,
        message:
          "Jika email terdaftar, kami telah mengirimkan kode OTP verifikasi baru.",
        datetime: datetime(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Akun ini sudah terverifikasi. Silakan login.",
        datetime: datetime(),
      });
    }

    const otpCode = generateOTP();
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db("users").where({ id: user.id }).update({
      verification_token: otpCode,
      token_expires_at: tokenExpiresAt,
      updated_at: new Date(),
    });

    await sendVerificationEmail(email, otpCode);

    return res.status(200).json({
      status: status.SUKSES,
      message: "Kode OTP verifikasi baru telah dikirim ke email Anda.",
      datetime: datetime(),
      otp_dev: otpCode,
    });
  } catch (error) {
    console.error("Error resendVerificationToken:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};
/**
 * REGISTER OWNER
 */
export const registerOwner = async (req, res) => {
  const files = req.files || {};
  const fotoKaryawanFile = files.foto_karyawan?.[0] || null;
  const fotoUmkmFiles = files.foto_umkm || [];

  // 1. Deklarasikan fotoPath
  const fotoPath = fotoKaryawanFile
    ? `/uploads/foto_karyawan/${fotoKaryawanFile.filename}`
    : null;

  // 2. Map path foto UMKM (1 - 3 file)
  const fotoUmkmPaths = fotoUmkmFiles.map(
    (file) => `/uploads/foto_umkm/${file.filename}`,
  );

  // Helper lokal untuk rollback/hapus file yang terlanjur diunggah jika validasi gagal
  const cleanupFiles = async () => {
    if (typeof removeUploadedFiles === "function") {
      // Hapus foto profil dan seluruh foto UMKM
      await removeUploadedFiles(fotoPath, ...fotoUmkmPaths);
    }
  };

  try {
    // Validasi Wajib minimal 1 Foto UMKM
    if (fotoUmkmFiles.length === 0) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Foto UMKM wajib diunggah minimal 1 foto!",
        datetime: datetime(),
      });
    }

    const {
      email,
      password,
      nik,
      nama,
      gender,
      tempat_lahir,
      tgl_lahir,
      alamat,
      no_telp,
      npwp,
      nama_perusahaan,
      npwp_perusahaan,
      nib,
      alamat_perusahaan,
      no_telp_perusahaan,
    } = req.body;

    if (!email || !password || !nama_perusahaan) {
      await cleanupFiles();
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email, Password, dan Nama Perusahaan wajib diisi!",
        datetime: datetime(),
      });
    }

    if (await checkEmailExists(email)) {
      await cleanupFiles();
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email sudah terdaftar",
        datetime: datetime(),
      });
    }

    if (nik && (await checkNikExists(nik))) {
      await cleanupFiles();
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "NIK sudah terdaftar",
        datetime: datetime(),
      });
    }

    let company = await getCompanyByName(nama_perusahaan);
    if (!company) {
      company = await createCompany(nama_perusahaan);
    }
    const companyId = company.id;

    if (npwp_perusahaan || nib || alamat_perusahaan || no_telp_perusahaan) {
      await db("companies")
        .where({ id: companyId })
        .update({
          npwp: npwp_perusahaan || null,
          nib: nib || null,
          alamat: alamat_perusahaan || null,
          no_telp: no_telp_perusahaan || null,
        });
    }

    const otpCode = generateOTP();
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Konversi array foto UMKM ke String JSON untuk disimpan ke DB
    const fotoUmkmString =
      fotoUmkmPaths.length > 0 ? JSON.stringify(fotoUmkmPaths) : null;

    const { userId, karyawanId, id } = await createKaryawan(
      {
        EMAIL: email,
        NIK: nik || null,
        NAMA: nama,
        GENDER: gender || "L",
        TEMPAT_LAHIR: tempat_lahir || null,
        TGL_LAHIR: tgl_lahir || null,
        ALAMAT: alamat || null,
        NO_TELP: no_telp || null,
        DEPARTEMEN: "DIRECTOR",
        JABATAN: "Owner",
        STATUS_KARYAWAN: "Tetap",
        STATUS_AKTIF: "Aktif",
        FOTO: fotoPath,
        NPWP: npwp || null,
        NIB: nib || null,
        FOTO_KTP: fotoUmkmString, // 👈 Disimpan sebagai JSON String dari foto UMKM
      },
      {
        name: nama,
        email: email,
        password: password,
        role: "SDM",
        company_id: companyId,
      },
      {
        token: otpCode,
        expiresAt: tokenExpiresAt,
      },
    );

    try {
      await sendVerificationEmail(email, otpCode);
    } catch (emailErr) {
      console.error("Gagal kirim email verifikasi owner:", emailErr);
    }

    return res.status(201).json({
      status: status.SUKSES,
      message:
        "Registrasi Owner berhasil dibuat. Silakan cek email Anda untuk kode OTP verifikasi.",
      datetime: datetime(),
      expiresAt: tokenExpiresAt,
      data: { companyId, karyawanId, userId, id },
      otp_dev: otpCode,
    });
  } catch (error) {
    console.error("Register Owner Error:", error);
    await cleanupFiles();
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};
/**
 * LOGIN & AUTO-REGISTER VIA GOOGLE
 */
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Credential token Google wajib dikirim.",
        datetime: datetime(),
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let existingUser = await getUserByEmail(email);
    let isNewUser = false;

    if (!existingUser) {
      isNewUser = true;
      existingUser = await db.transaction(async (trx) => {
        // 1. Cek atau Buat Perusahaan Default
        let defaultCompany = await trx("companies")
          .where({ nama_perusahaan: "Umum / Perorangan" })
          .first();

        let companyId;
        if (!defaultCompany) {
          const [insertedCompany] = await trx("companies")
            .insert({ nama_perusahaan: "Umum / Perorangan" })
            .returning("id");
          companyId =
            typeof insertedCompany === "object"
              ? insertedCompany.id
              : insertedCompany;
        } else {
          companyId = defaultCompany.id;
        }

        // 2. Insert ke Tabel Users
        const [insertedUser] = await trx("users")
          .insert({
            name: name || "Google User",
            email: email,
            password: "",
            role: "SDM",
            company_id: companyId,
            is_verified: true,
            created_at: new Date(),
          })
          .returning("id");

        const userId =
          typeof insertedUser === "object" ? insertedUser.id : insertedUser;

        // 3. AUTO-CREATE MASTER KARYAWAN UNTUK GOOGLE USER
        const karyawanId = await generateKaryawanId(trx);
        await trx("master_karyawan").insert({
          company_id: companyId,
          KARYAWAN_ID: karyawanId,
          EMAIL: email,
          NIK: karyawanId, // Fallback NIK sementara
          NAMA: name || "Google User",
          GENDER: "L",
          DEPARTEMEN: "DIRECTOR",
          JABATAN: "Owner",
          STATUS_KARYAWAN: "Tetap",
          STATUS_AKTIF: "Aktif",
          FOTO: picture || null, // Menggunakan foto profil bawaan Google
          created_at: new Date(),
        });

        return trx("users").where({ id: userId }).first();
      });
    } else {
      if (!existingUser.is_verified) {
        await db("users").where({ id: existingUser.id }).update({
          is_verified: true,
          verification_token: null,
          token_expires_at: null,
          updated_at: new Date(),
        });
        existingUser.is_verified = true;
      }
    }

    let karyawanId = null;
    let isProfileComplete = false;

    if (!["SUPERADMIN"].includes(existingUser.role)) {
      const karyawan = await db("master_karyawan")
        .whereRaw("LOWER(EMAIL) = ?", [existingUser.email.trim().toLowerCase()])
        .first();

      if (karyawan) {
        karyawanId = karyawan.KARYAWAN_ID;
        // Penanda apakah profil sudah dilengkapi (Punya NIK dan No Telp valid)
        if (
          karyawan.NIK &&
          karyawan.NO_TELP &&
          karyawan.NIK !== karyawan.KARYAWAN_ID
        ) {
          isProfileComplete = true;
        }
      }
    } else {
      isProfileComplete = true;
    }

    const logId = await createActivityLog(existingUser.id);

    const token = await generateToken({
      userId: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
      karyawan_id: karyawanId,
      company_id: existingUser.company_id,
      log_id: logId,
    });

    addLoginHistory({
      userId: existingUser.id,
      action: "LOGIN_REGISTER_GOOGLE",
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "unknown",
    }).catch((err) => console.error("Gagal menyimpan login history:", err));

    return res.status(200).json({
      status: status.SUKSES,
      message: "Login / Register via Google berhasil",
      datetime: datetime(),
      token,
      isProfileComplete, // 👈 Dikirim ke Frontend untuk penanganan Auto Redirect ke Form Profile
      isNewUser,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        karyawan_id: karyawanId,
        log_id: logId,
      },
    });
  } catch (error) {
    console.error("Error Google Login/Register:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Autentikasi Google gagal: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * UPDATE PROFILE & UPLOAD BERKAS (Fixed)
 */
export const updateProfile = async (req, res) => {
  const files = req.files || {};

  // 👈 FIX 1: Cek fallback jika nama field dari FE berupa foto_karyawan / foto / avatar
  const fotoKaryawanFile =
    files.foto_karyawan?.[0] || files.foto?.[0] || files.avatar?.[0] || null;

  const fotoUmkmFiles = files.foto_umkm || [];

  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: status.TIDAK_ADA_TOKEN,
        message: "Token tidak valid atau tidak ditemukan",
        datetime: datetime(),
      });
    }

    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({
        status: status.GAGAL,
        message: "User tidak ditemukan",
        datetime: datetime(),
      });
    }

    const {
      name,
      nik,
      gender,
      tempat_lahir,
      tgl_lahir,
      no_telp,
      alamat,
      pendidikan_terakhir,
      nama_perusahaan,
      no_telp_perusahaan,
      alamat_perusahaan,
    } = req.body;

    // 1. Update nama user di tabel users
    if (name && name.trim() !== "") {
      await db("users").where({ id: userId }).update({
        name: name.trim(),
      });
    }

    // 2. Update Informasi Perusahaan jika dikirim
    if (
      user.company_id &&
      (nama_perusahaan || no_telp_perusahaan || alamat_perusahaan)
    ) {
      const updateCompany = {};
      if (nama_perusahaan) updateCompany.nama_perusahaan = nama_perusahaan;
      if (no_telp_perusahaan) updateCompany.no_telp = no_telp_perusahaan;
      if (alamat_perusahaan) updateCompany.alamat = alamat_perusahaan;

      await db("companies")
        .where({ id: user.company_id })
        .update(updateCompany);
    }

    // 3. Cari data karyawan (Pencarian fleksibel via email atau company_id)
    let karyawan = await db("master_karyawan")
      .whereRaw("LOWER(EMAIL) = ?", [user.email.trim().toLowerCase()])
      .first();

    if (!karyawan && user.company_id) {
      karyawan = await db("master_karyawan")
        .where({ company_id: user.company_id })
        .first();
    }

    // 4. Format Tanggal Lahir
    let formattedTglLahir = null;
    if (tgl_lahir && tgl_lahir !== "null" && tgl_lahir !== "") {
      const parsedDate = new Date(tgl_lahir);
      if (!isNaN(parsedDate.getTime())) {
        formattedTglLahir = parsedDate.toISOString().split("T")[0];
      }
    }

    // 5. Susun Payload Update Karyawan
    const updateDataKaryawan = {};
    if (name) updateDataKaryawan.NAMA = name.trim();
    if (nik) updateDataKaryawan.NIK = nik.trim();
    if (gender) updateDataKaryawan.GENDER = gender;
    if (tempat_lahir !== undefined && tempat_lahir !== "")
      updateDataKaryawan.TEMPAT_LAHIR = tempat_lahir;
    if (formattedTglLahir !== null)
      updateDataKaryawan.TGL_LAHIR = formattedTglLahir;
    if (no_telp !== undefined && no_telp !== "")
      updateDataKaryawan.NO_TELP = no_telp;
    if (alamat !== undefined && alamat !== "")
      updateDataKaryawan.ALAMAT = alamat;
    if (pendidikan_terakhir !== undefined && pendidikan_terakhir !== "")
      updateDataKaryawan.PENDIDIKAN_TERAKHIR = pendidikan_terakhir;

    // 👈 FIX 2: Set Foto Karyawan secara eksplisit
    if (fotoKaryawanFile) {
      updateDataKaryawan.FOTO = `/uploads/foto_karyawan/${fotoKaryawanFile.filename}`;
    }

    // Set Foto UMKM baru jika ada
    if (fotoUmkmFiles.length > 0) {
      const fotoUmkmPaths = fotoUmkmFiles.map(
        (file) => `/uploads/foto_umkm/${file.filename}`,
      );
      updateDataKaryawan.FOTO_KTP = JSON.stringify(fotoUmkmPaths);
    }

    // 6. EKSEKUSI UPDATE / INSERT (UPSERT)
    if (karyawan) {
      await db("master_karyawan")
        .where({ ID: karyawan.ID })
        .update(updateDataKaryawan);
    } else {
      const newKaryawanId = await generateKaryawanId();
      await db("master_karyawan").insert({
        company_id: user.company_id,
        KARYAWAN_ID: newKaryawanId,
        EMAIL: user.email,
        NIK: nik || newKaryawanId,
        NAMA: name || user.name,
        GENDER: gender || "L",
        DEPARTEMEN: "DIRECTOR",
        JABATAN: "Owner",
        STATUS_KARYAWAN: "Tetap",
        STATUS_AKTIF: "Aktif",
        ...updateDataKaryawan,
        created_at: new Date(),
      });
    }

    return res.status(200).json({
      status: status.SUKSES,
      message: "Profil dan berkas berhasil diperbarui",
      datetime: datetime(),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * UBAH PASSWORD (SAAT LOGIN)
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Password lama dan password baru wajib diisi",
        datetime: datetime(),
      });
    }

    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({
        status: status.GAGAL,
        message: "User tidak ditemukan",
        datetime: datetime(),
      });
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Password saat ini salah",
        datetime: datetime(),
      });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await db("users").where({ id: userId }).update({
      password: hashedNewPassword,
      updated_at: new Date(),
    });

    return res.status(200).json({
      status: status.SUKSES,
      message: "Password berhasil diperbarui",
      datetime: datetime(),
    });
  } catch (error) {
    console.error("Error changePassword:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * 1. KIRIM OTP LUPA PASSWORD (STEP 1)
 */
export const forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email wajib diisi",
        datetime: datetime(),
      });
    }

    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({
        status: status.GAGAL,
        message: "Email tidak terdaftar",
        datetime: datetime(),
      });
    }

    const otp = generateOTP(); // 6 Digit OTP
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 Menit

    await db("users").where({ id: user.id }).update({
      verification_token: otp,
      token_expires_at: expiresAt,
      updated_at: new Date(),
    });

    await sendEmailOtp(email, otp, "Kode OTP Reset Password");

    return res.status(200).json({
      status: status.SUKSES,
      message: "Kode OTP reset password telah dikirim ke email Anda",
      datetime: datetime(),
    });
  } catch (error) {
    console.error("Error forgotPasswordSendOtp:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * 2. VERIFIKASI OTP SAJA (STEP 2)
 */
export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email dan Kode OTP wajib diisi",
        datetime: datetime(),
      });
    }

    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({
        status: status.GAGAL,
        message: "User tidak ditemukan",
        datetime: datetime(),
      });
    }

    if (user.verification_token !== otp) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Kode OTP salah",
        datetime: datetime(),
      });
    }

    if (new Date() > new Date(user.token_expires_at)) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Kode OTP telah kedaluwarsa",
        datetime: datetime(),
      });
    }

    return res.status(200).json({
      status: status.SUKSES,
      message: "Kode OTP valid, silakan masukkan password baru Anda",
      datetime: datetime(),
    });
  } catch (error) {
    console.error("Error verifyForgotOtp:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * 3. RESET PASSWORD BARU DENGAN OTP (STEP 3)
 */
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Data tidak lengkap",
        datetime: datetime(),
      });
    }

    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({
        status: status.GAGAL,
        message: "User tidak ditemukan",
        datetime: datetime(),
      });
    }

    if (user.verification_token !== otp) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Kode OTP salah",
        datetime: datetime(),
      });
    }

    if (new Date() > new Date(user.token_expires_at)) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Kode OTP telah kedaluwarsa",
        datetime: datetime(),
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    await db("users").where({ id: user.id }).update({
      password: hashedPassword,
      verification_token: null,
      token_expires_at: null,
      updated_at: new Date(),
    });

    return res.status(200).json({
      status: status.SUKSES,
      message: "Password berhasil diperbarui. Silakan login kembali.",
      datetime: datetime(),
    });
  } catch (error) {
    console.error("Error resetPasswordWithOtp:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * COMPLETE COMPANY PROFILE (Khusus First Time Google User)
 */
export const completeCompanyProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const {
      nama_perusahaan,
      npwp_perusahaan,
      nib,
      no_telp_perusahaan,
      alamat_perusahaan,
    } = req.body;

    if (!nama_perusahaan) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Nama Perusahaan wajib diisi!",
        datetime: datetime(),
      });
    }

    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({
        status: status.GAGAL,
        message: "User tidak ditemukan",
        datetime: datetime(),
      });
    }

    // 1. Buat atau update perusahaan
    let company = await getCompanyByName(nama_perusahaan);
    let companyId;

    if (company) {
      companyId = company.id;
      await db("companies")
        .where({ id: companyId })
        .update({
          npwp: npwp_perusahaan || company.npwp,
          nib: nib || company.nib,
          no_telp: no_telp_perusahaan || company.no_telp,
          alamat: alamat_perusahaan || company.alamat,
        });
    } else {
      const [newCompanyId] = await db("companies").insert({
        nama_perusahaan,
        npwp: npwp_perusahaan || null,
        nib: nib || null,
        no_telp: no_telp_perusahaan || null,
        alamat: alamat_perusahaan || null,
      });
      companyId = newCompanyId;
    }

    // 2. Update company_id di tabel users & master_karyawan
    await db("users").where({ id: userId }).update({ company_id: companyId });
    await db("master_karyawan")
      .whereRaw("LOWER(EMAIL) = ?", [user.email.trim().toLowerCase()])
      .update({ company_id: companyId });

    return res.status(200).json({
      status: status.SUKSES,
      message: "Data perusahaan berhasil dilengkapi!",
      datetime: datetime(),
    });
  } catch (error) {
    console.error("Error completeCompanyProfile:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};
