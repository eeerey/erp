import { db } from "../core/config/knex.js";
import { updateSaldoStok } from "./stokLokasiModel.js";

const TABLE = "tr_barang_keluar";

// 1. Ambil semua data barang keluar
export const getAllBarangKeluar = async () => {
  return await db(TABLE)
    .leftJoin(
      "master_barang",
      `${TABLE}.BARANG_KODE`,
      "master_barang.BARANG_KODE",
    )
    .leftJoin(
      "master_gudang",
      `${TABLE}.KODE_GUDANG`,
      "master_gudang.KODE_GUDANG",
    )
    .leftJoin("master_rak", `${TABLE}.KODE_RAK`, "master_rak.KODE_RAK")
    .select(
      `${TABLE}.*`,
      "master_barang.NAMA_BARANG",
      "master_gudang.NAMA_GUDANG",
      "master_rak.NAMA_RAK",
    )
    .orderBy(`${TABLE}.created_at`, "desc");
};

// 1b. Ambil daftar nomor pengiriman untuk pilihan dropdown
export const getListPengiriman = async () => {
  return await db("inv_pengiriman_h")
    .select("NO_PENGIRIMAN", "TGL_KIRIM", "KODE_PELANGGAN")
    .orderBy("created_at", "desc");
};

// 2. Tambah barang keluar + validasi stok
export const createBarangKeluar = async (data) => {
  return db.transaction(async (trx) => {
    const stokLokasi = await trx("stok_lokasi")
      .where({
        BARANG_KODE: data.BARANG_KODE,
        KODE_GUDANG: data.KODE_GUDANG,
        KODE_RAK: data.KODE_RAK,
        BATCH_NO: data.BATCH_NO || null,
      })
      .first();

    const currentQty = stokLokasi ? parseFloat(stokLokasi.QTY) : 0;
    if (currentQty < data.QTY) {
      throw new Error(
        `Stok tidak cukup! Stok saat ini di lokasi: ${currentQty}`,
      );
    }

    const [ID_KELUAR] = await trx(TABLE).insert({
      NO_KELUAR: data.NO_KELUAR,
      NO_PENGIRIMAN: data.NO_PENGIRIMAN || null,
      BARANG_KODE: data.BARANG_KODE,
      KODE_GUDANG: data.KODE_GUDANG,
      KODE_RAK: data.KODE_RAK,
      QTY: data.QTY,
      BATCH_NO: data.BATCH_NO || null,
      company_id: data.company_id || null,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    });

    await updateSaldoStok(trx, {
      BARANG_KODE: data.BARANG_KODE,
      KODE_GUDANG: data.KODE_GUDANG,
      KODE_RAK: data.KODE_RAK,
      BATCH_NO: data.BATCH_NO,
      QTY: -data.QTY,
    });

    await trx("master_barang")
      .where("BARANG_KODE", data.BARANG_KODE)
      .decrement("STOK_SAAT_INI", data.QTY);

    return trx(TABLE).where({ ID_KELUAR }).first();
  });
};

// 3. Void / Delete barang keluar + kembalikan stok
export const deleteBarangKeluar = async (id) => {
  return db.transaction(async (trx) => {
    const row = await trx(TABLE).where({ ID_KELUAR: id }).first();
    if (!row) throw new Error("Data barang keluar tidak ditemukan");

    await trx("master_barang")
      .where("BARANG_KODE", row.BARANG_KODE)
      .increment("STOK_SAAT_INI", row.QTY);

    await updateSaldoStok(trx, {
      BARANG_KODE: row.BARANG_KODE,
      KODE_GUDANG: row.KODE_GUDANG,
      KODE_RAK: row.KODE_RAK,
      BATCH_NO: row.BATCH_NO,
      QTY: row.QTY,
    });

    return trx(TABLE).where({ ID_KELUAR: id }).del();
  });
};
