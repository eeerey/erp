import { db } from "../core/config/knex.js";

// ======================================================
// AMBIL MASTER BARANG BERDASARKAN KODE
// ======================================================
const getBarangByKode = async (trx, barangKode, companyId) => {
  if (!barangKode) {
    throw new Error("Kode barang wajib diisi");
  }

  const barang = await trx("master_barang")
    .where({
      BARANG_KODE: barangKode,
      company_id: companyId,
    })
    .first();

  if (!barang) {
    throw new Error(`Barang dengan kode ${barangKode} tidak ditemukan`);
  }

  return barang;
};

// ======================================================
// PROSES BAHAN BAKU
// Harga diambil dari master_barang
// ======================================================
const prosesItems = async (trx, items = [], companyId) => {
  if (!Array.isArray(items)) {
    return [];
  }

  const hasil = [];

  for (const item of items) {
    // ----------------------------------------------
    // Ambil barangKode
    // ----------------------------------------------
    const barangKode = item.barangKode ?? item.BARANG_KODE ?? item.barang_kode;

    // ----------------------------------------------
    // Ambil jumlah
    // ----------------------------------------------
    const jumlah = Number(item.jumlah) || 0;

    // ----------------------------------------------
    // Validasi kode barang
    // ----------------------------------------------
    if (!barangKode) {
      throw new Error("Setiap bahan baku harus memiliki barangKode");
    }

    // ----------------------------------------------
    // Validasi jumlah
    // ----------------------------------------------
    if (jumlah <= 0) {
      throw new Error(`Jumlah barang ${barangKode} harus lebih dari 0`);
    }

    // ----------------------------------------------
    // Ambil barang dari master_barang
    // ----------------------------------------------
    const barang = await getBarangByKode(trx, barangKode, companyId);

    // ----------------------------------------------
    // Harga beli terakhir dari database
    // ----------------------------------------------
    const hargaSatuan = Number(barang.HARGA_BELI_TERAKHIR) || 0;

    // ----------------------------------------------
    // Nama barang dari database
    // ----------------------------------------------
    const namaItem = barang.NAMA_BARANG;

    // ----------------------------------------------
    // Satuan dari database
    // ----------------------------------------------
    const satuan = barang.NAMA_SATUAN ?? "-";

    // ----------------------------------------------
    // Hitung subtotal
    // ----------------------------------------------
    const subtotal = jumlah * hargaSatuan;

    hasil.push({
      barang_kode: barang.BARANG_KODE,

      nama_item: namaItem,

      jumlah,

      satuan,

      harga_satuan: hargaSatuan,

      subtotal,
    });
  }

  return hasil;
};

// ======================================================
// PROSES TENAGA KERJA & OVERHEAD
//
// Tidak mengambil data dari master_barang.
// Harga diambil langsung dari input:
// {
//   nama,
//   jumlah,
//   satuan,
//   hargaSatuan
// }
// ======================================================
const prosesBiaya = (items = []) => {
  if (!Array.isArray(items)) {
    return [];
  }

  const hasil = [];

  for (const item of items) {
    // ----------------------------------------------
    // Nama biaya
    // ----------------------------------------------
    const namaItem = item.nama ?? item.nama_item ?? "";

    // ----------------------------------------------
    // Jumlah
    // ----------------------------------------------
    const jumlah = Number(item.jumlah) || 0;

    // ----------------------------------------------
    // Satuan
    // ----------------------------------------------
    const satuan = item.satuan ?? "-";

    // ----------------------------------------------
    // Harga satuan
    // ----------------------------------------------
    const hargaSatuan = Number(item.hargaSatuan ?? item.harga_satuan) || 0;

    // ----------------------------------------------
    // Validasi nama
    // ----------------------------------------------
    if (typeof namaItem !== "string" || !namaItem.trim()) {
      throw new Error("Nama biaya wajib diisi");
    }

    // ----------------------------------------------
    // Validasi jumlah
    // ----------------------------------------------
    if (jumlah <= 0) {
      throw new Error(`Jumlah ${namaItem} harus lebih dari 0`);
    }

    // ----------------------------------------------
    // Validasi harga
    // ----------------------------------------------
    if (hargaSatuan < 0) {
      throw new Error(`Harga ${namaItem} tidak boleh negatif`);
    }

    // ----------------------------------------------
    // Hitung subtotal
    // ----------------------------------------------
    const subtotal = jumlah * hargaSatuan;

    hasil.push({
      // Tenaga kerja dan overhead
      // tidak memiliki barang kode
      barang_kode: null,

      nama_item: namaItem.trim(),

      jumlah,

      satuan,

      harga_satuan: hargaSatuan,

      subtotal,
    });
  }

  return hasil;
};

// ======================================================
// HITUNG TOTAL
// ======================================================
const hitungTotal = (items = []) => {
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce((total, item) => {
    return total + (Number(item.subtotal) || 0);
  }, 0);
};

// ======================================================
// GET MASTER BARANG
// ======================================================
export const getMasterBarang = async (companyId) => {
  return db("master_barang")
    .select(
      "ID",
      "company_id",
      "BARANG_KODE",
      "NAMA_BARANG",
      "JENIS_ID",
      "SATUAN_ID",
      "NAMA_SATUAN",
      "STOK_MINIMAL",
      "STOK_SAAT_INI",
      "HARGA_BELI_TERAKHIR",
      "HARGA_JUAL",
      "STATUS",
    )
    .where("company_id", companyId)
    .where("STATUS", 1)
    .orderBy("NAMA_BARANG", "asc");
};

// ======================================================
// GET ALL HPP
// ======================================================
export const getAll = async (companyId) => {
  const headers = await db("hpp_kalkulasi")
    .where("company_id", companyId)
    .orderBy("id", "desc");

  // Ambil detail masing-masing HPP
  for (const header of headers) {
    header.detail = await db("hpp_kalkulasi_detail")
      .where({
        hpp_kalkulasi_id: header.id,

        company_id: companyId,
      })
      .orderBy("id", "asc");
  }

  return headers;
};

// ======================================================
// GET DETAIL
// ======================================================
export const getById = async (id, companyId) => {
  const header = await db("hpp_kalkulasi")
    .where({
      id,

      company_id: companyId,
    })
    .first();

  if (!header) {
    return null;
  }

  const detail = await db("hpp_kalkulasi_detail")
    .where({
      hpp_kalkulasi_id: id,

      company_id: companyId,
    })
    .orderBy("id", "asc");

  return {
    header,
    detail,
  };
};

// ======================================================
// CREATE HPP
// ======================================================
export const create = async ({
  companyId,

  nama_produk_jadi,

  jumlahPorsi,

  bahanBakuLangsung = [],

  bahanBakuTidakLangsung = [],

  tenagaKerja = [],

  overhead = [],

  targetMargin = 0,

  hargaJualFinal = 0,
}) => {
  console.log("=== DATA CREATE HPP ===");

  console.log("companyId:", companyId);

  console.log("bahanBakuLangsung:", JSON.stringify(bahanBakuLangsung, null, 2));

  console.log(
    "bahanBakuTidakLangsung:",
    JSON.stringify(bahanBakuTidakLangsung, null, 2),
  );

  console.log("tenagaKerja:", JSON.stringify(tenagaKerja, null, 2));

  console.log("overhead:", JSON.stringify(overhead, null, 2));

  const trx = await db.transaction();

  try {
    // ==================================================
    // VALIDASI PRODUK
    // ==================================================
    if (!nama_produk_jadi || !nama_produk_jadi.trim()) {
      throw new Error("Nama menu / produk wajib diisi");
    }

    // ==================================================
    // VALIDASI JUMLAH PORSI
    // ==================================================
    const qty = Number(jumlahPorsi) || 0;

    if (qty <= 0) {
      throw new Error("Jumlah porsi harus lebih dari 0");
    }

    // ==================================================
    // PROSES BAHAN BAKU LANGSUNG
    // ==================================================
    const detailBBL = await prosesItems(trx, bahanBakuLangsung, companyId);

    // ==================================================
    // PROSES BAHAN BAKU TIDAK LANGSUNG
    // ==================================================
    const detailBBTL = await prosesItems(
      trx,
      bahanBakuTidakLangsung,
      companyId,
    );

    // ==================================================
    // PROSES TENAGA KERJA
    // Tidak menggunakan master_barang
    // ==================================================
    const detailTK = prosesBiaya(tenagaKerja);

    // ==================================================
    // PROSES OVERHEAD
    // Tidak menggunakan master_barang
    // ==================================================
    const detailOH = prosesBiaya(overhead);

    // ==================================================
    // HITUNG TOTAL BAHAN BAKU LANGSUNG
    // ==================================================
    const totalBBL = hitungTotal(detailBBL);

    // ==================================================
    // HITUNG TOTAL BAHAN BAKU TIDAK LANGSUNG
    // ==================================================
    const totalBBTL = hitungTotal(detailBBTL);

    // ==================================================
    // HITUNG TOTAL TENAGA KERJA
    // ==================================================
    const totalTK = hitungTotal(detailTK);

    // ==================================================
    // HITUNG TOTAL OVERHEAD
    // ==================================================
    const totalOH = hitungTotal(detailOH);

    // ==================================================
    // TOTAL BIAYA PRODUKSI
    // ==================================================
    const totalBiayaProduksi = totalBBL + totalBBTL + totalTK + totalOH;

    // ==================================================
    // HPP PER PORSI
    // ==================================================
    const hppPerPorsi = Math.round(totalBiayaProduksi / qty);

    // ==================================================
    // MARGIN
    // ==================================================
    const margin = Number(targetMargin) || 0;

    // ==================================================
    // REKOMENDASI HARGA JUAL
    // ==================================================
    const rekomendasiHargaJual = Math.round(
      hppPerPorsi + (hppPerPorsi * margin) / 100,
    );

    // ==================================================
    // HARGA JUAL FINAL
    // ==================================================
    const hargaFinal =
      Number(hargaJualFinal) > 0
        ? Number(hargaJualFinal)
        : rekomendasiHargaJual;

    // ==================================================
    // PROFIT PER PORSI
    // ==================================================
    const profitPerPorsi = hargaFinal - hppPerPorsi;

    // ==================================================
    // INSERT HEADER
    // ==================================================
    const [hppId] = await trx("hpp_kalkulasi").insert({
      company_id: companyId,

      nama_produk_jadi: nama_produk_jadi.trim(),

      jumlah_porsi: qty,

      total_bahan_baku_langsung: totalBBL,

      total_bahan_baku_tidak_langsung: totalBBTL,

      total_tenaga_kerja: totalTK,

      total_overhead: totalOH,

      total_biaya_produksi: totalBiayaProduksi,

      hpp_per_porsi: hppPerPorsi,

      target_margin: margin,

      rekomendasi_harga_jual: rekomendasiHargaJual,

      harga_jual_final: hargaFinal,

      profit_per_porsi: profitPerPorsi,

      created_at: new Date(),
    });

    // ==================================================
    // INSERT DETAIL
    // ==================================================
    const insertDetail = async (items, kategori) => {
      for (const item of items) {
        await trx("hpp_kalkulasi_detail").insert({
          hpp_kalkulasi_id: hppId,

          company_id: companyId,

          kategori,

          barang_kode: item.barang_kode,

          nama_item: item.nama_item,

          jumlah: item.jumlah,

          satuan: item.satuan,

          harga_satuan: item.harga_satuan,

          subtotal: item.subtotal,
        });
      }
    };

    // ==================================================
    // DETAIL BAHAN BAKU LANGSUNG
    // ==================================================
    await insertDetail(detailBBL, "BAHAN_BAKU_LANGSUNG");

    // ==================================================
    // DETAIL BAHAN BAKU TIDAK LANGSUNG
    // ==================================================
    await insertDetail(detailBBTL, "BAHAN_BAKU_TIDAK_LANGSUNG");

    // ==================================================
    // DETAIL TENAGA KERJA
    // ==================================================
    await insertDetail(detailTK, "TENAGA_KERJA");

    // ==================================================
    // DETAIL OVERHEAD
    // ==================================================
    await insertDetail(detailOH, "OVERHEAD");

    // ==================================================
    // COMMIT
    // ==================================================
    await trx.commit();

    // ==================================================
    // RETURN
    // ==================================================
    return {
      id: hppId,

      totalBBL,

      totalBBTL,

      totalTK,

      totalOH,

      totalBiayaProduksi,

      hppPerPorsi,

      targetMargin: margin,

      rekomendasiHargaJual,

      hargaJualFinal: hargaFinal,

      profitPerPorsi,
    };
  } catch (error) {
    // ==================================================
    // ROLLBACK
    // ==================================================
    await trx.rollback();

    throw error;
  }
};

// ======================================================
// UPDATE HPP
// ======================================================
export const update = async ({
  id,

  companyId,

  nama_produk_jadi,

  jumlahPorsi,

  bahanBakuLangsung = [],

  bahanBakuTidakLangsung = [],

  tenagaKerja = [],

  overhead = [],

  targetMargin = 0,

  hargaJualFinal = 0,
}) => {
  const trx = await db.transaction();

  try {
    // ==================================================
    // CEK DATA HPP
    // ==================================================
    const existing = await trx("hpp_kalkulasi")
      .where({
        id,

        company_id: companyId,
      })
      .first();

    if (!existing) {
      throw new Error("Data HPP tidak ditemukan");
    }

    // ==================================================
    // VALIDASI PRODUK
    // ==================================================
    if (!nama_produk_jadi || !nama_produk_jadi.trim()) {
      throw new Error("Nama menu / produk wajib diisi");
    }

    // ==================================================
    // VALIDASI JUMLAH PORSI
    // ==================================================
    const qty = Number(jumlahPorsi) || 0;

    if (qty <= 0) {
      throw new Error("Jumlah porsi harus lebih dari 0");
    }

    // ==================================================
    // PROSES BAHAN BAKU LANGSUNG
    // ==================================================
    const detailBBL = await prosesItems(trx, bahanBakuLangsung, companyId);

    // ==================================================
    // PROSES BAHAN BAKU TIDAK LANGSUNG
    // ==================================================
    const detailBBTL = await prosesItems(
      trx,
      bahanBakuTidakLangsung,
      companyId,
    );

    // ==================================================
    // PROSES TENAGA KERJA
    // ==================================================
    const detailTK = prosesBiaya(tenagaKerja);

    // ==================================================
    // PROSES OVERHEAD
    // ==================================================
    const detailOH = prosesBiaya(overhead);

    // ==================================================
    // HITUNG TOTAL
    // ==================================================
    const totalBBL = hitungTotal(detailBBL);

    const totalBBTL = hitungTotal(detailBBTL);

    const totalTK = hitungTotal(detailTK);

    const totalOH = hitungTotal(detailOH);

    // ==================================================
    // TOTAL BIAYA PRODUKSI
    // ==================================================
    const totalBiayaProduksi = totalBBL + totalBBTL + totalTK + totalOH;

    // ==================================================
    // HPP PER PORSI
    // ==================================================
    const hppPerPorsi = Math.round(totalBiayaProduksi / qty);

    // ==================================================
    // MARGIN
    // ==================================================
    const margin = Number(targetMargin) || 0;

    // ==================================================
    // REKOMENDASI HARGA JUAL
    // ==================================================
    const rekomendasiHargaJual = Math.round(
      hppPerPorsi + (hppPerPorsi * margin) / 100,
    );

    // ==================================================
    // HARGA FINAL
    // ==================================================
    const hargaFinal =
      Number(hargaJualFinal) > 0
        ? Number(hargaJualFinal)
        : rekomendasiHargaJual;

    // ==================================================
    // PROFIT
    // ==================================================
    const profitPerPorsi = hargaFinal - hppPerPorsi;

    // ==================================================
    // UPDATE HEADER
    // ==================================================
    await trx("hpp_kalkulasi")
      .where({
        id,

        company_id: companyId,
      })
      .update({
        nama_produk_jadi: nama_produk_jadi.trim(),

        jumlah_porsi: qty,

        total_bahan_baku_langsung: totalBBL,

        total_bahan_baku_tidak_langsung: totalBBTL,

        total_tenaga_kerja: totalTK,

        total_overhead: totalOH,

        total_biaya_produksi: totalBiayaProduksi,

        hpp_per_porsi: hppPerPorsi,

        target_margin: margin,

        rekomendasi_harga_jual: rekomendasiHargaJual,

        harga_jual_final: hargaFinal,

        profit_per_porsi: profitPerPorsi,

        updated_at: new Date(),
      });

    // ==================================================
    // HAPUS DETAIL LAMA
    // ==================================================
    await trx("hpp_kalkulasi_detail")
      .where({
        hpp_kalkulasi_id: id,

        company_id: companyId,
      })
      .del();

    // ==================================================
    // INSERT DETAIL BARU
    // ==================================================
    const insertDetail = async (items, kategori) => {
      for (const item of items) {
        await trx("hpp_kalkulasi_detail").insert({
          hpp_kalkulasi_id: id,

          company_id: companyId,

          kategori,

          barang_kode: item.barang_kode,

          nama_item: item.nama_item,

          jumlah: item.jumlah,

          satuan: item.satuan,

          harga_satuan: item.harga_satuan,

          subtotal: item.subtotal,
        });
      }
    };

    // ==================================================
    // DETAIL BAHAN BAKU LANGSUNG
    // ==================================================
    await insertDetail(detailBBL, "BAHAN_BAKU_LANGSUNG");

    // ==================================================
    // DETAIL BAHAN BAKU TIDAK LANGSUNG
    // ==================================================
    await insertDetail(detailBBTL, "BAHAN_BAKU_TIDAK_LANGSUNG");

    // ==================================================
    // DETAIL TENAGA KERJA
    // ==================================================
    await insertDetail(detailTK, "TENAGA_KERJA");

    // ==================================================
    // DETAIL OVERHEAD
    // ==================================================
    await insertDetail(detailOH, "OVERHEAD");

    // ==================================================
    // COMMIT
    // ==================================================
    await trx.commit();

    // ==================================================
    // RETURN
    // ==================================================
    return {
      id,

      totalBBL,

      totalBBTL,

      totalTK,

      totalOH,

      totalBiayaProduksi,

      hppPerPorsi,

      targetMargin: margin,

      rekomendasiHargaJual,

      hargaJualFinal: hargaFinal,

      profitPerPorsi,
    };
  } catch (error) {
    // ==================================================
    // ROLLBACK
    // ==================================================
    await trx.rollback();

    throw error;
  }
};

// ======================================================
// DELETE HPP
// ======================================================
export const remove = async (id, companyId) => {
  const trx = await db.transaction();

  try {
    // ==================================================
    // CEK DATA
    // ==================================================
    const existing = await trx("hpp_kalkulasi")
      .where({
        id,

        company_id: companyId,
      })
      .first();

    if (!existing) {
      await trx.rollback();

      return 0;
    }

    // ==================================================
    // HAPUS DETAIL
    // ==================================================
    await trx("hpp_kalkulasi_detail")
      .where({
        hpp_kalkulasi_id: id,

        company_id: companyId,
      })
      .del();

    // ==================================================
    // HAPUS HEADER
    // ==================================================
    const deleted = await trx("hpp_kalkulasi")
      .where({
        id,

        company_id: companyId,
      })
      .del();

    // ==================================================
    // COMMIT
    // ==================================================
    await trx.commit();

    return deleted;
  } catch (error) {
    // ==================================================
    // ROLLBACK
    // ==================================================
    await trx.rollback();

    throw error;
  }
};
