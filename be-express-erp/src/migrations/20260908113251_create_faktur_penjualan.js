/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("faktur_penjualan", (table) => {
    table.increments("ID_FAKTUR").primary();
    table.integer("company_id").notNullable().defaultTo(0);
    table.string("NO_FAKTUR", 50).notNullable().unique();
    table.integer("ID_CUSTOMER").unsigned().notNullable();
    table.string("NAMA_CUSTOMER", 150).nullable();
    table.datetime("TGL_FAKTUR").nullable();
    table.decimal("TOTAL_PENJUALAN", 18, 2).defaultTo(0.0);
    table.decimal("DISKON", 18, 2).defaultTo(0.0);
    table.decimal("PAJAK", 18, 2).defaultTo(0.0);
    table.decimal("GRAND_TOTAL", 18, 2).defaultTo(0.0);
    table.decimal("JUMLAH_BAYAR", 18, 2).defaultTo(0.0);
    table.decimal("SISA_PIUTANG", 18, 2).defaultTo(0.0);
    table
      .enum("STATUS_BAYAR", ["Belum Lunas", "Cicil", "Lunas"])
      .defaultTo("Belum Lunas");
    table
      .enum("STATUS_FAKTUR", ["Draft", "Selesai", "Void"])
      .defaultTo("Draft");
    table.text("KETERANGAN").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index("ID_CUSTOMER");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("faktur_penjualan");
}
