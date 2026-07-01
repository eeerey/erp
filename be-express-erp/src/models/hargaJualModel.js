import { db } from "../core/config/knex.js";

/**
 * Get semua harga jual
 */
export const getAllHargaJual = async (companyId) => {
  return db("hpp as h")
    .leftJoin("master_nama_produk as mp", "mp.id", "h.produk_id")
    .leftJoin("harga_jual as hj", function () {
      this.on("hj.produk_id", "=", "h.produk_id")
          .andOn("hj.company_id", "=", "h.company_id");
    })
    .where("h.company_id", companyId)
    .select(
      "h.produk_id",
      "mp.nama_produk_jadi",
      "h.hpp_per_pcs",
      "hj.margin",
      "hj.harga_jual"
    )
    .orderBy("mp.nama_produk_jadi", "asc");
};
/**
 * Check existing
 */
export const checkHargaJualExist =
  async (produkId, companyId) => {
    return db("harga_jual")
      .where(
        "produk_id",
        produkId
      )
      .first();
  };

/**
 * Insert
 */
export const createHargaJual =
  async (data) => {
    const [id] = await db(
      "harga_jual"
    ).insert(data);

    return db("harga_jual")
      .where("id", id)
      .first();
  };

/**
 * Update
 */
export const updateHargaJual =
  async (
    produkId,
    margin,
    hargaJual
  ) => {
    await db("harga_jual")
     .where({
  produk_id: produkId,
  company_id: companyId,
})
      .update({
        margin,
        harga_jual: hargaJual,
        updated_at:
          db.fn.now(),
      });

    return db("harga_jual")
      .where({
      produk_id: produkId,
      company_id: companyId,
    })
      .first();
  };