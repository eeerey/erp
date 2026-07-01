import { db } from "../core/config/knex.js";

export const getLabaErp = async (companyId) => {
  // ============================
  // TOTAL PENJUALAN
  // ============================
  const penjualan = await db("detail_faktur_penjualan as d")
    .join(
      "faktur_penjualan as f",
      "d.ID_FAKTUR",
      "f.ID_FAKTUR"
    )
    .where("f.company_id", companyId)
    .sum({
      total_penjualan: "d.SUBTOTAL",
    })
    .first();

  // ============================
  // TOTAL HPP
  // ============================
  const hpp = await db("hpp")
    .where("company_id", companyId)
    .sum({
      total_hpp: "total_hpp",
    })
    .first();

  // ============================
  // TOTAL GAJI
  // ============================
  const payroll = await db("master_payroll")
    .where("company_id", companyId)
    .sum({
      total_gaji: "take_home_pay",
    })
    .first();

  const totalPenjualan = Number(
    penjualan?.total_penjualan || 0
  );

  const totalHpp = Number(
    hpp?.total_hpp || 0
  );

  const totalGaji = Number(
    payroll?.total_gaji || 0
  );

  const labaKotor =
    totalPenjualan - totalHpp;

  const labaOperasional =
    labaKotor - totalGaji;

  return {
    total_penjualan: totalPenjualan,
    total_hpp: totalHpp,
    laba_kotor: labaKotor,
    beban_gaji: totalGaji,
    laba_operasional: labaOperasional,
  };
};