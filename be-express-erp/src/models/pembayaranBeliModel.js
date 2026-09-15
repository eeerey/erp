import { db } from "../core/config/knex.js";

export const getById = async (id) => {
  return db("pembayaran_beli").where({ ID_BAYAR: id }).first();
};

export const getHistoryByInvoice = async (noInvoice) => {
  return db("pembayaran_beli")
    .where({ NO_INVOICE_BELI: noInvoice })
    .orderBy("created_at", "desc");
};

export const createPembayaran = async (data) => {
  return db.transaction(async (trx) => {
    // 1. Simpan Pembayaran
    const [id] = await trx("pembayaran_beli").insert({
      NO_KWITANSI: data.NO_KWITANSI,
      NO_INVOICE_BELI: data.NO_INVOICE_BELI,
      NOMINAL_BAYAR: data.NOMINAL_BAYAR,
      TGL_BAYAR: data.TGL_BAYAR || db.fn.now(),
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    });

    // 2. Ambil Invoice & Update Sisa (Diubah ke huruf kecil: inv_pembelian)
    const inv = await trx("inv_pembelian")
      .where({ NO_INVOICE_BELI: data.NO_INVOICE_BELI })
      .first();
    const sisaBaru =
      parseFloat(inv.SISA_TAGIHAN) - parseFloat(data.NOMINAL_BAYAR);

    await trx("inv_pembelian")
      .where({ NO_INVOICE_BELI: data.NO_INVOICE_BELI })
      .update({
        SISA_TAGIHAN: sisaBaru < 0 ? 0 : sisaBaru,
        STATUS_BAYAR: sisaBaru <= 0 ? "Lunas" : "Cicil",
        updated_at: db.fn.now(),
      });

    return trx("pembayaran_beli").where({ ID_BAYAR: id }).first();
  });
};

export const deletePembayaran = async (id) => {
  return db.transaction(async (trx) => {
    const pay = await trx("pembayaran_beli").where({ ID_BAYAR: id }).first();

    if (!pay) throw new Error("Data pembayaran tidak ditemukan");

    // Ambil Invoice (Diubah ke huruf kecil: inv_pembelian)
    const inv = await trx("inv_pembelian")
      .where({ NO_INVOICE_BELI: pay.NO_INVOICE_BELI })
      .first();

    if (!inv) throw new Error("Invoice terkait tidak ditemukan");

    const sisaKembali =
      parseFloat(inv.SISA_TAGIHAN) + parseFloat(pay.NOMINAL_BAYAR);

    await trx("inv_pembelian")
      .where({ NO_INVOICE_BELI: pay.NO_INVOICE_BELI })
      .update({
        SISA_TAGIHAN: sisaKembali,
        STATUS_BAYAR: sisaKembali >= inv.TOTAL_BAYAR ? "Belum Lunas" : "Cicil",
        updated_at: db.fn.now(),
      });

    return trx("pembayaran_beli").where({ ID_BAYAR: id }).del();
  });
};
