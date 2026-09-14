/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("master_customer", (table) => {
    table.increments("ID_CUSTOMER").primary();

    // Penambahan kolom company_id (multi-tenancy)
    table.integer("company_id").unsigned().notNullable().defaultTo(0);

    table.string("KODE_CUSTOMER", 50).unique().notNullable();
    table.string("NAMA_CUSTOMER", 150).notNullable();
    table.text("ALAMAT").nullable();
    table.string("NO_TELP", 20).nullable();
    table.string("EMAIL", 100).nullable();
    table.enum("STATUS", ["Aktif", "Non-Aktif"]).defaultTo("Aktif");

    // timestamps NOT NULL + DEFAULT CURRENT_TIMESTAMP
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists("master_customer");
};
