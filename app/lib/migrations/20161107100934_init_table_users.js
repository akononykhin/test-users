
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.string('id', 255).notNullable().primary();
        table.string('status', 255);
        table.string('first_name', 255);
        table.string('last_name', 255);
        table.string('email', 255).notNullable().unique();
        table.string('password', 255);
        table.timestamp('created_at');
        table.timestamp('updated_at');
        table.timestamp('deleted_at');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
