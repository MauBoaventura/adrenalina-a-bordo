exports.up = function (knex, Promise) {
    return knex.schema.createTable('trips', function (table) {
        table.increments();
        
        table.integer('vihecleId').notNullable().unsigned();
        table.foreign('vihecleId').references('id').inTable('vihecles')

        table.integer('schedulingId').notNullable().unsigned();
        table.foreign('schedulingsId').references('id').inTable('schedulings')

        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        // table.timestamp('updatedAt').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
        table.datetime('deletedAt');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('trips')
};