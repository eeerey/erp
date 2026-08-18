import { db } from "../core/config/knex.js";

// ==============================
// GET ALL
// ==============================
export const getAllJenisProduksi = (companyId) => {
  return db("jenis_produksi")
    .where("company_id", companyId)
    .orderBy("ID", "desc");
};

// ==============================
// GET BY ID
// ==============================
export const getJenisProduksiById = (id, companyId) => {
  return db("jenis_produksi")
    .where({
      ID: id,
      company_id: companyId,
    })
    .first();
};

// ==============================
// CREATE
// ==============================
export const createJenisProduksi = (data) => {
  return db("jenis_produksi").insert({
    ...data,
    created_at: db.fn.now(),
    updated_at: db.fn.now(),
  });
};

// ==============================
// UPDATE
// ==============================
export const updateJenisProduksi = (id, companyId, data) => {
  return db("jenis_produksi")
    .where({
      ID: id,
      company_id: companyId,
    })
    .update({
      ...data,
      updated_at: db.fn.now(),
    });
};

// ==============================
// DELETE
// ==============================
export const deleteJenisProduksi = (id, companyId) => {
  return db("jenis_produksi")
    .where({
      ID: id,
      company_id: companyId,
    })
    .del();
};

// ==============================
// PRODUKSI GUDANG
// ==============================
export const getProduksiGudang = (companyId) => {
  return db("jenis_produksi")
    .where({
      TUJUAN: "gudang",
      company_id: companyId,
    })
    .orderBy("ID", "desc");
};

// ==============================
// TOTAL PRODUKSI GUDANG
// ==============================
export const getTotalProduksiGudang = async (companyId) => {
  const result = await db("jenis_produksi")
    .where({
      TUJUAN: "gudang",
      company_id: companyId,
    })
    .sum("HASIL as total");

  return Number(result[0]?.total || 0);
};