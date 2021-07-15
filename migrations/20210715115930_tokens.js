exports.up = (knex) => {
  return knex.schema.createTable('tokens', (table) => {
    table.increments('id').unsigned().primary();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('deleted_at').nullable();
    table.integer('user_id').references('id').inTable('users').notNullable();
    table.string('token_id').nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('tokens');
};
