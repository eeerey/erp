import { db } from "../core/config/knex.js";

// Buat record log baru saat user masuk/login
export const createActivityLog = async (userId) => {
  try {
    const [inserted] = await db("activity_logs")
      .insert({
        user_id: userId,
        login_at: new Date(),
      })
      .returning("id");

    return typeof inserted === "object" ? inserted.id : inserted;
  } catch (error) {
    console.error("Gagal membuat activity log:", error);
    return null;
  }
};

// Update logout_at dan duration_seconds saat user logout
export const updateActivityLogOnLogout = async (logId) => {
  if (!logId) return;
  try {
    const log = await db("activity_logs").where({ id: logId }).first();
    if (!log) return;

    const logoutAt = new Date();
    const loginAt = new Date(log.login_at);
    // Hitung durasi waktu dalam hitungan detik
    const durationSeconds = Math.floor((logoutAt - loginAt) / 1000);

    await db("activity_logs").where({ id: logId }).update({
      logout_at: logoutAt,
      duration_seconds: durationSeconds,
    });
  } catch (error) {
    console.error("Gagal mengupdate activity log:", error);
  }
};
