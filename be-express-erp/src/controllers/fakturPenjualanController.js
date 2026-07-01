import * as Model from "../models/fakturPenjualanModel.js";
import { db } from "../core/config/knex.js";

// =========================
// FORMAT DATE MYSQL
// =========================
const formatDateMySQL = (date) => {
  if (!date) return null;

  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
};

// =========================
// GET ALL
// =========================
export const getAllFakturPenjualan = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const data = await Model.getAll(companyId);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("GET ALL ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// GET DETAIL
// =========================
export const getDetailFaktur = async (req, res) => {
  try {
    const { noFaktur } = req.params;

   const companyId = req.user.company_id;

const data = await Model.getDetail(
  req.params.noFaktur,
  companyId
);

res.json({
  success: true,
  data,
});

  } catch (err) {
    console.error("GET DETAIL ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// GENERATE NO FAKTUR
// =========================
export const generateNoFaktur = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const noFaktur = await Model.generateNoFaktur(companyId);

    console.log("Generated:", noFaktur);

    res.json({
      success: true,
      noFaktur,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const generateKodeCustomer = async (companyId) => {
  const last = await db("master_customer")
    .where("company_id", companyId)
    .select("KODE_CUSTOMER")
    .orderBy("ID_CUSTOMER", "desc")
    .first();

  let number = 1;

  if (last?.KODE_CUSTOMER) {
    const match = last.KODE_CUSTOMER.match(/\d+/g);
    if (match) number = parseInt(match[0]) + 1;
  }

  return `CUST-${String(number).padStart(4, "0")}`;
};
// =========================
// CREATE
// =========================
export const createFakturPenjualan = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload?.header) {
      return res.status(400).json({
        success: false,
        message: "Payload tidak valid",
      });
    }

    payload.header.company_id = req.user.company_id;

    payload.header.TGL_FAKTUR = formatDateMySQL(
      payload.header.TGL_FAKTUR
    );

    let customerId = payload.header.ID_CUSTOMER;

    // =========================
    // CEK CUSTOMER
    // =========================
    if (!customerId && payload.header.NAMA_CUSTOMER) {
      const namaCustomer =
        payload.header.NAMA_CUSTOMER.trim();

      const existingCustomer = await db(
        "master_customer"
      )
        .whereRaw(
          "LOWER(NAMA_CUSTOMER) = ?",
          [namaCustomer.toLowerCase()]
        )
        .andWhere("company_id", req.user.company_id)
        .first();

      if (existingCustomer) {
        customerId =
          existingCustomer.ID_CUSTOMER;
      } else {
        const kodeCustomer = await generateKodeCustomer(req.user.company_id);
        const insertCustomer = await db("master_customer").insert({
        KODE_CUSTOMER: kodeCustomer,
        NAMA_CUSTOMER: namaCustomer,
        company_id: req.user.company_id,
      });

        customerId = Array.isArray(insertCustomer)
          ? insertCustomer[0]
          : insertCustomer;
      }
    }

    payload.header.ID_CUSTOMER = customerId;

    const result = await Model.create(payload);

    res.status(201).json({
      success: true,
      message: "Berhasil simpan faktur",
      data: result,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// DELETE
// =========================
export const deleteFaktur = async (req, res) => {
  try {
    const { noFaktur } = req.params;

    await Model.remove(
  req.params.noFaktur,
  req.user.company_id
);

    res.json({
      success: true,
      message: "Berhasil dihapus",
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};