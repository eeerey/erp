/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.string("email", 100).unique().notNullable();
    table.string("password", 255).notNullable();

    table
      .enu("role", [
        "SUPERADMIN",
        "SDM",
        "GUDANG",
        "PRODUKSI",
        "HR",
        "KEUANGAN",
      ])
      .notNullable()
      .defaultTo("GUDANG");

    // Relasi ke tabel companies
    table.integer("company_id").unsigned().nullable();
    table
      .foreign("company_id")
      .references("id")
      .inTable("companies")
      .onDelete("SET NULL");

    // Fitur verifikasi akun
    table.boolean("is_verified").nullable().defaultTo(false);
    table.string("verification_token", 255).nullable();
    table.datetime("token_expires_at").nullable();

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
  return knex.schema.dropTableIfExists("users");
}
