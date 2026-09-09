/**
 * Migration: Create Tabel HPP Detail
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("hpp_detail", (table) => {
    // Primary Key
    table.increments("id").primary();

    // Relasi Header & Parent HPP
    table.integer("hpp_id").nullable();
    table.integer("parent_hpp_id").nullable();

    // Flags & Tracking
    table.boolean("is_fase1").defaultTo(false);
    table.integer("fase").defaultTo(1);

    // Detail Item / Komponen
    table.string("BARANG_KODE", 50).nullable();
    table.string("kategori", 50).nullable();
    table.string("nama_item", 255).nullable();
    table.decimal("harga", 15, 2).nullable();
    table.string("satuan", 50).nullable();
    table.decimal("jumlah", 10, 2).nullable();
    table.decimal("jam", 10, 2).defaultTo(0.0);
    table.decimal("total", 15, 2).nullable();

    // Indexing
    table.index("hpp_id");
    table.index("parent_hpp_id");
    table.index("BARANG_KODE");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("hpp_detail");
}
