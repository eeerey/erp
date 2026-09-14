import { createUserLog } from "../models/userLogModel.js";

export const logUserActivity = async ({
  req,
  aktivitas,
  modul,
  deskripsi = null,
}) => {
  try {
    const user_id = req.user?.userId;
    const company_id = req.user?.company_id;

    if (!user_id) {
      console.warn("USER LOG: user_id tidak ditemukan");
      return null;
    }

    if (!company_id) {
      console.warn("USER LOG: company_id tidak ditemukan");
      return null;
    }

    const log = await createUserLog({
      company_id,
      user_id,
      aktivitas,
      modul,
      deskripsi,
    });

    console.log("USER ACTIVITY LOGGED:", log);

    return log;
  } catch (error) {
    // Jangan sampai error log membuat
    // transaksi utama gagal.
    console.error("USER LOG HELPER ERROR:", error);

    return null;
  }
};
