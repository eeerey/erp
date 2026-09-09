/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("pembayaran_penjualan", (table) => {
    table.increments("ID_PEMBAYARAN").primary();
    table.integer("ID_FAKTUR").unsigned().notNullable();
    table.string("NO_KWITANSI", 50).nullable();
    table.date("TGL_BAYAR").nullable();
    table.string("METODE_BAYAR", 50).nullable();
    table.decimal("NOMINAL_BAYAR", 18, 2).defaultTo(0.0);
    table.text("KETERANGAN").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.index("ID_FAKTUR");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("pembayaran_penjualan");
}
