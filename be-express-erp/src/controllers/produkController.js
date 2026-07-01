import { db } from "../core/config/knex.js";

export const getMasterNamaProduk = async (req, res) => {
  try {
    const data = await db("master_nama_produk");

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};