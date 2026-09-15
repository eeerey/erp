/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Gunakan huruf kecil untuk menghindari masalah case-sensitive di Linux server hosting
  return knex.schema.createTable("master_gudang", (table) => {
    table.increments("ID_GUDANG").primary();

    // Foreign Key ke tabel companies
    table.integer("id_company").unsigned().notNullable();
    table
      .foreign("id_company")
      .references("id")
      .inTable("companies")
      .onDelete("CASCADE"); // Hapus gudang jika company dihapus

    // Hapus .unique() dari sini agar tidak global
    table.string("KODE_GUDANG", 50).notNullable();
    table.string("NAMA_GUDANG", 100).notNullable();
    table.text("ALAMAT").nullable();
    table.string("STATUS", 20).nullable().defaultTo("Aktif");

    // timestamps(useTimestamps, defaultToNow) -> tidak nullable & auto-generate CURRENT_TIMESTAMP
    table.timestamps(true, true);

    // ✨ TAMBAHKAN INI: Unique gabungan antara KODE_GUDANG dan id_company
    table.unique(["KODE_GUDANG", "id_company"], {
      indexName: "master_gudang_kode_company_unique",
    });
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_gudang");
}
