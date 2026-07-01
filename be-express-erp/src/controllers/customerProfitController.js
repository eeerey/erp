import * as Model from "../models/customerProfitModel.js";

export const getCustomerProfit = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const data = await Model.getCustomerProfit(companyId);

    return res.json({
      status: "00",
      data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: "99",
      error: err.message,
    });
  }
};