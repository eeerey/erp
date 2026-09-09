/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable("inv_pengiriman_d");
  if (!exists) {
    return knex.schema.createTable("inv_pengiriman_d", (table) => {
      table.increments("ID_PENGIRIMAN_D").primary();
      table.string("NO_PENGIRIMAN", 50).nullable();
      table.string("BARANG_KODE", 50).notNullable();
      table.string("KODE_GUDANG", 50).notNullable();
      table.string("KODE_RAK", 50).notNullable();
      table.float("QTY", 8, 2).notNullable();
      table.string("BATCH_NO", 100).nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());

      // Indexing untuk query JOIN dan filtering yang cepat
      table.index("NO_PENGIRIMAN");
      table.index("BARANG_KODE");
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("inv_pengiriman_d");
}
