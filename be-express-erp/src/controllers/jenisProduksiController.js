import * as ProduksiModel from "../models/jenisProduksiModel.js";

// GET
export const getProduksi = async (req, res) => {
  try {
    const data = await ProduksiModel.getAllJenisProduksi(req.user.company_id);
    res.json({ status: "00", data });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};

// CREATE
export const createProduksi = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      company_id: req.user.company_id,
    };

    console.log("PAYLOAD =", payload);

    await ProduksiModel.createJenisProduksi(payload);

    return res.json({
      status: "00",
      message: "Berhasil tambah data",
    });

  } catch (err) {
    console.error("CREATE PRODUKSI ERROR:", err);

    return res.status(500).json({
      status: "99",
      message: err.message,
    });
  }
};

// UPDATE
export const updateProduksi = async (req, res) => {
  try {
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    await ProduksiModel.updateJenisProduksi(
      req.params.id,
      req.user.company_id,
      req.body
    );

    return res.json({
      status: "00",
      message: "Berhasil update",
    });
  } catch (err) {
    console.error("UPDATE PRODUKSI ERROR:", err);

    return res.status(500).json({
      status: "99",
      message: err.message,
    });
  }
};

// DELETE
export const deleteProduksi = async (req, res) => {
  try {
    await ProduksiModel.deleteJenisProduksi(req.params.id, req.user.company_id);
    res.json({ status: "00", message: "Berhasil hapus" });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};