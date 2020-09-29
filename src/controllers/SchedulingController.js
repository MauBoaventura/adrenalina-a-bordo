const connection = require('../database/connection')
const util = require('../util/uteis')
const DAOScheduling = require('../database/DAO/DAOScheduling')
// const moment = require('moment');
// moment.locale("pt-br");
const moment = require('moment-timezone');
const moment1 = require('moment-timezone');
function verificaConflitoHorario(startTime, endTime, eleStartTime, eleEndTime) {
    eleStartTime = moment(eleStartTime, 'HH:mm').toString()
    eleEndTime = moment(eleEndTime, 'HH:mm').toString()

    //Cobrindo um mesmo horario já exitente
    if (startTime == eleStartTime && endTime == eleEndTime) {
        //conflito
        console.log('conflito 0')
    }
    //StartTime está entre um horário reservado
    if (startTime > eleStartTime && startTime < eleEndTime) {
        //conflito
        console.log('conflito 1')
    }
    //EndTime está entre um horário reservado
    if (endTime > eleStartTime && endTime < eleEndTime) {
        //conflito
        console.log('conflito 2')
    }
    //Cobrindo um horario já exitente
    if (startTime <= eleStartTime && endTime >= eleEndTime) {
        //conflito
        console.log('conflito 3')
    }

}
async function verificaConflito(type, startTime, endTime, specificDay, weekDays, startDay, endDay) {
    const allSpecificDay = await DAOScheduling.getAllSpecificDay();
    const allWeekDays = await DAOScheduling.getAllWeekDays();
    const allIntervalDays = await DAOScheduling.getAllIntervalDays();
    const allIntervalDaysAndWeekDays = await DAOScheduling.getAllIntervalDaysAndWeekDays();

    const day = moment(specificDay, "YYYY-MM-DD")

    startTime = moment(startTime, 'HH:mm').toString()
    endTime = moment(endTime, 'HH:mm').toString()

    if (startTime > endTime || startTime == endTime) {
        throw 'startTime => endTime'
    }

    if (type == 'specificDay') {
        //CONFLITO DIA
        allSpecificDay.forEach(element => {
            var dia = moment(element.specificDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').format('YYYY-MM-DD')

            if (specificDay == dia) {
                console.log('Verifica Conflito de Horario')
                verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
            }
        });

        //CONFLITO SEMANA
        allWeekDays.forEach(element => {
            //Separa em uma list ao dias da semana
            element.weekDays = element.weekDays.split(",")

            element.weekDays.forEach(e => {
                //Dia da semana é o mesmo
                if (e == day.weekday()) {
                    // console.log("Coincide no dia: " + e)
                    verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
                }
            })
        })

        //CONFLITO EM UM INTERVALO DE DIAS
        allIntervalDays.forEach(element => {
            var startDay = moment(element.startDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').format('YYYY-MM-DD HH:mm')
            var endDay = moment(element.endDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').format('YYYY-MM-DD HH:mm')

            // console.log(startDay)
            // console.log(endDay)
            if (day.isBetween(startDay, endDay, undefined, "[]")) {
                console.log("Esta entre")
                verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
            }
        })

        allIntervalDaysAndWeekDays.forEach(element => {
            //CONFLITO EM UM INTERVALO DE DIAS
            if (day.isBetween(startDay, endDay, undefined, "[]")) {
                verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
            }

            //OU

            //CONFLITO SEMANA
            var startDay = moment(element.startDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').format('YYYY-MM-DD HH:mm')
            var endDay = moment(element.endDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').format('YYYY-MM-DD HH:mm')

            element.weekDays = element.weekDays.split(",")
            element.weekDays.forEach(e => {
                //Dia da semana é o mesmo
                if (e == day.weekday()) {
                    verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
                }
            })

        })




    } else {
        if (type === 'weekDays') {

        }
        else {
            if (type == 'intervalDays') {

            } else {
                if (type == 'weekDaysAndIntervalDays') {

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
            verificaConflito('specificDay', startTime, endTime, specificDay)
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