/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("superadmin", (table) => {
    table.increments("id").primary();

    // Menghubungkan langsung ke tabel users
    table.integer("user_id").unsigned().notNullable();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // Jika user dihapus, data superadmin ikut terhapus

    // Kolom spesifik tambahan khusus superadmin (jika ada, misal hak akses khusus)
    table.string("permissions", 255).nullable();

    // Timestamps
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("superadmin");
}
