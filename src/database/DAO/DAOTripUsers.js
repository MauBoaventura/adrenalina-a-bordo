const connection = require('../connection')
const moment = require('moment')

module.exports = {
    async getAll() {
        try {
            var trip = await connection('trip_users')
                .select("*")
                .where({ "deletedAt": null })
        } catch (err) {
            throw err

        }
        return trip;

    },

    async getOneById(id) {
        try {
            var trip = await connection('trip_users')
                .select("*")
                .where({ "id": id, "deletedAt": null })
                .first()
        } catch (err) {
            throw err
        }
        return trip;
    },

    async deleteOneById(id) {
        try {
            var trip = await connection('trip_users')
                .update("deletedAt", moment().format("YYYY-MM-DD HH:mm:ss"))
                .where({ "id": id, "deletedAt": null })

        } catch (err) {
            throw err

        }
    },

    async updateOneById(id, atualiza) {
        try {
            var trip = await connection('trip_users')
                .where({ "id": id, "deletedAt": null })
                .update(atualiza)

        } catch (err) {
            throw err
        }
        return trip;
    },

    async insert(dados) {
        try {
            await connection('trip_users').insert(dados)
        } catch (err) {
            throw err
        }
    },




}