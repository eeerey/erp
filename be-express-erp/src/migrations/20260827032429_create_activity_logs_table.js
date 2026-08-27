/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("activity_logs", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.timestamp("login_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("logout_at").nullable();
    table.integer("duration_seconds").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("activity_logs");
}
