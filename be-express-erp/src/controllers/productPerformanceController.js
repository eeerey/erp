import * as Model from "../models/productPerformanceModel.js";

export const getProductPerformance = async (req, res) => {
  try {
    const companyId = req.user?.company_id; // 🔥 penting

    if (!companyId) {
      return res.status(401).json({
        status: "99",
        message: "Unauthorized (company_id missing)",
      });
    }

    const data = await Model.getProductPerformance(companyId);

    return res.json({
      status: "00",
      data,
    });
  } catch (err) {
    console.error("ERROR getProductPerformance:", err);

    return res.status(500).json({
      status: "99",
      error: err.message,
    });
  }
};