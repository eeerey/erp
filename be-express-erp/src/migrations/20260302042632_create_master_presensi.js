/**
 * Migration: Create Tabel Master Presensi
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_presensi", (table) => {
    // 1. Primary Key
    table.increments("ID").primary();

    // Penambahan kolom COMPANY_ID (multi-tenancy)
    table.integer("COMPANY_ID").notNullable();

    // 2. Kode Transaksi (Contoh: PRS-2024-0001)
    table.string("KODE_PRESENSI", 30).notNullable().unique();

    // 3. Relasi ke Master Karyawan
    table.string("KARYAWAN_ID", 20).notNullable();
    table
      .foreign("KARYAWAN_ID")
      .references("KARYAWAN_ID")
      .inTable("master_karyawan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    // 4. Data Waktu & Tanggal
    table.date("TANGGAL").notNullable();

    // Log Masuk
    table.time("JAM_MASUK").nullable();
    table.string("LOKASI_MASUK", 255).nullable(); // Koordinat/Alamat GPS
    table.string("FOTO_MASUK", 255).nullable();

    // Log Pulang
    table.time("JAM_KELUAR").nullable();
    table.string("LOKASI_KELUAR", 255).nullable();
    table.string("FOTO_KELUAR", 255).nullable();

    // 5. Status Kehadiran & Flagging
    table
      .enum("STATUS", ["Hadir", "Izin", "Sakit", "Alpa", "Cuti", "Dinas Luar"])
      .notNullable()
      .defaultTo("Hadir");

    table.text("KETERANGAN").nullable();

    // Flag untuk mempermudah HR filter data tanpa kalkulasi ulang jam
    table.boolean("IS_TERLAMBAT").defaultTo(false);
    table.boolean("IS_PULANG_AWAL").defaultTo(false);

    // 6. Metadata Audit
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());

    // 7. Constraints & Indexing
    table.unique(["KARYAWAN_ID", "TANGGAL"], "uniq_karyawan_per_hari");
    table.index("TANGGAL");
    table.index("KARYAWAN_ID");
    table.index(["TANGGAL", "STATUS"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_presensi");
}
