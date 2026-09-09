/**
 * Migration: Create Tabel Master Gaji Jabatan
 * Gaji default per jabatan — dipakai sebagai template payroll
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_gaji_jabatan", (table) => {
    // 1. Primary Key
    table.increments("ID").primary();

    // Penambahan kolom company_id (multi-tenancy)
    table.integer("company_id").notNullable().defaultTo(0);

    // 2. Identitas Jabatan
    table.string("JABATAN", 100).notNullable();
    table.string("DEPARTEMEN", 100).nullable();

    // 3. Komponen Pendapatan
    table.decimal("GAJI_POKOK", 15, 2).notNullable().defaultTo(0.0);
    table.decimal("TUNJANGAN_TRANSPORT", 15, 2).notNullable().defaultTo(0.0);
    table.decimal("TUNJANGAN_MAKAN", 15, 2).notNullable().defaultTo(0.0);
    table.decimal("TUNJANGAN_JABATAN", 15, 2).notNullable().defaultTo(0.0);
    table.decimal("TUNJANGAN_LAINNYA", 15, 2).notNullable().defaultTo(0.0);

    // 4. Komponen Potongan
    table
      .decimal("POTONGAN_TERLAMBAT_PER_MENIT", 10, 2)
      .notNullable()
      .defaultTo(500.0);
    table.decimal("POTONGAN_ALPA_PER_HARI", 10, 2).notNullable().defaultTo(0.0);

    // 5. BPJS & Pajak (dalam persen)
    table.decimal("BPJS_KESEHATAN_PERSEN", 5, 2).notNullable().defaultTo(1.0);
    table.decimal("BPJS_TK_PERSEN", 5, 2).notNullable().defaultTo(2.0);
    table.boolean("IS_KENA_PPH21").notNullable().defaultTo(false);

    // 6. Bonus Kinerja berdasarkan Performance Score
    table.decimal("BONUS_SCORE_90", 5, 2).notNullable().defaultTo(15.0);
    table.decimal("BONUS_SCORE_75", 5, 2).notNullable().defaultTo(10.0);
    table.decimal("BONUS_SCORE_60", 5, 2).notNullable().defaultTo(5.0);

    // 7. Status
    table
      .enum("STATUS", ["Aktif", "Nonaktif"])
      .notNullable()
      .defaultTo("Aktif");

    // 8. Metadata
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());

    // 9. Constraint & Indexing
    table.unique(["JABATAN", "DEPARTEMEN"], "uniq_jabatan_departemen");
    table.index("JABATAN");
    table.index("STATUS");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_gaji_jabatan");
}
