import { db } from "../core/config/knex.js";

// GET ALL
export const getAllPayment = () => {
  return db("transaksi").select("*");
};

// CREATE
export const createPayment = (data) => {
  return db("transaksi").insert(data);
};

// UPDATE STATUS
export const updatePaymentStatus = (order_id, status) => {
  return db("transaksi")
    .where({ order_id })
    .update({ status });
};

// GET BY ORDER ID
export const getPaymentByOrderId = (order_id) => {
  return db("transaksi")
    .where({ order_id })
    .first();
};