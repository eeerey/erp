import * as ProdukHppModel from "../models/produkHppModel.js";

export const getProdukHpp = async (req, res) => {
  try {
    const data =
      await ProdukHppModel.getProdukHpp();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};