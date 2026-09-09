/**
 * Migration: Create Tabel Jenis Produksi
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("jenis_produksi", (table) => {
    // Primary Key
    table.increments("ID").primary();

    // Multi-tenancy
    table.integer("company_id").notNullable();

    // Identitas Produksi
    table.string("ID_JENIS_PRODUKSI", 50).nullable();
    table.string("NAMA_PRODUK", 100).nullable();
    table.string("BARANG_KODE", 50).nullable();
    table.string("NO_BATCH", 50).nullable();

    // Metric Produksi
    table.integer("TARGET").nullable();
    table.integer("HASIL").nullable();
    table.integer("GAGAL").nullable();

    // Atribut Tambahan
    table.string("SKALA", 20).nullable();
    table.string("TUJUAN", 20).nullable();

    // Timestamps
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());

    // Indexing
    table.index("company_id");
    table.index("BARANG_KODE");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("jenis_produksi");
}
    