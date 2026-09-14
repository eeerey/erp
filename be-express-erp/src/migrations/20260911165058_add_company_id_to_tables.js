/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const tables = [
    "hpp_detail",
    "detail_faktur_penjualan",
    "logbook_pekerjaan",
    "logbook_revisi",
    "logbook_validasi",
    "login_history",
    "master_batch",
    "master_hari",
    "master_jenis_barang",
    "master_nama_produk",
    "master_pengajuan",
    "master_satuan_barang",
    "master_vendor",
    "pembayaran_beli",
    "pembayaran_penjualan",
    "stok_lokasi",
    "transaksi",
    "tr_barang_keluar",
    "tr_barang_masuk",
  ];

  for (const tableName of tables) {
    // TAMBAHAN: Cek dulu apakah tabelnya benar-benar ada di database
    // Ini mencegah error "Table doesn't exist" saat hasColumn dijalankan pada tabel yang belum dibuat
    const tableExists = await knex.schema.hasTable(tableName);

    if (tableExists) {
      const hasCol = await knex.schema.hasColumn(tableName, "company_id");
      if (!hasCol) {
        await knex.schema.table(tableName, (table) => {
          table.integer("company_id").unsigned().nullable();
          table
            .foreign("company_id")
            .references("id")
            .inTable("companies")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        });
      }
    }
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  const tables = [
    "hpp_detail",
    "detail_faktur_penjualan",
    "logbook_pekerjaan",
    "logbook_revisi",
    "logbook_validasi",
    "login_history",
    "master_batch",
    "master_hari",
    "master_jenis_barang",
    "master_nama_produk",
    "master_pengajuan",
    "master_satuan_barang",
    "master_vendor",
    "pembayaran_beli",
    "pembayaran_penjualan",
    "stok_lokasi",
    "transaksi",
    "tr_barang_keluar",
    "tr_barang_masuk",
  ];

  for (const tableName of tables) {
    // TAMBAHAN: Cek juga pada fungsi rollback (down) untuk keamanan
    const tableExists = await knex.schema.hasTable(tableName);

    if (tableExists) {
      const hasCol = await knex.schema.hasColumn(tableName, "company_id");
      if (hasCol) {
        await knex.schema.table(tableName, (table) => {
          try {
            table.dropForeign(["company_id"]);
          } catch (e) {
            // Abaikan jika constraint sudah terhapus
          }
          table.dropColumn("company_id");
        });
      }
    }
  }
}
