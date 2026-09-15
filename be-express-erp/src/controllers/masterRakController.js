import * as MasterRakModel from "../models/masterRakModel.js";
import * as MasterGudangModel from "../models/masterGudangModel.js";

// 1. GET ALL RAK (Join ke Gudang)
export const getAllRak = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const data = await MasterRakModel.getAllRak(companyId);
    return res.status(200).json({
      status: "00",
      message:
        data.length > 0 ? "Data rak berhasil diambil" : "Belum ada data rak",
      data,
    });
  } catch (err) {
    console.error("GET_ALL_RAK_ERROR:", err.message);
    return res.status(500).json({
      status: "99",
      message: "Gagal mengambil data rak",
      error: err.message,
    });
  }
};

// 2. GET RAK BERDASARKAN KODE GUDANG
export const getRakByGudang = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { kode_gudang } = req.params;

    if (!kode_gudang || kode_gudang === "undefined") {
      return res.status(400).json({
        status: "01",
        message: "Kode gudang tidak valid",
      });
    }

    const data = await MasterRakModel.getRakByGudang(kode_gudang, companyId);

    return res.status(200).json({
      status: "00",
      data,
    });
  } catch (err) {
    console.error("GET_RAK_BY_GUDANG_ERROR:", err.message);
    return res.status(500).json({
      status: "99",
      error: err.message,
    });
  }
};

// 3. CREATE RAK BARU
export const createRak = async (req, res) => {
  try {
    const { KODE_GUDANG, KODE_RAK, NAMA_RAK } = req.body;
    const companyId = req.user.company_id;

    if (!KODE_GUDANG || !KODE_RAK) {
      return res.status(400).json({
        status: "01",
        message: "KODE_GUDANG dan KODE_RAK wajib diisi",
      });
    }

    // Cek duplikasi kode rak di company yang sama
    const existing = await MasterRakModel.getRakByKode(KODE_RAK, companyId);
    if (existing) {
      return res.status(409).json({
        status: "02",
        message: `Kode Rak ${KODE_RAK} sudah terdaftar`,
      });
    }

    const result = await MasterRakModel.createRak({
      company_id: companyId,
      KODE_GUDANG,
      KODE_RAK,
      NAMA_RAK,
    });

    return res.status(201).json({
      status: "00",
      message: "Data rak berhasil ditambahkan",
      data: result,
    });
  } catch (err) {
    console.error("CREATE_RAK_ERROR:", err.message);
    return res.status(500).json({
      status: "99",
      message: "Gagal menambah rak",
      error: err.message,
    });
  }
};

// 4. UPDATE RAK
export const updateRak = async (req, res) => {
  try {
    const { id } = req.params; // ID_RAK dari URL
    const companyId = req.user.company_id;

    if (!id || id === "undefined") {
      return res.status(400).json({
        status: "01",
        message: "ID Rak tidak ditemukan atau tidak valid",
      });
    }

    // Cek apakah data rak yang mau diedit benar-benar ada
    const existing = await MasterRakModel.getRakById(id, companyId);
    if (!existing) {
      return res.status(404).json({
        status: "04",
        message: "Data rak tidak ditemukan di database",
      });
    }

    // Pisahkan ID_RAK dari body agar tidak ikut menimpa primary key
    const { ID_RAK, ...updateData } = req.body;

    // Panggil fungsi model update dengan membawa ID dan companyId
    const result = await MasterRakModel.updateRak(id, companyId, updateData);

    return res.status(200).json({
      status: "00",
      message: "Data rak berhasil diperbarui",
      data: result,
    });
  } catch (err) {
    console.error("UPDATE_RAK_ERROR:", err.message);
    return res.status(500).json({
      status: "99",
      message: "Gagal memperbarui rak",
      error: err.message,
    });
  }
};

// 5. DELETE RAK
export const deleteRak = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.company_id;

    if (!id || id === "undefined") {
      return res.status(400).json({
        status: "01",
        message: "ID Rak tidak valid untuk dihapus",
      });
    }

    const existing = await MasterRakModel.getRakById(id, companyId);
    if (!existing) {
      return res.status(404).json({
        status: "04",
        message: "Data rak tidak ditemukan",
      });
    }

    await MasterRakModel.deleteRak(id, companyId);

    return res.status(200).json({
      status: "00",
      message: "Data rak berhasil dihapus",
    });
  } catch (err) {
    console.error("DELETE_RAK_ERROR:", err.message);
    return res.status(500).json({
      status: "99",
      message:
        "Gagal menghapus data. Pastikan rak tidak sedang digunakan di tabel lain.",
      error: err.message,
    });
  }
};
