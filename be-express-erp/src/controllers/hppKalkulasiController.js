import * as HppKalkulasiModel from "../models/hppKalkulasiModel.js";

// ======================================================
// GET MASTER BARANG
// ======================================================
export const getMasterBarang = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const data = await HppKalkulasiModel.getMasterBarang(companyId);

    return res.json({
      status: "00",
      data,
    });
  } catch (error) {
    console.error("GET MASTER BARANG HPP ERROR:", error);

    return res.status(500).json({
      status: "99",
      message: "Gagal mengambil master barang",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL
// ======================================================
export const getAll = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const data = await HppKalkulasiModel.getAll(companyId);

    return res.json({
      status: "00",
      data,
    });
  } catch (error) {
    console.error("GET HPP KALKULASI ERROR:", error);

    return res.status(500).json({
      status: "99",
      error: error.message,
    });
  }
};

// ======================================================
// GET DETAIL
// ======================================================
export const getById = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const { id } = req.params;

    const data = await HppKalkulasiModel.getById(id, companyId);

    if (!data) {
      return res.status(404).json({
        status: "01",
        message: "Data HPP tidak ditemukan",
      });
    }

    return res.json({
      status: "00",
      data,
    });
  } catch (error) {
    console.error("GET DETAIL HPP ERROR:", error);

    return res.status(500).json({
      status: "99",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE
// ======================================================
export const create = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const result = await HppKalkulasiModel.create({
      ...req.body,
      companyId,
    });

    return res.status(201).json({
      status: "00",
      message: "HPP kalkulasi berhasil dibuat",
      data: result,
    });
  } catch (error) {
    console.error("CREATE HPP KALKULASI ERROR:", error);

    return res.status(400).json({
      status: "99",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE
// ======================================================
export const update = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const { id } = req.params;

    const result = await HppKalkulasiModel.update({
      ...req.body,

      id,

      companyId,
    });

    return res.json({
      status: "00",
      message: "HPP kalkulasi berhasil diupdate",
      data: result,
    });
  } catch (error) {
    console.error("UPDATE HPP KALKULASI ERROR:", error);

    return res.status(400).json({
      status: "99",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE
// ======================================================
export const remove = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const { id } = req.params;

    const result = await HppKalkulasiModel.remove(id, companyId);

    if (!result) {
      return res.status(404).json({
        status: "01",
        message: "Data HPP tidak ditemukan",
      });
    }

    return res.json({
      status: "00",
      message: "HPP kalkulasi berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE HPP KALKULASI ERROR:", error);

    return res.status(500).json({
      status: "99",
      error: error.message,
    });
  }
};
