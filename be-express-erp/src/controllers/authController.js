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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const removeUploadedFiles = async (...filePaths) => {
  for (const filePath of filePaths) {
    if (filePath) {
      try {
        const absolutePath = path.join(process.cwd(), filePath);
        await fs.unlink(absolutePath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error(
            `Gagal menghapus orphan file (${filePath}):`,
            err.message,
          );
        }
      }
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

    const otpCode = generateOTP();
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
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
          // SUPERADMIN otomatis terverifikasi
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
        return res.status(201).json({
          status: status.SUKSES,
          message:
            "User berhasil didaftarkan, namun gagal mengirim OTP. Silakan resend OTP.",
          datetime: datetime(),
          otp_dev: otpCode,
        });
      }
    }

    return res.status(201).json({
      status: status.SUKSES,
      message: isSuperAdminRole
        ? "Super Admin berhasil didaftarkan dan dapat langsung login."
        : "User berhasil didaftarkan. Silakan periksa email Anda untuk kode OTP verifikasi.",
      datetime: datetime(),
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
 * LOGIN
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

    // 👈 SUPERADMIN bypass verifikasi OTP
    if (existingUser.role !== "SUPERADMIN" && !existingUser.is_verified) {
      return res.status(403).json({
        status: status.GAGAL,
        message: "Akun Anda belum diverifikasi. Masukkan kode OTP verifikasi.",
        datetime: datetime(),
      });
    }

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

    let karyawanId = null;
    if (!["SUPERADMIN"].includes(existingUser.role)) {
      const karyawan = await db("master_karyawan")
        .where("EMAIL", existingUser.email)
        .select("KARYAWAN_ID")
        .first();

      if (karyawan) karyawanId = karyawan.KARYAWAN_ID;
    }

    // 👈 1. Buat record activity log
    const logId = await createActivityLog(existingUser.id);

    // 👈 2. Masukkan log_id ke payload JWT
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
 * GET PROFILE & LOGOUT
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
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

export const logout = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const userId = req.user?.userId;
    const logId = req.user?.log_id; // 👈 Ambil log_id dari decoded JWT Token

    if (!token || !userId) {
      return res.status(401).json({
        status: status.TIDAK_ADA_TOKEN,
        message: "Token tidak valid atau tidak ditemukan",
        datetime: datetime(),
      });
    }

    // 👈 Update logout_at & duration_seconds di database
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
      nama_perusahaan,
      npwp_perusahaan,
      nib,
      alamat_perusahaan,
      no_telp_perusahaan,
      npwp,
    } = req.body;

    if (await checkEmailExists(email)) {
      await removeUploadedFiles(fotoPath, fotoKtpPath);
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email sudah terdaftar",
        datetime: datetime(),
      });
    }

    if (await checkNikExists(nik)) {
      await removeUploadedFiles(fotoPath, fotoKtpPath);
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

    const { userId, karyawanId, id } = await createKaryawan(
      {
        EMAIL: email,
        NIK: nik,
        NAMA: nama,
        GENDER: gender,
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
        FOTO_KTP: fotoKtpPath,
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
      data: { companyId, karyawanId, userId, id },
      otp_dev: otpCode,
    });
  } catch (error) {
    await removeUploadedFiles(fotoPath, fotoKtpPath);
    console.error("Register Owner Error:", error);

    if (error.message === "EMAIL_EXISTS") {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email sudah terdaftar",
        datetime: datetime(),
      });
    }
    if (error.message === "NIK_EXISTS") {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "NIK sudah terdaftar",
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
    const { email, name } = payload;

    let existingUser = await getUserByEmail(email);

    if (!existingUser) {
      existingUser = await db.transaction(async (trx) => {
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

        return trx("users").where({ id: userId }).first();
      });
    } else {
      if (!existingUser.is_verified) {
        await db("users").where({ id: existingUser.id }).update({
          is_verified: true,
          updated_at: new Date(),
        });
        existingUser.is_verified = true;
      }
    }

    let karyawanId = null;
    if (!["SUPERADMIN"].includes(existingUser.role)) {
      const karyawan = await db("master_karyawan")
        .where("EMAIL", existingUser.email)
        .select("KARYAWAN_ID")
        .first();

      if (karyawan) karyawanId = karyawan.KARYAWAN_ID;
    }

    // 👈 1. Buat activity log
    const logId = await createActivityLog(existingUser.id);

    // 👈 2. Generate Token dengan log_id
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
