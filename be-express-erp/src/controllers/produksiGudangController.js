import * as ProduksiModel from "../models/jenisProduksiModel.js";

export const getProduksiGudang = async (req, res) => {
  try {
    const data = await ProduksiModel.getProduksiGudang();

    return res.status(200).json({
      status: "00",
      data,
    });

  } catch (error) {
    console.error("ERROR PRODUKSI GUDANG:", error);

    return res.status(500).json({
      status: "99",
      message: error.message,
    });
  }
};