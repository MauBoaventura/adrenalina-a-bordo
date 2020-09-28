const connection = require('../database/connection')
const util = require('../util/uteis')
const DAOScheduling = require('../database/DAO/DAOScheduling')
const moment = require('moment');
moment.locale("pt-br");

async function verificaConflito(type, startTime, endTime, specificDay, weekDays, startDay, endDay) {
    const allSpecificDay = await DAOScheduling.getAllSpecificDay();
    const allWeekDays = await DAOScheduling.getAllWeekDays();
    const allIntervalDays = await DAOScheduling.getAllIntervalDays();
    const allIntervalDaysAndWeekDays = await DAOScheduling.getAllIntervalDaysAndWeekDays();


    if (startTime > endTime) {
        throw 'startTime > endTime'
    }

    if (type == 'specificDay') {
        allSpecificDay.forEach(element => {
            // console.log(moment(element.specificDay, "YYYY-MM-DD").format('YYYY-MM-DD'))
            // console.log(moment(moment.unix(), "DD-MM-YYYY"))
            console.log(moment(element.specificDay, "YYYY-MM-DD"))
            console.log(specificDay)
            
            if (specificDay == moment(element.specificDay, "YYYY-MM-DD").format('YYYY-MM-DD')) {
                console.log('Entrou')
                //StartTime está entre um horário reservado
                if (startTime > element.startTime && startTime < element.endTime) {
                    //conflito
                    console.log('conflito 1')
                }
                //EndTime está entre um horário reservado
                if (endTime > element.startTime && endTime < element.endTime) {
                    //conflito
                    console.log('conflito 2')
                }
                //Cobrindo um horario já exitente
                if (startTime < element.startTime && endTime > element.endTime) {
                    //conflito
                    console.log('conflito 3')
                }
            }
        });

        let dayOfWeek = moment(specificDay, "YYYY-MM-DD")
        // console.log(specificDay);
        // console.log(dayOfWeek);

        allWeekDays.forEach(element => {
            //moment(e, "DD-MM-YYYY")
        })



    } else {
        if (type === 'weekDays') {

        }
        else {
            if (type == 'intervalDays') {

            } else {
                if (type=='weekDaysAndIntervalDays'){

                }

            }
        }
    }
}

function insertSpecificDay(params) {
    console.log('insertSpecificDay')
}

function insertIntervalDays(params) {

    console.log('insertIntervalDays')
}

function insertWeekDays(params) {

    console.log('insertWeekDays')
}

function insertIntervalDaysAndWeekDays(params) {
    console.log('insertIntervalDaysAndWeekDays')
}
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

        const weekDays = req.body.weekDays;
        if (weekDays != undefined)
            req.body.weekDays = req.body.weekDays.toString();

        const startDay = req.body.startDay;
        const endDay = req.body.endDay

        //Inserir em um dia específico
        if (specificDay != undefined) {
            verificaConflito('specificDay', startTime, endTime, specificDay, weekDays, startDay, endDay)
            insertSpecificDay()
        } else {
            //Inserir em um intervalo de dias
            if (weekDays == undefined) {
                verificaConflito('intervalDays', startTime, endTime, startDay, endDay)
                insertIntervalDays()
            }
            else {
                //Inserir em dias da semana (infinity)
                if (endDay == undefined) {
                    verificaConflito('weekDays', startTime, endTime, weekDays)
                    insertWeekDays()
                }
                //Inserir em dias da semana em um intervalo de dias
                else {
                    verificaConflito('weekDaysAndIntervalDays', startTime, endTime, weekDays, startDay, endDay)

                    insertIntervalDaysAndWeekDays()
                }
            }
        }





        //Insere no banco
        // try {
        //     await DAOScheduling.insert(req.body)
        // } catch (error) {
        //     return res.status(400).send({ error: error })
        // }
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