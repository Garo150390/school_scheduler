exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').unsigned().primary();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('deleted_at').nullable();
    table.enum('role', ['teacher', 'admin', 'student']).notNullable().defaultTo('student');
    table.string('name').nullable();
    table.string('surname').nullable();
    table.string('hash').nullable();
    table.string('phone').notNullable().unique();
    table.string('email').nullable().unique();
    table.integer('gender').nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
