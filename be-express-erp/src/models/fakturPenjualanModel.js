import { db } from "../core/config/knex.js";

// =========================
// FORMAT DATE MYSQL
// =========================
const formatDateMySQL = (date) => {
  if (!date) return null;

  return new Date(date)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
};

// =========================
// GET ALL
// =========================
export const getAll = async (companyId) => {
  return db("faktur_penjualan as fp")
    .select(
      "fp.ID_FAKTUR",
      "fp.NO_FAKTUR",
      "fp.TGL_FAKTUR",
      "fp.STATUS_BAYAR",
      "fp.TOTAL_PENJUALAN",
      "mc.NAMA_CUSTOMER"
    )
    .leftJoin(
      "master_customer as mc",
      "fp.ID_CUSTOMER",
      "mc.ID_CUSTOMER"
    )
    .where("fp.company_id", companyId)
    .orderBy("fp.ID_FAKTUR", "desc");
    
};

// =========================
// GET DETAIL
// =========================
export const getDetail = async (noFaktur, companyId) => {
  const header = await db("faktur_penjualan as fp")
    .select(
      "fp.*",
      "mc.NAMA_CUSTOMER"
    )
    .leftJoin(
      "master_customer as mc",
      "fp.ID_CUSTOMER",
      "mc.ID_CUSTOMER"
    )
    .where({"fp.NO_FAKTUR": noFaktur, "fp.company_id": companyId,})
    .first();

  if (!header) {
    return {
      header: null,
      detail: [],
    };
  }

  const detail = await db(
    "detail_faktur_penjualan as d"
  )
    .select(
      "d.*",
      "p.nama_produk_jadi as PRODUK_NAMA"
    )
    .leftJoin(
      "master_nama_produk as p",
      "d.PRODUK_ID",
      "p.id"
    )
    .where(
      "d.ID_FAKTUR",
      header.ID_FAKTUR
    );

  return {
    header,
    detail,
  };
};

// =========================
// GENERATE NO FAKTUR
// =========================
export const generateNoFaktur = async (companyId) => {
  const last = await db("faktur_penjualan")
    .where("company_id", companyId)
    .orderBy("ID_FAKTUR", "desc")
    .first();

  const lastNumber = last
    ? parseInt(last.NO_FAKTUR.slice(-4))
    : 0;

  const next = lastNumber + 1;

  return `FP-${String(next).padStart(4, "0")}`;
};

// =========================
// CREATE
// =========================
export const create = async (
  payload
) => {
  const {
    header,
    details = [],
  } = payload;

  return db.transaction(
    async (trx) => {
      const tgl =
        formatDateMySQL(
          header.TGL_FAKTUR
        );

      const [idFaktur] =
        await trx("faktur_penjualan").insert({
        NO_FAKTUR: header.NO_FAKTUR,
        ID_CUSTOMER: header.ID_CUSTOMER,
       TGL_FAKTUR: tgl,
        STATUS_BAYAR: header.STATUS_BAYAR,
        TOTAL_PENJUALAN: header.TOTAL_PENJUALAN,
        company_id: header.company_id,
      });

      if (
        details &&
        details.length > 0
      ) {
        const detailData =
          details.map((d) => ({
            ID_FAKTUR:
              idFaktur,

            PRODUK_ID:
              d.PRODUK_ID,

            QTY: d.QTY,

            HARGA_JUAL:
              d.HARGA_JUAL,

            DISKON:
              d.DISKON || 0,

            SUBTOTAL:
              d.SUBTOTAL,
          }));

        await trx(
          "detail_faktur_penjualan"
        ).insert(detailData);
      }

      return {
        idFaktur,
        NO_FAKTUR:
          header.NO_FAKTUR,
      };
    }
  );
};

// =========================
// DELETE
// =========================
export const remove = async (
  noFaktur,
  companyId
) => {
  return db.transaction(async (trx) => {
    const header = await trx("faktur_penjualan")
      .where({
        NO_FAKTUR: noFaktur,
        company_id: companyId,
      })
      .first();

    if (!header) return;

    await trx("detail_faktur_penjualan")
      .where("ID_FAKTUR", header.ID_FAKTUR)
      .del();

    await trx("faktur_penjualan")
      .where({
        NO_FAKTUR: noFaktur,
        company_id: companyId,
      })
      .del();
  });
};