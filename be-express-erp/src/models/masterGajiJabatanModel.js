// models/masterGajiJabatanModel.js
import { db } from "../core/config/knex.js";

// ─────────────────────────────────────────────────────────────
// GET ALL
// ─────────────────────────────────────────────────────────────
export const getAll = async (companyId, status = null) => {
  let q = db("master_gaji_jabatan")
    .where("company_id", companyId)
    .orderBy("JABATAN", "asc");

  if (status) {
    q.where("STATUS", status);
  }

  return q;
};

// ─────────────────────────────────────────────────────────────
// GET BY ID
// ─────────────────────────────────────────────────────────────
export const getById = async (companyId, id) => {
  return db("master_gaji_jabatan").where("ID", id).where("company_id", companyId).first();
};

// ─────────────────────────────────────────────────────────────
// GET BY JABATAN + DEPARTEMEN
// ─────────────────────────────────────────────────────────────
export const getByJabatan = async (
  companyId,
  jabatan,
  departemen = null
) => {
  let q = db("master_gaji_jabatan")
    .where("company_id", companyId)
    .where("JABATAN", jabatan)
    .where("STATUS", "Aktif");

  if (departemen) {
    q.where("DEPARTEMEN", departemen);
  }

  return q.first();
};

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────
export const create = async (payload, companyId) => {
  const [id] = await db("master_gaji_jabatan").insert({
    company_id: companyId,
    JABATAN                     : payload.JABATAN,
    DEPARTEMEN                  : payload.DEPARTEMEN || null,
    GAJI_POKOK                  : payload.GAJI_POKOK || 0,
    TUNJANGAN_TRANSPORT         : payload.TUNJANGAN_TRANSPORT || 0,
    TUNJANGAN_MAKAN             : payload.TUNJANGAN_MAKAN || 0,
    TUNJANGAN_JABATAN           : payload.TUNJANGAN_JABATAN || 0,
    TUNJANGAN_LAINNYA           : payload.TUNJANGAN_LAINNYA || 0,
    POTONGAN_TERLAMBAT_PER_MENIT: payload.POTONGAN_TERLAMBAT_PER_MENIT ?? 500,
    POTONGAN_ALPA_PER_HARI      : payload.POTONGAN_ALPA_PER_HARI || 0,
    BPJS_KESEHATAN_PERSEN       : payload.BPJS_KESEHATAN_PERSEN ?? 1.00,
    BPJS_TK_PERSEN              : payload.BPJS_TK_PERSEN ?? 2.00,
    IS_KENA_PPH21               : payload.IS_KENA_PPH21 ? 1 : 0,
    BONUS_SCORE_90              : payload.BONUS_SCORE_90 ?? 15.00,
    BONUS_SCORE_75              : payload.BONUS_SCORE_75 ?? 10.00,
    BONUS_SCORE_60              : payload.BONUS_SCORE_60 ?? 5.00,
    STATUS                      : payload.STATUS || "Aktif",
  });
  return getById(companyId, id);
};

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────
export const update = async (id, payload, companyId) => {
  await db("master_gaji_jabatan").where("ID", id).where("company_id", companyId).update({
       company_id: companyId,
    JABATAN                     : payload.JABATAN,
    DEPARTEMEN                  : payload.DEPARTEMEN || null,
    GAJI_POKOK                  : payload.GAJI_POKOK,
    TUNJANGAN_TRANSPORT         : payload.TUNJANGAN_TRANSPORT,
    TUNJANGAN_MAKAN             : payload.TUNJANGAN_MAKAN,
    TUNJANGAN_JABATAN           : payload.TUNJANGAN_JABATAN,
    TUNJANGAN_LAINNYA           : payload.TUNJANGAN_LAINNYA,
    POTONGAN_TERLAMBAT_PER_MENIT: payload.POTONGAN_TERLAMBAT_PER_MENIT,
    POTONGAN_ALPA_PER_HARI      : payload.POTONGAN_ALPA_PER_HARI,
    BPJS_KESEHATAN_PERSEN       : payload.BPJS_KESEHATAN_PERSEN,
    BPJS_TK_PERSEN              : payload.BPJS_TK_PERSEN,
    IS_KENA_PPH21               : payload.IS_KENA_PPH21 ? 1 : 0,
    BONUS_SCORE_90              : payload.BONUS_SCORE_90,
    BONUS_SCORE_75              : payload.BONUS_SCORE_75,
    BONUS_SCORE_60              : payload.BONUS_SCORE_60,
    STATUS                      : payload.STATUS,
    updated_at                  : db.fn.now(),
  });
  return getById(companyId, id);
};

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────
export const remove = async (id, companyId) => {
  return db("master_gaji_jabatan").where("ID", id).where("company_id", companyId).delete();
};

// ─────────────────────────────────────────────────────────────
// GET DISTINCT JABATAN dari master_karyawan (untuk dropdown)
// ─────────────────────────────────────────────────────────────
export const getDistinctJabatan = async (companyId) => {
  return db("master_karyawan")
    .where("company_id", companyId)
    .distinct("JABATAN", "DEPARTEMEN")
    .whereNotNull("JABATAN")
    .orderBy("DEPARTEMEN", "asc")
    .orderBy("JABATAN", "asc");
};