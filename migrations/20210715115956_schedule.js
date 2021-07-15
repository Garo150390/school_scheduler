exports.up = (knex) => {
  return knex.schema.createTable('schedule', (table) => {
    table.increments('id').unsigned().primary();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('deleted_at').nullable();
    table.integer('user_id').references('id').inTable('users').notNullable();
    table.integer('class_id').references('id').inTable('class').notNullable();
    table.dateTime('start_date').notNullable();
    table.dateTime('end_date').notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('schedule');
};
