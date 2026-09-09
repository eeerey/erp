/**
 * Migration: Create Tabel HPP
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("hpp", (table) => {
    // Primary Key
    table.increments("id").primary();

    // Multi-tenancy & Relasi
    table.integer("company_id").nullable();
    table.integer("produk_id").nullable();
    table.integer("parent_hpp_id").nullable();

    // Data Produk & HPP
    table.string("produk_jadi", 255).nullable();
    table.decimal("total_hpp", 15, 2).nullable();
    table.decimal("hpp_awal", 18, 2).defaultTo(0.0);
    table.decimal("hpp_per_pcs", 15, 2).defaultTo(0.0);

    // Tracking Fase & Quantity
    table.integer("fase").defaultTo(1);
    table.decimal("qty_hasil", 18, 2).defaultTo(0.0);
    table.decimal("qty_sisa", 10, 2).defaultTo(0.0);
    table.decimal("qty_dipakai", 10, 2).defaultTo(0.0);
    table.string("satuan_hasil", 50).nullable();

    // Status Process
    table.enum("status", ["FASE1", "FASE2", "FINAL"]).defaultTo("FASE1");

    // Timestamps
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());

    // Indexing
    table.index("company_id");
    table.index("produk_id");
    table.index("parent_hpp_id");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("hpp");
}
