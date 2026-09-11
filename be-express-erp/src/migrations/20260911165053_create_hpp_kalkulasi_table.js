/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("hpp_kalkulasi", (table) => {
    table.increments("id").primary();
    table.integer("company_id").unsigned().notNullable();

    // Informasi Produk & Jumlah
    table.string("nama_produk_jadi", 255).notNullable();
    table.decimal("jumlah_porsi", 15, 2).notNullable().defaultTo(1.0);

    // Total Biaya
    table
      .decimal("total_bahan_baku_langsung", 15, 2)
      .notNullable()
      .defaultTo(0.0);
    table
      .decimal("total_bahan_baku_tidak_langsung", 15, 2)
      .notNullable()
      .defaultTo(0.0);
    table.decimal("total_tenaga_kerja", 15, 2).notNullable().defaultTo(0.0);
    table.decimal("total_overhead", 15, 2).notNullable().defaultTo(0.0);
    table.decimal("total_biaya_produksi", 15, 2).notNullable().defaultTo(0.0);

    // HPP & Margin
    table.decimal("hpp_per_porsi", 15, 2).notNullable().defaultTo(0.0);
    table.decimal("target_margin", 5, 2).notNullable().defaultTo(0.0);
    table.decimal("rekomendasi_harga_jual", 15, 2).notNullable().defaultTo(0.0);
    table.decimal("harga_jual_final", 15, 2).notNullable().defaultTo(0.0);
    table.decimal("profit_per_porsi", 15, 2).notNullable().defaultTo(0.0);

    // Timestamps
    table.datetime("created_at").defaultTo(knex.fn.now());
    table
      .datetime("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    // Foreign Key ke tabel companies
    table
      .foreign("company_id")
      .references("id")
      .inTable("companies")
      .onDelete("CASCADE");

    // Indexes
    table.index("company_id", "idx_hpp_kalkulasi_company");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("hpp_kalkulasi");
}
