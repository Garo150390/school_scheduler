exports.up = (knex) => {
  return knex.schema.createTable('class', (table) => {
    table.increments('id').unsigned().primary();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('deleted_at').nullable();
    table.string('name').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.integer('number_of_seats').nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('class');
};
