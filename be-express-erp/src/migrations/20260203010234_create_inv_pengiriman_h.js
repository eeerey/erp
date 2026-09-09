/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // 1. HEADER PENGIRIMAN (Induk)
  const hasHeader = await knex.schema.hasTable("inv_pengiriman_h");
  if (!hasHeader) {
    await knex.schema.createTable("inv_pengiriman_h", (table) => {
      table.increments("ID_PENGIRIMAN_H").primary();
      table.string("NO_PENGIRIMAN", 50).notNullable().unique();
      table.string("KODE_PELANGGAN", 50).notNullable();
      table.date("TGL_KIRIM").notNullable();
      table.string("ALAMAT_TUJUAN", 255).notNullable();
      table
        .enu("STATUS_KIRIM", ["Diproses", "Dikirim", "Diterima"])
        .defaultTo("Diproses");
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });
  }

  // 2. DETAIL PENGIRIMAN (Anak)
  const hasDetail = await knex.schema.hasTable("inv_pengiriman_d");
  if (!hasDetail) {
    await knex.schema.createTable("inv_pengiriman_d", (table) => {
      table.increments("ID_PENGIRIMAN_D").primary();

      table.string("NO_PENGIRIMAN", 50).nullable().defaultTo(null);
      table.string("BARANG_KODE", 50).notNullable();
      table.string("KODE_GUDANG", 50).notNullable();
      table.string("KODE_RAK", 50).notNullable();
      table.float("QTY", 8, 2).notNullable();
      table.string("BATCH_NO", 100).nullable().defaultTo(null);

      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("inv_pengiriman_d");
  await knex.schema.dropTableIfExists("inv_pengiriman_h");
}
