import { db } from "../core/config/knex.js";
import { datetime, status } from "../utils/general.js";

export const getActivityLogsForSuperAdmin = async (req, res) => {
  try {
    const logs = await db("activity_logs as al")
      .join("users as u", "al.user_id", "u.id")
      .leftJoin("companies as c", "u.company_id", "c.id")
      .select(
        "al.id as log_id",
        "u.id as user_id",
        "u.name as nama_user",
        "u.email as email_user",
        "c.nama_perusahaan",
        "al.login_at",
        "al.logout_at",
        "al.duration_seconds",
      )
      .orderBy("al.login_at", "desc");

    return res.status(200).json({
      status: status.SUKSES,
      message: "Berhasil mengambil data log aktivitas user",
      datetime: datetime(),
      data: logs,
    });
  } catch (error) {
    console.error("Error getActivityLogsForSuperAdmin:", error);
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};
