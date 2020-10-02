const DAOVehicle = require('../database/DAO/DAOVehicle')

module.exports = {
    async index(req, res) {

        const vehicle = await DAOVehicle.getAll()

        res.json(vehicle)
    },
    async get(req, res) {
        const id = req.params.id;
        //Verifica se o id existe
        if (await DAOVehicle.getOneById(id) == undefined) {
            return res.status(401).json({
                error: "Vehicle do not exist!"
            })
        } else {
            let vehicle = await DAOVehicle.getOneById(id);
            res.json(vehicle)
        }
    },

    async post(req, res) {
        //Insere no banco
        try {
            await DAOVehicle.insert(req.body)
        } catch (error) {
            res.status(400).send({ error: error })
        }
        res.status(200).send()
    },

    async delete(req, res) {
        const id = req.params.id;
        //Verifica se o id existe
        if (await DAOVehicle.getOneById(id) == undefined) {
            return res.status(401).json({
                error: "Vehicle do not exist!"
            })
        }
        await DAOVehicle.deleteOneById(id);

        res.status(204).send()
    },

    async update(req, res) {
        const id = req.params.id;
        await DAOVehicle.updateOneById(id, req.body)

        return res.status(200).send()
    }
};