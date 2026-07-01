import { db } from "../core/config/knex.js";

export const getAllJenisProduksi = () => {
  return db("jenis_produksi").select("*");
};

export const getJenisProduksiById = (id) => {
  return db("jenis_produksi").where({ ID: id }).first();
};

export const createJenisProduksi = (data) => {
  return db("jenis_produksi").insert(data);
};

export const updateJenisProduksi = (id, data) => {
  return db("jenis_produksi").where({ ID: id }).update(data);
};

export const deleteJenisProduksi = (id) => {
  return db("jenis_produksi").where({ ID: id }).del();
};

// 🔥 TAMBAHAN UNTUK GUDANG
export const getProduksiGudang = () => {
  return db("jenis_produksi")
    .select("*")
    .where("TUJUAN", "gudang");
};

export const getTotalProduksiGudang = async () => {
  const result = await db("jenis_produksi")
    .where("TUJUAN", "gudang")
    .sum("HASIL as total");

  return result[0].total || 0;
};