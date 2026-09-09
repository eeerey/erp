/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("MASTER_GUDANG", (table) => {
    table.increments("ID_GUDANG").primary();

    // Foreign Key ke tabel companies
    table.integer("id_company").unsigned().notNullable();
    table
      .foreign("id_company")
      .references("id")
      .inTable("companies")
      .onDelete("CASCADE"); // Hapus gudang jika company dihapus

    table.string("KODE_GUDANG", 50).notNullable().unique();
    table.string("NAMA_GUDANG", 100).notNullable();
    table.text("ALAMAT").nullable();
    table.string("STATUS", 20).nullable().defaultTo("Aktif");

    // timestamps(useTimestamps, defaultToNow) -> tidak nullable & auto-generate CURRENT_TIMESTAMP
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("MASTER_GUDANG");
}
