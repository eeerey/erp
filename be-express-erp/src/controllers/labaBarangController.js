import * as LabaBarangModel from "../models/labaBarangModel.js";

export const getLabaBarang = async (req, res) => {
  try {
    const data = await LabaBarangModel.getLabaBarang();

    res.json({
      status: "00",
      data,
    });
  } catch (err) {
    console.error("LABA BARANG ERROR:", err);

    res.status(500).json({
      status: "99",
      error: err.message,
    });
  }
};