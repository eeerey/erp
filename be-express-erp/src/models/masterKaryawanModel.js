// models/karyawanModel.js
import { db } from "../core/config/knex.js";
console.log("MASTER KARYAWAN MODEL LOADED");
/**
 * 🔹 Ambil semua karyawan + data user
 */
export const getAllKaryawanWithUser = async (companyId) => {
  try {
    console.log("MASUK MODEL");
    console.log("companyId =", companyId);

    const data = await db("master_karyawan as k")
      .leftJoin("users as u", "k.EMAIL", "u.email")
      .where("k.company_id", companyId)
      .select(
        "k.ID",
        "k.KARYAWAN_ID",
        "k.EMAIL",
        "k.NIK",
        "k.NAMA",
        "k.GENDER",
        "k.TEMPAT_LAHIR",
        "k.TGL_LAHIR",
        "k.ALAMAT",
        "k.NO_TELP",
        "k.DEPARTEMEN",
        "k.JABATAN",
        "k.TANGGAL_MASUK",
        "k.STATUS_KARYAWAN",
        "k.STATUS_AKTIF",
        "k.SHIFT",
        "k.PENDIDIKAN_TERAKHIR",
        "k.FOTO",
        "k.created_at",
        "k.updated_at",
        "u.name as user_name",
        "u.role as user_role"
      )
      .orderBy("k.created_at", "desc");

    console.log("MODEL DATA =", data);

    return data;
  } catch (err) {
    console.error("MODEL ERROR =", err);
    throw err;
  }
};
/**
 * 🔹 Ambil karyawan by ID + data user
 */
export const getKaryawanByIdWithUser = async (id, companyId) => {
  return db("master_karyawan as k")
    .leftJoin("users as u", "k.EMAIL", "u.email")
    .where("k.company_id", companyId)
    .select(
      "k.ID",
      "k.KARYAWAN_ID",
      "k.EMAIL",
      "k.NIK",
      "k.NAMA",
      "k.GENDER",
      "k.TEMPAT_LAHIR",
      "k.TGL_LAHIR",
      "k.ALAMAT",
      "k.NO_TELP",
      "k.DEPARTEMEN",
      "k.JABATAN",
      "k.TANGGAL_MASUK",
      "k.STATUS_KARYAWAN",
      "k.STATUS_AKTIF",
      "k.SHIFT",
      "k.PENDIDIKAN_TERAKHIR",
      "k.FOTO",
      "k.created_at",
      "k.updated_at",
      "u.name as user_name",
      "u.role as user_role"
    )
    .where("k.ID", id)
    .first();
};

/**
 * 🔹 Ambil karyawan by KARYAWAN_ID (KRY-0001)
 */
export const getKaryawanByKaryawanId = async (karyawanId, companyId) => {
  return db("master_karyawan as k")
    .leftJoin("users as u", "k.EMAIL", "u.email")
    .select(
      "k.ID",
      "k.KARYAWAN_ID",
      "k.EMAIL",
      "k.NIK",
      "k.NAMA",
      "k.GENDER",
      "k.TEMPAT_LAHIR",
      "k.TGL_LAHIR",
      "k.ALAMAT",
      "k.NO_TELP",
      "k.DEPARTEMEN",
      "k.JABATAN",
      "k.TANGGAL_MASUK",
      "k.STATUS_KARYAWAN",
      "k.STATUS_AKTIF",
      "k.SHIFT",
      "k.PENDIDIKAN_TERAKHIR",
      "k.FOTO",
      "k.created_at",
      "k.updated_at",
      "u.name as user_name",
      "u.role as user_role"
    )
    .where("k.company_id", companyId)
    .andWhere("k.KARYAWAN_ID", karyawanId)
    .first();
};

/**
 * 🔹 Ambil karyawan by EMAIL
 */
export const getKaryawanByEmail = async (email, companyId) => {
  return db("master_karyawan as k")
    .leftJoin("users as u", "k.EMAIL", "u.email")
    .select(
      "k.ID",
      "k.KARYAWAN_ID",
      "k.EMAIL",
      "k.NIK",
      "k.NAMA",
      "k.DEPARTEMEN",
      "k.JABATAN",
      "k.STATUS_AKTIF",
      "u.role as user_role"
    )
    .where("k.company_id", companyId)
    .andWhere("k.EMAIL", email)
    .first();
};

/**
 * 🔹 Ambil karyawan berdasarkan DEPARTEMEN
 */
export const getKaryawanByDepartemen = async (departemen, companyId) => {
  return db("master_karyawan as k")
    .leftJoin("users as u", "k.EMAIL", "u.email")
    .select(
      "k.ID",
      "k.KARYAWAN_ID",
      "k.NIK",
      "k.NAMA",
      "k.EMAIL",
      "k.DEPARTEMEN",
      "k.JABATAN",
      "k.STATUS_AKTIF",
      "u.role as user_role"
    )
    .where("k.company_id", companyId)
    .andWhere("k.DEPARTEMEN", departemen)
    .andWhere("k.STATUS_AKTIF", "Aktif")
    .orderBy("k.NAMA", "asc");
};

/**
 * 🔹 Ambil karyawan berdasarkan JABATAN
 */
export const getKaryawanByJabatan = async (jabatan, companyId) => {
  return db("master_karyawan as k")
    .leftJoin("users as u", "k.EMAIL", "u.email")
    .select(
      "k.ID",
      "k.KARYAWAN_ID",
      "k.NIK",
      "k.NAMA",
      "k.EMAIL",
      "k.DEPARTEMEN",
      "k.JABATAN",
      "k.STATUS_AKTIF",
      "u.role as user_role"
    )
    .where("k.company_id", companyId)
    .andWhere("k.JABATAN", jabatan)
    .andWhere("k.STATUS_AKTIF", "Aktif")
    .orderBy("k.NAMA", "asc");
};

/**
 * 🔹 Update data karyawan
 */
export const updateKaryawan = async (id, companyId, data) => {
  await db("master_karyawan")
    .where("ID", id)
    .andWhere("company_id", companyId) // 🔒 WAJIB
    .update({
      ...data,
      updated_at: db.fn.now(),
    });

  return getKaryawanByIdWithUser(id, companyId);
};

/**
 * 🔹 Hapus karyawan + user-nya
 */
export const deleteKaryawan = async (id, companyId) => {
  const karyawan = await db("master_karyawan")
    .where({ ID: id, company_id: companyId })
    .first();

  if (!karyawan) throw new Error("Karyawan tidak ditemukan");

  await db("users")
    .where("email", karyawan.EMAIL)
    .del();

  await db("master_karyawan")
    .where({ ID: id, company_id: companyId })
    .del();

  return karyawan;
};

/**
 * 🔹 Check apakah NIK sudah digunakan (untuk validasi update)
 */
export const checkNikExistsExclude = async (nik, excludeId, companyId) => {
  const result = await db("master_karyawan")
    .where("company_id", companyId)
    .andWhere("NIK", nik)
    .andWhere("ID", "!=", excludeId)
    .first();

  return !!result;
};

/**
 * 🔹 Check apakah EMAIL sudah digunakan (untuk validasi update)
 */
export const checkEmailExistsExclude = async (email, excludeId, companyId) => {
  const result = await db("master_karyawan")
    .where("company_id", companyId)
    .andWhere("EMAIL", email)
    .andWhere("ID", "!=", excludeId)
    .first();

  return !!result;
};