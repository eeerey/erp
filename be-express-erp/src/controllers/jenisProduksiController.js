import * as ProduksiModel from "../models/jenisProduksiModel.js";

// GET
export const getProduksi = async (req, res) => {
  try {
    const data = await ProduksiModel.getAllJenisProduksi();
    res.json({ status: "00", data });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};

// CREATE
export const createProduksi = async (req, res) => {
  try {
    await ProduksiModel.createJenisProduksi(req.body);
    res.json({ status: "00", message: "Berhasil tambah data" });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};

// UPDATE
export const updateProduksi = async (req, res) => {
  try {
    await ProduksiModel.updateJenisProduksi(req.params.id, req.body);
    res.json({ status: "00", message: "Berhasil update" });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};

// DELETE
export const deleteProduksi = async (req, res) => {
  try {
    await ProduksiModel.deleteJenisProduksi(req.params.id);
    res.json({ status: "00", message: "Berhasil hapus" });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};