const DAOTrip = require('../database/DAO/DAOTrip')
const DAOScheduling = require('../database/DAO/DAOScheduling')
const DAOVehicle = require('../database/DAO/DAOVehicle')

module.exports = {
    async index(req, res) {
        const trip = await DAOTrip.getAll()

        res.json(trip)
    },

    async get(req, res) {
        const id = req.params.id;
        //Verifica se o id existe
        if (await DAOTrip.getOneById(id) == undefined) {
            return res.status(401).json({
                error: "Trip do not exist!"
            })
        }
        let trip = await DAOTrip.getOneById(id);
        res.json(trip)
    },

    async post(req, res) {
        const vehicleId = req.body.vehicleId;
        const schedulingId = req.body.schedulingId;

        //Verifica se o vehicleId existe
        let vehicle = await DAOVehicle.getOneById(vehicleId);
        if (vehicle == undefined) {
            return res.status(401).json({
                error: "Vehicle do not exist!"
            })
        }

        //Verifica se o schedulingId existe
        let scheduling = await DAOScheduling.getOneById(schedulingId);
        if (scheduling == undefined) {
            return res.status(401).json({
                error: "Scheduling do not exist!"
            })
        }


        //Insere no banco
        try {
            await DAOTrip.insert(req.body)
        } catch (error) {
            res.status(400).send({ error: error })
        }
        res.status(200).send()
    },

    async delete(req, res) {
        const id = req.params.id;
        //Verifica se o id existe
        if (await DAOTrip.getOneById(id) == undefined) {
            return res.status(401).json({
                error: "Trip do not exist!"
            })
        }
        await DAOTrip.deleteOneById(id);

        res.status(204).send()
    }
};