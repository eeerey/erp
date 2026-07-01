import * as LabaErpModel from "../models/labaErpModel.js";

export const getLabaErp = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const data = await LabaErpModel.getLabaErp(companyId);

    res.json({
      status: "00",
      data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: "99",
      error: err.message,
    });
  }
};