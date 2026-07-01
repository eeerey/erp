import { db } from "../core/config/knex.js";

export const getLabaBarang = async () => {
  return db("master_barang")
    .select(
      "BARANG_KODE",
      "NAMA_BARANG",
      "HARGA_BELI_TERAKHIR",
      "HARGA_JUAL"
    )
    .select(
      db.raw(`
        (HARGA_JUAL - HARGA_BELI_TERAKHIR)
        AS laba_per_unit
      `)
    )
    .orderBy("BARANG_KODE", "asc");
};