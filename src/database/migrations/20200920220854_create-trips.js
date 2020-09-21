exports.up = function (knex, Promise) {
    return knex.schema.createTable('trips', function (table) {
        table.increments();
        
        table.integer('vihecle_id').notNullable().unsigned();
        table.foreign('vihecle_id').references('id').inTable('vihecles')

        table.integer('scheduling_id').notNullable().unsigned();
        table.foreign('scheduling_id').references('id').inTable('schedulings')

        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        // table.timestamp('updatedAt').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
        table.datetime('deletedAt');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('trips')
};