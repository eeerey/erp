/**
 * Migration: Create Tabel Harga Jual
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("harga_jual", (table) => {
    // Primary Key
    table.increments("id").primary();

    // Multi-tenancy & Foreign Key
    table.integer("company_id").notNullable();
    table.integer("produk_id").notNullable();

    // Margin & Harga Jual
    table.decimal("margin", 5, 2).notNullable();
    table.decimal("harga_jual", 15, 2).notNullable().defaultTo(0.0);

    // Timestamps
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());

    // Indexing
    table.index("company_id");
    table.index("produk_id");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("harga_jual");
}
