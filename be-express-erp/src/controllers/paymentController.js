import midtransClient from "midtrans-client";
import * as PaymentModel from "../models/paymentModel.js";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

// CREATE TRANSACTION
export const createTransaction = async (req, res) => {
  try {
    const { plan, price } = req.body;

    const orderId = `ORDER-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      item_details: [
        {
          id: plan,
          price: price,
          quantity: 1,
          name: plan,
        },
      ],
      customer_details: {
        first_name: "User",
        email: "user@email.com",
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // 🔥 simpan ke database lewat MODEL
    await PaymentModel.createPayment({
      order_id: orderId,
      plan,
      price,
      status: "pending",
    });

    res.json({
      status: "00",
      message: "Berhasil buat transaksi",
      data: {
        token: transaction.token,
        order_id: orderId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "99",
      error: err.message,
    });
  }
};