const connection = require('../connection')
const moment = require('moment')

module.exports = {
    async getAll() {
        try {
            var client = await connection('schedulings')
                .select("*")
                .where({ "deletedAt": null })
        } catch (err) {
            throw err

        }
        return client;

    },

    async getOneById(id) {
        try {
            var client = await connection('schedulings')
                .select("*")
                .where({ "id": id, "deletedAt": null })
                .first()
        } catch (err) {
            throw err

        }
        return client;
    },

    async getAllSpecificDay() {
        try {
            var client = await connection('schedulings')
                .select("*")
                .andWhereNot({ 'specificDay': null })
                .where({ "deletedAt": null })
        } catch (err) {
            throw err

        }
        return client;
    },

    async getAllWeekDays(id) {
        try {
            var client = await connection('schedulings')
                .select("*")
                .andWhereNot({ 'weekDays': null })
                .andWhere({ 'endDay': null })
                .where({ "deletedAt": null })
        } catch (err) {
            throw err

        }
        return client;
    },

    async getAllIntervalDays(id) {
        try {
            var client = await connection('schedulings')
                .select("*")
                .andWhereNot({ 'endDay': null })
                .andWhere({ 'weekDays': null })
                .where({ "deletedAt": null })
        } catch (err) {
            throw err

        }
        return client;
    },
    async getAllIntervalDaysAndWeekDays(id) {
        try {
            var client = await connection('schedulings')
                .select("*")
                .andWhereNot({ 'endDay': null, 'weekDays': null })
                .where({ "deletedAt": null })
        } catch (err) {
            throw err

        }
        return client;
    },

    async getOneById(id) {
        try {
            var client = await connection('schedulings')
                .select("*")
                .where({ "id": id, "deletedAt": null })
                .first()
        } catch (err) {
            throw err

        }
        return client;
    },


    async deleteOneById(id) {
        try {
            let data = moment().format();
            var client = await connection('schedulings')
                .update("deletedAt", moment().format("YYYY-MM-DD HH:mm:ss"))
                .where({ "id": id, "deletedAt": null })

        } catch (err) {
            throw err

        }
    },

    async updateOneById(id, atualiza) {
        try {
            var client = await connection('schedulings')
                .where({ "id": id, "deletedAt": null })
                .update(atualiza)

        } catch (err) {
            throw err
        }
        return client;
    },

    async insert(dados) {
        try {
            await connection('schedulings').insert(dados)
        } catch (err) {
            throw err
        }
    },




}