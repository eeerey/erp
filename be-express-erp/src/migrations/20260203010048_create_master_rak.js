/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("MASTER_RAK", (table) => {
    table.increments("ID_RAK").primary();

    // Foreign Key ke tabel companies
    table.integer("id_company").unsigned().notNullable();
    table
      .foreign("id_company")
      .references("id")
      .inTable("companies")
      .onDelete("CASCADE");

    // Foreign Key ke tabel MASTER_GUDANG via KODE_GUDANG
    table.string("KODE_GUDANG", 50).notNullable();
    table
      .foreign("KODE_GUDANG")
      .references("KODE_GUDANG")
      .inTable("MASTER_GUDANG")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    // ✅ UBAH dari .index() menjadi .unique() agar bisa direferensikan Foreign Key
    table.string("KODE_RAK", 50).notNullable().unique();
    table.string("NAMA_RAK", 100).nullable();

    // timestamps NOT NULL + DEFAULT CURRENT_TIMESTAMP
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("MASTER_RAK");
}
