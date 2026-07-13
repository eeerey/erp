import { db } from "../core/config/knex.js";

/* --- HELPER: Hitung jarak GPS (opsional untuk validasi radius) --- */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* --- 1. GET LIST KARYAWAN AKTIF --- */
export const getListKaryawan = async (company_id) => {
  return db("master_karyawan")
    .select("KARYAWAN_ID", "NAMA", "JABATAN", "DEPARTEMEN")
    .where("STATUS_AKTIF", "Aktif")
    .where("COMPANY_ID", company_id)
    .orderBy("NAMA", "asc");
};

/* --- 2. CEK PRESENSI HARI INI --- */
export const getTodayPresensi = async (karyawanId, tanggal, company_id) => {
  return db("master_presensi")
    .where("COMPANY_ID", company_id)
    .where({ KARYAWAN_ID: karyawanId, TANGGAL: tanggal })
    .first();
};

/* --- 3. GET BY ID (untuk delete & validasi foto) --- */
export const getPresensiById = async (id, company_id) => {
  return db("master_presensi").where("COMPANY_ID", company_id).where("ID", id).first();
};

/* --- 4. ABSEN MASUK --- */
export const checkIn = async (payload) => {
  const setting = await db("master_perusahaan").first();

  let isTerlambat = 0;
  if (setting?.JAM_MASUK_NORMAL && payload.JAM_MASUK) {
    isTerlambat = payload.JAM_MASUK > setting.JAM_MASUK_NORMAL ? 1 : 0;
  }

  const finalData = {
    COMPANY_ID:    payload.COMPANY_ID,
    KODE_PRESENSI: payload.KODE_PRESENSI || `PRS-${Date.now()}`,
    KARYAWAN_ID:   payload.KARYAWAN_ID,
    TANGGAL:       payload.TANGGAL,
    JAM_MASUK:     payload.JAM_MASUK,
    LOKASI_MASUK:  payload.LOKASI_MASUK || "Input Admin",
    FOTO_MASUK:    payload.FOTO_MASUK   || null,
    STATUS:        payload.STATUS       || "Hadir",
    KETERANGAN:    payload.KETERANGAN   || "Input via Admin",
    IS_TERLAMBAT:  isTerlambat,
    IS_PULANG_AWAL: 0,
    created_at:    db.fn.now(),
    updated_at:    db.fn.now(),
  };

  const [newId] = await db("master_presensi").insert(finalData);
  return db("master_presensi").where("ID", newId).first();
};

/* --- 5. ABSEN PULANG --- */
export const checkOut = async (company_id, karyawanId, tanggal, data) => {
  const setting = await db("master_perusahaan").first();

  let isPulangAwal = 0;
  if (setting?.JAM_PULANG_NORMAL && data.JAM_KELUAR) {
    isPulangAwal = data.JAM_KELUAR < setting.JAM_PULANG_NORMAL ? 1 : 0;
  }

  await db("master_presensi")
   .where("COMPANY_ID", company_id)
    .where({ KARYAWAN_ID: karyawanId, TANGGAL: tanggal })
    .update({
      JAM_KELUAR:    data.JAM_KELUAR,
      LOKASI_KELUAR: data.LOKASI_KELUAR || "Input Admin",
      FOTO_KELUAR:   data.FOTO_KELUAR   || null,
      IS_PULANG_AWAL: isPulangAwal,
      updated_at:    db.fn.now(),
    });

  return getTodayPresensi(karyawanId, tanggal, company_id);
};

/* --- 6. GET REKAP (dengan filter tanggal) --- */
export const getAllPresensi = async (params = {}) => {
  const company_id = params.company_id;
  // ✅ FIX: support snake_case (dari controller) maupun camelCase
  const startDate = params.start_date || params.startDate || null;
  const endDate   = params.end_date   || params.endDate   || null;
  const karyawanId = params.karyawan_id || params.karyawanId || null;

  const query = db("master_presensi as p")
   .where("p.COMPANY_ID", company_id)
    .leftJoin("master_karyawan as k", "p.KARYAWAN_ID", "k.KARYAWAN_ID")
    .select(
      "p.*",
      "k.NAMA as NAMA_KARYAWAN",
      "k.JABATAN as NAMA_JABATAN",
      "k.DEPARTEMEN"
    );

  // ✅ Filter tanggal — sekarang pasti terbaca
  if (startDate && endDate) {
    query.whereBetween("p.TANGGAL", [startDate, endDate]);
  }

  if (karyawanId) {
    query.where("p.KARYAWAN_ID", karyawanId);
  }

  return query
    .orderBy("p.TANGGAL", "desc")
    .orderBy("p.JAM_MASUK", "desc");
};

/* --- 7. DELETE --- */
export const deletePresensi = async (id, company_id) => {
  return db("master_presensi").where("COMPANY_ID", company_id).where("ID", id).del();
};