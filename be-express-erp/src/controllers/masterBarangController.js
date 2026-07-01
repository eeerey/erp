import * as Model from "../models/masterBarangModel.js";

export const getAllBarang = async (req, res) => {
  try {
    const data = await Model.getAllBarang(req.user.company_id);

    return res.status(200).json({
      status: "00",
      message: "Success",
      data,
    });
  } catch (err) {
    console.error("GET MASTER BARANG ERROR:", err); // <-- tambahkan ini

    return res.status(500).json({
      status: "99",
      message: err.message,
    });
  }
};

export const getBarangById = async (req, res) => {
  try {
    const data = await Model.getBarangById(req.params.id, req.user.company_id);
    if (!data) return res.status(404).json({ status: "04", message: "Barang Not Found" });
    return res.status(200).json({ status: "00", message: "Success", data });
  } catch (err) {
    return res.status(500).json({ status: "99", message: err.message });
  }
};

export const createBarang = async (req, res) => {
  try {
    const { BARANG_KODE, NAMA_BARANG, JENIS_ID, SATUAN_ID } = req.body;

    if (!BARANG_KODE || !NAMA_BARANG || !JENIS_ID || !SATUAN_ID) {
      return res.status(400).json({
        status: "01",
        message: "Data mandatori wajib diisi",
      });
    }

    const payload = {
      ...req.body,
      company_id: req.user.company_id,
    };

    console.log(payload);

    const data = await Model.createBarang(payload);

    return res.status(201).json({
      status: "00",
      message: "Created",
      data,
    });
  } catch (err) {
    console.error("CREATE BARANG ERROR:", err);

    return res.status(500).json({
      status: "99",
      message: err.message,
    });
  }
};

export const updateBarang = async (req, res) => {
  try {
    const data = await Model.updateBarang(req.params.id, req.user.company_id, req.body);
    return res.status(200).json({ status: "00", message: "Updated", data });
  } catch (err) {
    return res.status(500).json({ status: "99", message: err.message });
  }
};

export const deleteBarang = async (req, res) => {
  try {
    await Model.deleteBarang(req.params.id, req.user.company_id);
    return res.status(200).json({ status: "00", message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ status: "99", message: err.message });
  }
};