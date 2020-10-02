const connection = require('../connection')
const moment = require('moment')

module.exports = {
    async getAll() {
        try {
            var vehicle = await connection('vehicles')
                .select("*")
                .where({ "deletedAt": null })
        } catch (err) {
            return { error: err }
        }
        return vehicle;

    },

    async getOneById(id) {
        try {
            var vehicle = await connection('vehicles')
            .select("*")
            .where({ "id": id, "deletedAt": null })
            .first()
        } catch (err) {
            return { error: err }
        }
        return vehicle;
    },

    async deleteOneById(id) {
        try {
            await connection('vehicles')
                .update("deletedAt", moment().format("YYYY-MM-DD HH:mm:ss"))
                .where({ "id": id, "deletedAt": null })

        } catch (err) {
            return { error: err }
        }
    },

    async updateOneById(id, atualiza) {
        try {
            var vehicle = await connection('vehicles')
                .where({ "id": id, "deletedAt": null })
                .update(atualiza)

        } catch (err) {
            return { error: err }
        }
        return vehicle;
    },

    async insert(dados) {
        try {
           await connection('vehicles').insert(dados)
        } catch (err) {
            return { error: err }
        }
    },




}