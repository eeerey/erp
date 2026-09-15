import * as HargaJualModel from "../models/hargaJualModel.js";
import { datetime, status } from "../utils/general.js";

/**
 * GET ALL HARGA JUAL
 */
export const getAllHargaJual = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const data = await HargaJualModel.getAllHargaJual(companyId);

    const result = data.map((item) => {
      const hpp = Number(item.hpp_per_pcs) || 0;
      const margin = Number(item.margin) || 100;
      const hargaJual = item.harga_jual
        ? Number(item.harga_jual)
        : hpp + (hpp * margin) / 100;

      return {
        ...item,
        hpp_per_pcs: hpp,
        margin: margin,
        harga_jual: hargaJual,
      };
    });

    return res.status(200).json({
      status: status.SUKSES,
      message: "Data harga jual berhasil diambil",
      datetime: datetime(),
      total: result.length,
      data: result,
    });
  } catch (err) {
    console.error("Error getAllHargaJual:", err);

    return res.status(500).json({
      status: status.GAGAL,
      message: err.message,
      datetime: datetime(),
    });
  }
};

/**
 * SAVE HARGA JUAL
 */
export const saveHargaJual = async (req, res) => {
  const companyId = req.user.company_id;

  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Data harus berupa array",
        datetime: datetime(),
      });
    }

    for (const item of data) {
      if (!item.produk_id) {
        continue;
      }

      const margin = Number(item.margin) || 0;
      const hpp = Number(item.hpp_per_pcs) || 0;

      if (margin < 100) {
        return res.status(400).json({
          status: status.BAD_REQUEST,
          message: `Margin produk ${item.produk_id} minimal 100%`,
          datetime: datetime(),
        });
      }

      const hargaJual = hpp + (hpp * margin) / 100;

      const existing = await HargaJualModel.checkHargaJualExist(
        item.produk_id,
        companyId,
      );

      if (existing) {
        await HargaJualModel.updateHargaJual(
          item.produk_id,
          companyId,
          margin,
          hargaJual,
        );
      } else {
        await HargaJualModel.createHargaJual({
          produk_id: item.produk_id,
          margin: margin,
          harga_jual: hargaJual,
          company_id: companyId,
        });
      }
    }

    return res.status(200).json({
      status: status.SUKSES,
      message: "Harga jual berhasil disimpan",
      datetime: datetime(),
    });
  } catch (err) {
    console.error("Error saveHargaJual:", err);

    return res.status(500).json({
      status: status.GAGAL,
      message: err.message,
      datetime: datetime(),
    });
  }
};
