/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("companies", (table) => {
    table.increments("id").primary();
    table.string("nama_perusahaan", 255).notNullable();
    table.text("alamat").nullable();
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now());
    table.string("nib", 50).nullable();
    table.string("npwp", 50).nullable();
    table.string("no_telp", 20).nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("companies");
}
