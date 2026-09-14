/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_satuan_barang", (table) => {
    table.increments("ID").primary();

    table.string("KODE_SATUAN", 20).notNullable().unique();
    table.string("NAMA_SATUAN", 100).notNullable();
    table.string("KELOMPOK", 30).nullable();

    // decimal dengan total 20 digit dan 6 digit di belakang koma
    table.decimal("FAKTOR_DASAR", 20, 6).nullable();

    table.enu("STATUS", ["Aktif", "Tidak Aktif"]).defaultTo("Aktif");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_satuan_barang");
}
