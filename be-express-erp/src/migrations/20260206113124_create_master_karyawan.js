/**
 * Migration: Master Karyawan
 * Struktur:
 * - ID: Primary Key auto increment (untuk relasi internal sistem)
 * - KARYAWAN_ID: Unique code (untuk relasi ke tabel lain)
 * - EMAIL: Relasi ke users
 * - company_id: Relasi ke companies
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_karyawan", (table) => {
    // ✅ Primary Key (Auto Increment)
    table.increments("ID").primary();

    // ✅ Kode Karyawan Unik
    table.string("KARYAWAN_ID", 20).notNullable().unique();

    // ✅ Relasi ke tabel users (pakai EMAIL)
    table
      .string("EMAIL", 120)
      .notNullable()
      .unique()
      .references("email")
      .inTable("users")
      .onDelete("CASCADE");

    // Identitas Karyawan
    table.string("NIK", 30).notNullable().unique();
    table.string("NAMA", 150).notNullable();
    table.enu("GENDER", ["L", "P"]).notNullable();
    table.string("TEMPAT_LAHIR", 100).nullable();
    table.date("TGL_LAHIR").nullable();
    table.text("ALAMAT").nullable();
    table.string("NO_TELP", 20).nullable();

    // Struktur Organisasi
    table.string("DEPARTEMEN", 100).notNullable();
    table.string("JABATAN", 100).notNullable();
    table.date("TANGGAL_MASUK").nullable();

    // Status kerja
    table
      .enu("STATUS_KARYAWAN", ["Tetap", "Kontrak", "Magang"])
      .defaultTo("Kontrak");
    table.enu("STATUS_AKTIF", ["Aktif", "Nonaktif"]).defaultTo("Aktif");

    // Shift (disesuaikan menjadi string varchar(20) sesuai SQL)
    table.string("SHIFT", 20).nullable();

    // Data tambahan & Dokumen
    table.string("PENDIDIKAN_TERAKHIR", 100).nullable();
    table.string("FOTO", 255).nullable();
    table.string("FOTO_KTP", 255).nullable(); // Ditambahkan sesuai SQL baru

    // Relasi ke tabel companies (ditambahkan sesuai SQL baru)
    table.integer("company_id").unsigned().nullable();
    table
      .foreign("company_id")
      .references("id")
      .inTable("companies")
      .onDelete("SET NULL");

    // Audit (Timestamps dengan ON UPDATE CURRENT_TIMESTAMP)
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .nullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    // Index untuk pencarian cepat
    table.index(["KARYAWAN_ID", "NAMA"]);
    table.index(["DEPARTEMEN", "JABATAN"]);
    table.index("EMAIL");
    table.index("company_id");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_karyawan");
}
