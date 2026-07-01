import { db } from "../core/config/knex.js";

// ======================
// GET ALL HPP
// ======================
export const getAllHppErp = (companyId) => {
  return db("hpp as h")
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
  .where("h.company_id", companyId)
  .orderBy("h.id", "desc");
};

// ======================
// INPUT NAMA HPP PRODUK
// ======================

export const createMasterProduk = async (nama_produk_jadi) => {
  const [id] = await db("master_nama_produk").insert({
    nama_produk_jadi,
  });

  return id;
};

// ======================
// MASTER BARANG
// ======================
export const getMasterBarang = () => {
  return db("master_barang as mb")
    .leftJoin(
      "master_satuan_barang as msb",
      "mb.SATUAN_ID",
      "msb.ID"
    )
    .select(
      "mb.ID",
      "mb.BARANG_KODE",
      "mb.NAMA_BARANG",
      "mb.HARGA_JUAL",
      "msb.NAMA_SATUAN"
    )
    .orderBy("mb.NAMA_BARANG", "asc");
};

// ======================
// CREATE HPP
// ======================
export const createHppErp = async (payload) => {
  const trx = await db.transaction();

  try {
    const {
      produkId,
      bahanBaku = [],
      bahanBakuTambahan = [],
      tenagaKerja = [],
      overhead = [],
      totalHPP = 0,
    } = payload;

    // ======================
    // INSERT HEADER
    // ======================
    const [hppId] = await trx("hpp").insert({
      produk_id: produkId,
      total_hpp: totalHPP,
      created_at: new Date(),
    });

    // ======================
    // INSERT DETAIL
    // ======================
    const insertDetail = async (data, kategori) => {
      for (const item of data) {
        await trx("hpp_detail").insert({
          hpp_id: hppId,
          BARANG_KODE: item.barangKode || null,
          kategori,
          nama_item: item.nama || "",
          harga: Number(item.harga || 0),
          satuan: item.satuan || "",
          jumlah: Number(item.jumlah || 0),
          total:
            Number(item.harga || 0) *
            Number(item.jumlah || 0),
        });
      }
    };

    await insertDetail(bahanBaku, "BAHAN_BAKU");
    await insertDetail(bahanBakuTambahan, "BAHAN_BAKU_TAMBAHAN");
    await insertDetail(tenagaKerja, "TENAGA_KERJA");
    await insertDetail(overhead, "OVERHEAD");

    // ======================
    // 🔥 KURANGI STOK (FIFO)
    // ======================
    const reduceStock = async (barangKode, qty) => {
      const stok = await trx("stok_lokasi")
        .where({ BARANG_KODE: barangKode })
        .sum("QTY as total")
        .first();

      const currentStock = Number(stok.total || 0);

      if (currentStock < qty) {
        throw new Error(
          `Stok ${barangKode} tidak cukup`
        );
      }

      const rows = await trx("stok_lokasi")
        .where({ BARANG_KODE: barangKode })
        .orderBy("ID_STOK_LOKASI", "asc");

      let sisa = qty;

      for (const row of rows) {
        if (sisa <= 0) break;

        const ambil = Math.min(row.QTY, sisa);

        await trx("stok_lokasi")
          .where({
            ID_STOK_LOKASI:
              row.ID_STOK_LOKASI,
          })
          .update({
            QTY: row.QTY - ambil,
          });

        sisa -= ambil;
      }

      // ======================
      // UPDATE MASTER BARANG
      // ======================
      await trx("master_barang")
        .where({ BARANG_KODE: barangKode })
        .decrement("STOK_SAAT_INI", qty);
    };

    // ======================
    // APPLY STOCK REDUCTION
    // ======================
    for (const item of bahanBaku) {
      if (item.barangKode) {
        await reduceStock(
          item.barangKode,
          item.jumlah
        );
      }
    }

    await trx.commit();

    return { hppId };
  } catch (err) {
    await trx.rollback();
    console.error("CREATE HPP ERROR:", err);
    throw err;
  }
};

// ======================
// DELETE HPP
// ======================
export const deleteHppErp = (id, companyId) => {
  return db("hpp")
    .where({
      id,
      company_id: companyId,
    })
    .del();
};

// ======================
// FORM DATA
// ======================
export const getSatuan = () => {
  return db("master_satuan_barang").select(
    "ID",
    "NAMA_SATUAN"
  );
};

// ======================
// MASTER PRODUK
// ======================
export const getMasterNamaProduk = () => {
  return db("master_nama_produk")
    .select("id", "nama_produk_jadi")
    .orderBy("nama_produk_jadi", "asc");
};

export const createFase2 = async (payload) => {
  const trx = await db.transaction();

  try {
   console.log(payload);

const {
    hpp_id,
    qty_dipakai,
    nama_produk_baru,

    bahanBaku = [],
    overhead = [],
    tenagaKerja = [],

    totalHPP,
    hppPerPcs,

    companyId,
} = payload;

console.log("hpp_id =", hpp_id);
console.log("companyId =", companyId);
    // =====================
    // Ambil HPP Fase 1
    // =====================
    const fase1 = await trx("hpp")
      .where({
        id: hpp_id,
        company_id: companyId,
      })
      .first();

    if (!fase1)
      throw new Error("Produk Fase 1 tidak ditemukan");

    const qtySisa =
      Number(fase1.qty_sisa ?? fase1.qty_hasil);

    const qtyDipakai = Number(qty_dipakai);

      if (qtyDipakai <= 0)
          throw new Error("Qty harus lebih dari 0");

      if (qtyDipakai > qtySisa)
          throw new Error("Qty melebihi stok");

    // =====================
    // Cari / Buat Produk Baru
    // =====================
    let produk = await trx("master_nama_produk")
      .whereRaw(
        "LOWER(nama_produk_jadi)=?",
        [nama_produk_baru.toLowerCase()]
      )
      .first();

    if (!produk) {
      const [id] = await trx("master_nama_produk").insert({
        nama_produk_jadi: nama_produk_baru,
      });

      produk = { id };
    }

    // =====================
    // Hitung HPP yg dipakai
    // =====================
    const totalHppDipakai =
      Number(fase1.hpp_per_pcs) *
      Number(qty_dipakai);

    // =====================
    // Insert Header Baru
    // =====================
   const [newId] = await trx("hpp").insert({
    company_id: fase1.company_id,
    produk_id: produk.id,

    fase: 2,
    status: "FASE2",

    parent_hpp_id: hpp_id,

    qty_hasil: qty_dipakai,
    qty_sisa: qty_dipakai,

    satuan_hasil: fase1.satuan_hasil,
    total_hpp: totalHPP,
    hpp_per_pcs: hppPerPcs,

    created_at: new Date(),
});

// =====================
// INSERT DETAIL
// =====================
const insertDetail = async (items = [], kategori) => {
    if (!Array.isArray(items)) return;

    for (const item of items) {
        await trx("hpp_detail").insert({
    hpp_id: newId,
    fase: 2,
    parent_hpp_id: item.fromFase1 ? hpp_id : null,
    is_fase1: item.fromFase1 ? 1 : 0,
    BARANG_KODE: item.barangKode ?? null,
    kategori,
    nama_item: item.nama ?? "",
    harga: Number(item.harga ?? 0),
    satuan: item.satuan ?? "-",
    jumlah: Number(item.jumlah ?? 0),
    jam: Number(item.jam ?? 0),
    total:
        Number(item.harga ?? 0) *
        Number(item.jumlah ?? 0),
});
    }
};

await insertDetail(bahanBaku, "BAHAN_BAKU");
await insertDetail(overhead, "OVERHEAD");
await insertDetail(tenagaKerja, "TENAGA_KERJA");

// =====================
// Kurangi stok hasil Fase 1
// =====================
await trx("hpp")
    .where({
        id: hpp_id,
        company_id: companyId,
    })
    .update({
        qty_sisa: qtySisa - qtyDipakai,
    });

await trx.commit();

return {
    id: newId,

  };
  } catch (err) {
    await trx.rollback();
    throw err;
}
};