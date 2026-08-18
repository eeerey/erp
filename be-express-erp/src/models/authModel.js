import { db } from "../core/config/knex.js";
import { hashPassword } from "../utils/hash.js";

/**
 * COUNT SUPER ADMIN
 */
export const countSuperAdmin = async () => {
  const result = await db("users")
    .where({ role: "SUPERADMIN" })
    .count("id as total");
  return result[0].total;
};

/**
 * GET USER PROFILE BY ID
 */
export const getUserProfileById = async (userId) => {
  const user = await db("users")
    .where({ id: userId })
    .select(
      "id",
      "name",
      "email",
      "role",
      "company_id",
      "is_verified",
      "created_at",
      "updated_at",
    )
    .first();

  if (!user) return null;

  // 1. Data Perusahaan
  let companyData = null;
  if (user.company_id) {
    companyData = await db("companies")
      .where({ id: user.company_id })
      .select("id", "nama_perusahaan", "alamat", "nib", "npwp", "no_telp")
      .first();
  }

  // 2. Data Karyawan
  const rolesWithKaryawan = [
    "OWNER",
    "HR",
    "SDM",
    "PRODUKSI",
    "GUDANG",
    "KEUANGAN",
  ];

  let karyawanData = null;
  if (rolesWithKaryawan.includes(user.role)) {
    karyawanData = await db("master_karyawan")
      .where("EMAIL", user.email)
      .select(
        "ID",
        "KARYAWAN_ID",
        "EMAIL",
        "NIK",
        "NAMA",
        "GENDER",
        "TEMPAT_LAHIR",
        "TGL_LAHIR",
        "ALAMAT",
        "NO_TELP",
        "DEPARTEMEN",
        "JABATAN",
        "TANGGAL_MASUK",
        "STATUS_KARYAWAN",
        "STATUS_AKTIF",
        "SHIFT",
        "PENDIDIKAN_TERAKHIR",
        "FOTO",
        "FOTO_KTP",
        "NPWP",
        "NIB",
      )
      .first();
  }

  return {
    ...user,
    company: companyData || null,
    karyawan: karyawanData || null,
  };
};

/**
 * BLACKLIST TOKEN
 */
export const blacklistToken = async (token, expiredAt) => {
  return await db("blacklist_tokens").insert({
    token,
    expired_at: expiredAt,
  });
};

/**
 * CHECK EMAIL EXISTS
 */
export const checkEmailExists = async (email) => {
  return await db("users").where({ email }).first();
};

/**
 * CHECK NIK EXISTS
 */
export const checkNikExists = async (nik) => {
  return await db("master_karyawan").where({ NIK: nik }).first();
};

/**
 * GENERATE KARYAWAN_ID OTOMATIS (Mendukung instance Trx)
 */
export const generateKaryawanId = async (trxInstance = null) => {
  const query = trxInstance || db;
  const lastKaryawan = await query("master_karyawan")
    .orderBy("ID", "desc")
    .first();

  if (!lastKaryawan || !lastKaryawan.KARYAWAN_ID) {
    return "KRY-0001";
  }

  const lastNumber = parseInt(
    lastKaryawan.KARYAWAN_ID.split("-")[1] || "0",
    10,
  );
  const newNumber = lastNumber + 1;

  return `KRY-${String(newNumber).padStart(4, "0")}`;
};

/**
 * CREATE KARYAWAN
 */
/**
 * CREATE KARYAWAN
 */
export const createKaryawan = async (
  karyawanData,
  userData,
  verificationData = null, // 👈 Default null jika tidak dikirim
) => {
  const hashedPassword = await hashPassword(userData.password);

  return await db.transaction(async (trx) => {
    // 1. Generate KARYAWAN_ID di dalam transaksi
    const karyawanId = await generateKaryawanId(trx);

    // Tentukan apakah user langsung terverifikasi atau butuh OTP
    // Jika verificationData dikirim (misal pas Register Publik/Owner) -> false
    // Jika verificationData null (misal Tambah Karyawan via Dashboard/Admin) -> true
    const isVerified =
      userData.is_verified ?? (verificationData ? false : true);

    // 2. Insert ke tabel 'users'
    const [userId] = await trx("users").insert({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      company_id: userData.company_id,
      is_verified: isVerified, // 👈 Langsung TRUE jika dari Tambah Karyawan
      verification_token: verificationData?.token || null,
      token_expires_at: verificationData?.expiresAt || null,
      created_at: new Date(),
    });

    // 3. Insert ke tabel 'master_karyawan'
    const [id] = await trx("master_karyawan").insert({
      company_id: userData.company_id,
      KARYAWAN_ID: karyawanId,
      EMAIL: karyawanData.EMAIL,
      NIK: karyawanData.NIK,
      NAMA: karyawanData.NAMA,
      GENDER: karyawanData.GENDER,
      TEMPAT_LAHIR: karyawanData.TEMPAT_LAHIR || null,
      TGL_LAHIR: karyawanData.TGL_LAHIR || null,
      ALAMAT: karyawanData.ALAMAT || null,
      NO_TELP: karyawanData.NO_TELP || null,
      DEPARTEMEN: karyawanData.DEPARTEMEN,
      JABATAN: karyawanData.JABATAN,
      TANGGAL_MASUK: karyawanData.TANGGAL_MASUK || new Date(),
      STATUS_KARYAWAN: karyawanData.STATUS_KARYAWAN || "Tetap",
      STATUS_AKTIF: karyawanData.STATUS_AKTIF || "Aktif",
      SHIFT: karyawanData.SHIFT || null,
      PENDIDIKAN_TERAKHIR: karyawanData.PENDIDIKAN_TERAKHIR || null,
      FOTO: karyawanData.FOTO || null,
      NPWP: karyawanData.NPWP || null,
      NIB: karyawanData.NIB || null,
      FOTO_KTP: karyawanData.FOTO_KTP || null,
      created_at: new Date(),
    });

    return { userId, karyawanId, id };
  });
};

/**
 * VERIFY USER EMAIL
 */
export const verifyUserEmail = async (token) => {
  const user = await db("users").where({ verification_token: token }).first();

  if (!user) {
    return { success: false, message: "Token verifikasi tidak ditemukan." };
  }

  // Pengecekan expired aman
  const now = new Date().getTime();
  const expiresAt = new Date(user.token_expires_at).getTime();

  if (now > expiresAt) {
    return { success: false, message: "Token verifikasi sudah kedaluwarsa!" };
  }

  await db("users").where({ id: user.id }).update({
    is_verified: true,
    verification_token: null,
    token_expires_at: null,
    updated_at: new Date(),
  });

  return { success: true, message: "Email berhasil diverifikasi!" };
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

    // 1. Cek Duplikasi Email & NIK
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

    // 2. Buat / Ambil Perusahaan
    let company = await getCompanyByName(nama_perusahaan);
    if (!company) {
      company = await createCompany(nama_perusahaan);
    }
    const companyId = company.id;

    // Update detail profil perusahaan jika ada data tambahan
    if (npwp_perusahaan || nib || alamat_perusahaan || no_telp_perusahaan) {
      await db("companies")
        .where({ id: companyId })
        .update({
          npwp: npwp_perusahaan || null,
          nib: nib || null,
          alamat: alamat_perusahaan || null,
          no_telp: no_telp_perusahaan || null,
          updated_at: new Date(),
        });
    }

    // 3. Generate OTP & Token Expiry
    const otpCode = generateOTP();
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // 4. Panggil `createKaryawan` untuk generate KARYAWAN_ID + insert User (Role SDM) & Master Karyawan
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
        role: "SDM", // 👈 Role di tabel users diisi sebagai SDM
        company_id: companyId,
      },
      {
        token: otpCode,
        expiresAt: tokenExpiresAt,
      },
    );

    // 5. Kirim Email Verifikasi OTP
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

    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};
