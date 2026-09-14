export async function up(knex) {
  await knex.schema.dropTableIfExists("PEMBAYARAN_BELI");
  return knex.schema.createTable("PEMBAYARAN_BELI", (table) => {
    table.increments("ID_BAYAR").primary();
    table.string("NO_KWITANSI", 50).notNullable().unique();
    table.string("NO_INVOICE_BELI", 50).references("NO_INVOICE_BELI").inTable("inv_pembelian");
    table.decimal("NOMINAL_BAYAR", 15, 2).notNullable();
    table.date("TGL_BAYAR").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("PEMBAYARAN_BELI");
}