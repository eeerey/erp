import { db } from "../core/config/knex.js";
import * as HppErpModel from "../models/hppErpModel.js";

// ======================
// GET ALL
// ======================
export const getAllHppErp = async (req, res) => {
  try {
   const data = await HppErpModel.getAllHppErp(
   req.user.company_id
    );

    res.json({ status: "00", data });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};

// ======================
// MASTER BARANG
// ======================
export const getMasterBarang = async (req, res) => {
  try {
    const data = await HppErpModel.getMasterBarang();
    res.json({ status: "00", data });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};

// ======================
// CREATE
// ======================
export const createHppErp = async (req, res) => {
  const trx = await db.transaction();

  try {
    const {
      nama_produk_jadi,
      bahanBaku = [],
      bahanBakuTambahan = [],
      tenagaKerja = [],
      overhead = [],
      totalHPP = 0,
      hppPerPcs = 0,
    } = req.body;

    console.log("BODY CREATE:", req.body);
    console.log("NAMA PRODUK:", nama_produk_jadi);

    // ======================
    // FIX: AUTO CREATE / FIND PRODUK
    // ======================
    let produk = await trx("master_nama_produk")
      .whereRaw("LOWER(nama_produk_jadi) = ?", [
        (nama_produk_jadi || "").toLowerCase(),
      ])
      .first();

   if (!produk) {
      console.log("CREATE PRODUK BARU:", nama_produk_jadi);

      const [id] = await trx("master_nama_produk").insert({
        nama_produk_jadi,
      });

  console.log("ID PRODUK BARU:", id);

  produk = { id };
}

    // ======================
    // INSERT HPP HEADER
    // ======================
  const insertResult = await trx("hpp").insert({
  produk_id: produk.id,
  total_hpp: totalHPP,
  hpp_per_pcs: hppPerPcs,
  qty_hasil: Number(req.body.qty_hasil || 0),
  qty_sisa: Number(req.body.qty_hasil || 0),
  satuan_hasil: req.body.satuan_hasil || "Kg",
  status: "FASE1",
  parent_hpp_id: null,
  company_id: req.user.company_id,
  created_at: new Date(),
});

console.log("INSERT RESULT =", insertResult);

const hppId = Array.isArray(insertResult)
  ? insertResult[0]
  : insertResult;

console.log("HPP ID =", hppId);

const insertDetail = async (data = [], kategori) => {
  if (!Array.isArray(data)) return;

  for (const item of data) {
    await trx("hpp_detail").insert({
      hpp_id: hppId,
      BARANG_KODE: item.barangKode ?? null,
      kategori,
      nama_item: item.nama ?? "",
      harga: Number(item.harga ?? 0),
      satuan: item.satuan ?? "-",
      jumlah: Number(item.jumlah ?? 0),
      total:
        Number(item.harga ?? 0) *
        Number(item.jumlah ?? 0),
    });
  }
};

await insertDetail(bahanBaku, "BAHAN_BAKU");
await insertDetail(bahanBakuTambahan, "BAHAN_BAKU_TAMBAHAN");
await insertDetail(tenagaKerja, "TENAGA_KERJA");
await insertDetail(overhead, "OVERHEAD");
console.log("BODY CREATE:", req.body);

await trx.commit();


    res.json({
      status: "00",
      message: "HPP berhasil dibuat",
      data: { hppId },
    });
  } catch (err) {
    await trx.rollback();

    res.status(500).json({
      status: "99",
      error: err.message,
    });
  }
};
// ======================
// DELETE
// ======================
export const deleteHppErp = async (req, res) => {
  try {
    await HppErpModel.deleteHppErp(req.params.id,  req.user.company_id);

    res.json({ status: "00", message: "Berhasil hapus HPP" });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};

// ======================
// FORM DATA
// ======================
export const getFormData = async (req, res) => {
  try {
    const satuan = await HppErpModel.getSatuan();
    res.json({ status: "00", data: { satuan } });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};

// ======================
// MASTER PRODUK
// ======================
export const getMasterNamaProduk = async (req, res) => {
  try {
    const data = await HppErpModel.getMasterNamaProduk();
    res.json({ status: "00", data });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};

// ======================
// GET DETAIL (EDIT)
// ======================
export const getHppDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const header = await db("hpp as h")
      .leftJoin("master_nama_produk as p", "h.produk_id", "p.id")
       .select(
        "h.id",
        "h.company_id",
        "h.produk_id",
        "p.nama_produk_jadi",
        "h.total_hpp",
        "h.hpp_per_pcs",
        "h.qty_hasil",
        "h.qty_sisa",
        "h.satuan_hasil",
        "h.status",
        "h.fase",
        "h.created_at"
    )
      .where("h.id", id)
      .where("h.company_id", req.user.company_id)
      .first();

    const detail = await db("hpp_detail")
      .where("hpp_id", id);

    if (!header) {
      return res.status(404).json({
        status: "01",
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      status: "00",
      data: { header, detail },
    });
  } catch (err) {
    res.status(500).json({ status: "99", error: err.message });
  }
};

// ======================
// UPDATE
// ======================
export const updateHppErp = async (req, res) => {
  const trx = await db.transaction();

  try {
    const { id } = req.params;

    const {
      nama_produk_jadi,
      bahanBaku = [],
      bahanBakuTambahan = [],
      tenagaKerja = [],
      overhead = [],
      totalHPP = 0,
      hppPerPcs = 0,
    } = req.body;

    console.log("BODY CREATE:", req.body);
    console.log("NAMA PRODUK:", nama_produk_jadi);

    // ======================
    // FIX: FIND / CREATE PRODUK
    // ======================
    let produk = await trx("master_nama_produk")
      .whereRaw("LOWER(nama_produk_jadi) = ?", [
        (nama_produk_jadi || "").toLowerCase(),
      ])
      .first();

    if (!produk) {
      console.log("INSERT PRODUK BARU:", nama_produk_jadi);

      const [newId] = await trx("master_nama_produk").insert({
        nama_produk_jadi,
      });

      console.log("NEW ID:", newId);

      produk = { id: newId };
    }

    // ======================
    // UPDATE HPP HEADER
    // ======================
    const existing = await trx("hpp")
      .where({
        id,
        company_id: req.user.company_id,
      })
      .first();

    if (!existing) {
      throw new Error(
        "Data tidak ditemukan atau bukan milik user"
      );
    }

   await trx("hpp")
      .where({ id, company_id: req.user.company_id,})
      .update({
        produk_id: produk.id,
        total_hpp: totalHPP,
        hpp_per_pcs: hppPerPcs,
        updated_at: new Date(),
      });

    await trx("hpp_detail").where({ hpp_id: id }).del();

    // ======================
    // INSERT DETAIL (TETAP PUNYA KAMU)
    // ======================
   const insertDetail = async (data = [], kategori) => {
  if (!Array.isArray(data)) return;

  for (const item of data) {
    await trx("hpp_detail").insert({
      hpp_id: id,
      BARANG_KODE: item.barangKode ?? null,
      kategori,
      nama_item: item.nama ?? "",
      harga: Number(item.harga ?? 0),
      satuan: item.satuan ?? "-",
      jumlah: Number(item.jumlah ?? 0),
      total:
        Number(item.harga ?? 0) *
        Number(item.jumlah ?? 0),
    });
  }
};

await insertDetail(bahanBaku, "BAHAN_BAKU");
await insertDetail(bahanBakuTambahan, "BAHAN_BAKU_TAMBAHAN");
await insertDetail(tenagaKerja, "TENAGA_KERJA");
await insertDetail(overhead, "OVERHEAD");

    await trx.commit();

    res.json({
      status: "00",
      message: "HPP berhasil diupdate",
    });
  } catch (err) {
    await trx.rollback();

    res.status(500).json({
      status: "99",
      error: err.message,
      stack: err.stack,
    });
  }
};

// ======================
// CREATE FASE 2
// ======================
export const createFase2 = async (req, res) => {
  try {
     console.log("BODY FASE2 =", req.body);

    const result = await HppErpModel.createFase2({
      ...req.body,
      companyId: req.user.company_id,
    });

    res.json({
      status: "00",
      message: "Produksi Fase 2 berhasil",
      data: result,
    });
  } catch (err) {
    console.error("CREATE FASE 2 ERROR:", err);

    res.status(500).json({
      status: "99",
      error: err.message,
      stack: err.stack,
    });
  }
};