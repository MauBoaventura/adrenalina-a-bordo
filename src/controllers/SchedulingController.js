const util = require('../util/uteis')
const verifica = require('../util/verificaConflitos')
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
        try {

            const startTime = req.body.startTime;
            const endTime = req.body.endTime;

            const specificDay = req.body.specificDay;

            const weekDays = req.body.weekDays;
            if (weekDays != undefined)
                req.body.weekDays = req.body.weekDays.toString();

            const startDay = req.body.startDay;
            const endDay = req.body.endDay
            const vehicle = req.body.vehicle

            //Inserir em um dia específico
            if (specificDay != undefined) {
                await verifica.verificaConflito('specificDay', startTime, endTime, specificDay, null, null, null, vehicle)
                delete req.body.startDay
                delete req.body.endDay
                delete req.body.weekDays

            } else {
                //Inserir em um intervalo de dias
                if (weekDays == undefined) {
                    verifica.verificaConflito('intervalDays', startTime, endTime, null, null, startDay, endDay, vehicle)
                    delete req.body.weekDays
                    delete req.body.specificDay
                }
                else {
                    //Inserir em dias da semana (infinity)
                    if (endDay == undefined) {
                        verifica.verificaConflito('weekDays', startTime, endTime, null, weekDays, null, null, vehicle)
                        delete req.body.startDay
                        delete req.body.endDay
                        delete req.body.specificDay
                    }
                    //Inserir em dias da semana em um intervalo de dias
                    else {
                        verifica.verificaConflito('weekDaysAndIntervalDays', startTime, endTime, null, weekDays, startDay, endDay, vehicle)
                        delete req.body.specificDay
                    }
                }
            }
        } catch (error) {
            return res.status(400).send({ error: error })
        }

        delete req.body.vehicle

        //Insere no banco
        try {
            await DAOScheduling.insert(req.body)
        } catch (error) {
            return res.status(401).send({ error: error })
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