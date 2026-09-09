/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("detail_faktur_penjualan", (table) => {
    table.increments("ID_DETAIL").primary();
    table.integer("ID_FAKTUR").unsigned().notNullable();
    table.integer("PRODUK_ID").notNullable();
    table.decimal("QTY", 18, 2).defaultTo(0.0);
    table.decimal("HARGA_JUAL", 18, 2).defaultTo(0.0);
    table.decimal("DISKON", 18, 2).defaultTo(0.0);
    table.decimal("SUBTOTAL", 18, 2).defaultTo(0.0);
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.index("ID_FAKTUR");
    table.index("PRODUK_ID");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("detail_faktur_penjualan");
}
