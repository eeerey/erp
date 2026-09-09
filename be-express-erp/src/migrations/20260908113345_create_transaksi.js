/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("transaksi", (table) => {
    table.increments("id").primary();
    table.string("order_id", 100).nullable();
    table.string("plan", 100).nullable();
    table.integer("price").nullable();
    table.string("status", 50).nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("transaksi");
}
