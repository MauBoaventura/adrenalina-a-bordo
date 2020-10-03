const DAOTripUsers = require('../database/DAO/DAOTripUsers')
const DAOTrip = require('../database/DAO/DAOTrip')
const DAOUser = require('../database/DAO/DAOUser')

module.exports = {
    async index(req, res) {
        const tripUsers = await DAOTripUsers.getAll()

        res.json(tripUsers)
    },

    async get(req, res) {
        const id = req.params.id;
        //Verifica se o id existe
        if (await DAOTripUsers.getOneById(id) == undefined) {
            return res.status(401).json({
                error: "TripUsers do not exist!"
            })
        }
        let tripUsers = await DAOTripUsers.getOneById(id);
        res.json(tripUsers)
    },

    async post(req, res) {

        const userId = req.userId;

        const tripsId = req.body.tripsId;
        const usersId = req.body.usersId;

        //Verifica se o tripsId existe
        let trip = await DAOTrip.getOneById(tripsId);
        if (trip == undefined) {
            return res.status(401).json({
                error: "Trip do not exist!"
            })
        }

        //Verifica se o usersId existe
        let user = await DAOUser.getOneById(usersId);
        if (user == undefined) {
            return res.status(401).json({
                error: "User do not exist!"
            })
        }

        if (user.cpf == userId) {
            //Insere no banco
            try {
                await DAOTripUsers.insert(req.body)
            } catch (error) {
                return res.status(400).send({ error: error })
            }
            return res.status(200).send()
        }
        return res.status(401).json({
            error: "Forbiden!"
        })
    },

    async delete(req, res) {
        const id = req.params.id;
        //Verifica se o id existe
        if (await DAOTripUsers.getOneById(id) == undefined) {
            return res.status(401).json({
                error: "TripUsers do not exist!"
            })
        }
        await DAOTripUsers.deleteOneById(id);

        res.status(204).send()
    }
};