import { db } from "../core/config/knex.js";

export const getAllBarang = async (companyId) => {
  return db("master_barang as mb")
    .select("mb.*", "mj.NAMA_JENIS", "ms.NAMA_SATUAN")
    .leftJoin("master_jenis_barang as mj", "mb.JENIS_ID", "mj.ID")
    .leftJoin("master_satuan_barang as ms", "mb.SATUAN_ID", "ms.ID")
    .where("mb.company_id", companyId)
    .orderBy("mb.BARANG_KODE", "asc");
};

export const getBarangById = async (ID, companyId) => {
  return db("master_barang as mb")
    .select("mb.*", "mj.NAMA_JENIS", "ms.NAMA_SATUAN")
    .leftJoin("master_jenis_barang as mj", "mb.JENIS_ID", "mj.ID")
    .leftJoin("master_satuan_barang as ms", "mb.SATUAN_ID", "ms.ID")
    .where("mb.ID", ID, "mb.company_id", companyId,)
    .first();
};

export const createBarang = async (data) => {
  const [ID] = await db("master_barang").insert({
    ...data,
    created_at: db.fn.now(),
    updated_at: db.fn.now(),
  });
  return getBarangById(ID, data.company_id);
};

export const updateBarang = async (ID, companyId, data) => {
  await db("master_barang").where({ ID, company_id: companyId, }).update({
    ...data,
    updated_at: db.fn.now(),
  });
  return getBarangById(ID, companyId);
};

export const deleteBarang = async (ID, companyId) => {
  return db("master_barang").where({ ID, company_id: companyId }).del();
};