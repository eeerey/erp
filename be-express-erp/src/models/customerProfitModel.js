import { db } from "../core/config/knex.js";

export const getCustomerProfit = async (companyId) => {
  return await db("master_customer as c")
    .join("faktur_penjualan as f", "c.ID_CUSTOMER", "f.ID_CUSTOMER")
    .where("f.company_id", companyId)
    .select(
      "c.ID_CUSTOMER",
      "c.KODE_CUSTOMER",
      "c.NAMA_CUSTOMER"
    )
    .countDistinct({
      JUMLAH_TRANSAKSI: "f.ID_FAKTUR",
    })
    .sum({
      TOTAL_SUBTOTAL: "f.TOTAL_PENJUALAN",
    })
    .groupBy(
      "c.ID_CUSTOMER",
      "c.KODE_CUSTOMER",
      "c.NAMA_CUSTOMER"
    )
    .orderBy("TOTAL_SUBTOTAL", "desc");
};