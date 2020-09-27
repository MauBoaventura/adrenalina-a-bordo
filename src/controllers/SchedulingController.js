const connection = require('../database/connection')
const util = require('../util/uteis')
const DAOScheduling = require('../database/DAO/DAOScheduling')

module.exports = {
    async index(req, res) {

        const scheduling = await DAOScheduling.getAll()

        res.json(scheduling)
    },

    async get(req, res) {
        const id = req.params.id;
        //Verifica se o id existe
        let scheduling = await DAOScheduling.getOneById(id);
        if (scheduling == undefined) {
            return res.status(401).json({
                error: "Scheduling do not exist!"
            })
        }
        res.json(scheduling)
    },

    async post(req, res) {
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;

        const specificDay = req.body.specificDay;

        req.body.weekDays = req.body.weekDays.toString();
        
        const startDay = req.body.startDay;
        const endDay = req.body.endDay

        //Insere no banco
        try {
            await DAOScheduling.insert(req.body)
        } catch (error) {
            return res.status(400).send({ error: error })
        }
        res.status(200).send()
    },

    async delete(req, res) {
        const schedulingeheader = req.userId;
        const id = req.params.id;
        if (schedulingeheader == id) {
            //Verifica se o id existe
            if (await DAOScheduling.getOneById(id) == undefined) {
                return res.status(401).json({
                    error: "scheduling do not exist!"
                })
            }
            await DAOScheduling.deleteOneByid(id);

            res.status(204).send()

        } else {
            return res.status(401).json({
                error: "Access Denied!"
            })
        }

    },

    async update(req, res) {
        const schedulingeheader = req.userId;
        const id = req.params.id;

        if (schedulingeheader == id) {
            const scheduling = await DAOScheduling.getOneById(id)

            //Verifica se o id já esta sendo utilizado
            if (await DAOScheduling.getOneById(id) == undefined) {
                return res.status(401).json({
                    error: "scheduling do not exist!"
                })
            }

            if (req.body.id != schedulingeheader)
                //Verifica se o id novo já esta sendo utilizado
                if (await DAOScheduling.getOneById(req.body.id) != undefined) {
                    return res.status(401).json({
                        error: "New id already used!"
                    })
                }

            if (scheduling.email != req.body.email) {
                //Verifica se o email novo já esta sendo utilizado
                if (await util.existe_schedulinge_email(req.body.email)) {
                    return res.status(401).json({
                        error: "New email already used!"
                    })
                }
            }
            req.body.password = await util.criptografar(req.body.password)
            await DAOScheduling.updateOneByid(id, req.body)

            return res.status(200).send()
        } else {
            return res.status(401).json({
                error: "Access Denied!"
            })
        }

    }
};