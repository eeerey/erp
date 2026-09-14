/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("hpp_kalkulasi_detail", (table) => {
    table.increments("id").primary();

    // Relasi ke Header (hpp_kalkulasi)
    table.integer("hpp_kalkulasi_id").unsigned().notNullable();
    table
      .foreign("hpp_kalkulasi_id")
      .references("id")
      .inTable("hpp_kalkulasi")
      .onDelete("CASCADE");

    table.integer("company_id").unsigned().notNullable();

    // Kategori & Item
    table
      .enu("kategori", [
        "BAHAN_BAKU_LANGSUNG",
        "BAHAN_BAKU_TIDAK_LANGSUNG",
        "TENAGA_KERJA",
        "OVERHEAD",
      ])
      .notNullable();

    table.string("barang_kode", 100).nullable();
    table.string("nama_item", 255).notNullable();

    // Kuantitas, Satuan, Harga, Jam, & Subtotal
    table.decimal("jumlah", 15, 4).notNullable().defaultTo(0.0);
    table.string("satuan", 50).nullable().defaultTo("-");
    table.decimal("harga_satuan", 15, 2).notNullable().defaultTo(0.0);
    table.decimal("jam", 10, 2).notNullable().defaultTo(1.0); // Ditambahkan sesuai struktur SQL
    table.decimal("subtotal", 15, 2).notNullable().defaultTo(0.0);

    // Timestamp
    table.datetime("created_at").defaultTo(knex.fn.now());

    // Foreign Key ke tabel companies
    table
      .foreign("company_id")
      .references("id")
      .inTable("companies")
      .onDelete("CASCADE");

    // Indexes
    table.index("company_id", "idx_hpp_kalkulasi_detail_company");
    table.index("hpp_kalkulasi_id", "idx_hpp_kalkulasi_detail_header");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("hpp_kalkulasi_detail");
}
