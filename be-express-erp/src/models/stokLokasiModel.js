import { db } from "../core/config/knex.js";

/**
 * MENDAPATKAN SEMUA STOK (Untuk Tabel & Laporan PDF)
 **/
export const getCurrentStok = async (filters = {}) => {
  const query = db("stok_lokasi as s") // Sesuai dengan nama tabel di SQL: stok_lokasi
    .select("s.*", "b.NAMA_BARANG", "g.NAMA_GUDANG", "r.NAMA_RAK")
    .leftJoin("master_barang as b", "s.BARANG_KODE", "b.BARANG_KODE")
    .leftJoin("master_gudang as g", "s.KODE_GUDANG", "g.KODE_GUDANG") // Sesuai constraint foreign key (biasanya huruf kecil)
    .leftJoin("master_rak as r", "s.KODE_RAK", "r.KODE_RAK");

  // Filter dinamis berdasarkan parameter
  if (filters.KODE_GUDANG) query.where("s.KODE_GUDANG", filters.KODE_GUDANG);
  if (filters.BARANG_KODE) query.where("s.BARANG_KODE", filters.BARANG_KODE);
  if (filters.company_id) query.where("s.company_id", filters.company_id); // Ditambahkan karena kolom company_id ada di SQL

  return query.orderBy("s.UPDATED_AT", "desc");
};

/**
 * Mendapatkan stok spesifik di satu lokasi
 **/
export const getStokByDetail = async (
  BARANG_KODE,
  KODE_GUDANG,
  KODE_RAK,
  BATCH_NO,
) => {
  return db("stok_lokasi")
    .where({
      BARANG_KODE,
      KODE_GUDANG,
      KODE_RAK,
      BATCH_NO,
    })
    .first();
};

/**
 * Fungsi Internal: Update Saldo (Tambah/Kurang)
 * Digunakan oleh model Barang Masuk & Keluar
 **/
export const updateSaldoStok = async (
  trx,
  {
    BARANG_KODE,
    KODE_GUDANG,
    KODE_RAK,
    BATCH_NO,
    QTY,
    TGL_KADALUARSA,
    company_id,
  },
) => {
  const existing = await trx("stok_lokasi")
    .where({
      BARANG_KODE,
      KODE_GUDANG,
      KODE_RAK,
      BATCH_NO,
    })
    .first();

  if (existing) {
    // Jika data ada, update QTY (tambah/kurang) menggunakan ID_STOK_LOKASI (huruf besar sesuai kolom primary key)
    return trx("stok_lokasi")
      .where({ ID_STOK_LOKASI: existing.ID_STOK_LOKASI })
      .update({
        QTY: Number(existing.QTY) + Number(QTY), // Konversi ke Number agar aman dari tipe decimal
        UPDATED_AT: db.fn.now(),
      });
  } else {
    // Jika data belum ada, insert baru termasuk company_id jika ada
    return trx("stok_lokasi").insert({
      BARANG_KODE,
      KODE_GUDANG,
      KODE_RAK,
      BATCH_NO,
      QTY,
      TGL_KADALUARSA,
      company_id: company_id || null,
      UPDATED_AT: db.fn.now(),
    });
  }
};
