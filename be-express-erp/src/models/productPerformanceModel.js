import { db } from "../core/config/knex.js";

export const getProductPerformance = (companyId) => {
  return db("detail_faktur_penjualan as d")
    .join("faktur_penjualan as f", "d.ID_FAKTUR", "f.ID_FAKTUR")
    .join("master_nama_produk as p", "d.PRODUK_ID", "p.id")
    .where("f.company_id", companyId) // 🔥 PENTING
    .select(
      "p.id",
      "p.nama_produk_jadi as NAMA_BARANG"
    )
    .sum({
      TOTAL_QTY: "d.QTY",
      TOTAL_SUBTOTAL: "d.SUBTOTAL",
    })
    .groupBy("p.id", "p.nama_produk_jadi")
    .orderBy("TOTAL_SUBTOTAL", "desc");
};