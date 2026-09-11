/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_barang", (table) => {
    table.increments("ID").primary();

    // company_id bertipe INT (signed)
    table.integer("company_id").nullable().defaultTo(null);

    // BARANG_KODE tidak diset .unique() agar cocok dengan DDL SQL
    table.string("BARANG_KODE", 50).notNullable();
    table.string("NAMA_BARANG", 200).notNullable();

    table.integer("JENIS_ID").unsigned().nullable().defaultTo(null);
    table.integer("SATUAN_ID").unsigned().nullable().defaultTo(null);

    // ✅ Bagian yang sebelumnya kurang ditambahkan di sini:
    table.string("NAMA_SATUAN", 100).nullable().defaultTo(null);

    table.decimal("STOK_MINIMAL", 15, 2).defaultTo(0.0);
    table.decimal("STOK_SAAT_INI", 15, 2).defaultTo(0.0);
    table.decimal("HARGA_BELI_TERAKHIR", 15, 2).defaultTo(0.0);
    table.decimal("HARGA_JUAL", 15, 2).defaultTo(0.0);

    table.enu("STATUS", ["Aktif", "Tidak Aktif"]).defaultTo("Aktif");

    table.timestamp("created_at").nullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());

    // Index biasa untuk mempercepat query pencarian berdasarkan BARANG_KODE atau company_id
    table.index(["BARANG_KODE"]);
    table.index(["company_id"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_barang");
}
