const moment = require('moment-timezone');
const DAOScheduling = require('../database/DAO/DAOScheduling')

function verifySpecificDay(allSpecificDay, allWeekDays, allIntervalDays, allIntervalDaysAndWeekDays, specificDay, startTime, endTime) {
    const day = moment(specificDay, "YYYY-MM-DD")
    //CONFLITO DIA
    console.log("Verifica conflito:specificDay")
    allSpecificDay.forEach(element => {
        var dia = moment(element.specificDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').format('YYYY-MM-DD')
        if (day.format("YYYY-MM-DD") == dia) {
            console.log('Verifica Conflito de Horario')
            verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
        }
    });

    //CONFLITO SEMANA
    console.log("Verifica conflito:weekDays")
    allWeekDays.forEach(element => {
        //Separa em uma list ao dias da semana
        if (!Array.isArray(element.weekDays))
            element.weekDays = element.weekDays.split(",")

        element.weekDays.forEach(e => {
            //Dia da semana é o mesmo
            if (e == day.weekday()) {
                verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
            }
        })
    })

    console.log("Verifica conflito:allIntervalDays")
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

    console.log("Verifica conflito:allIntervalDaysandweekday")
    allIntervalDaysAndWeekDays.forEach(element => {
        //CONFLITO EM UM INTERVALO DE DIAS
        if (day.isBetween(startDay, endDay, undefined, "[]")) {
            verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
        }

        //OU

        //CONFLITO SEMANA
        var startDay = moment(element.startDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').format('YYYY-MM-DD HH:mm')
        var endDay = moment(element.endDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').format('YYYY-MM-DD HH:mm')

        if (!Array.isArray(element.weekDays))
            element.weekDays = element.weekDays.split(",")
        element.weekDays.forEach(e => {
            //Dia da semana é o mesmo
            if (e == day.weekday()) {
                verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
            }
        })

    })


}

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

module.exports = {
    async verificaConflito(type, startTime, endTime, specificDay, weekDays, startDay, endDay) {
        const allSpecificDay = await DAOScheduling.getAllSpecificDay();
        const allWeekDays = await DAOScheduling.getAllWeekDays();
        const allIntervalDays = await DAOScheduling.getAllIntervalDays();
        const allIntervalDaysAndWeekDays = await DAOScheduling.getAllIntervalDaysAndWeekDays();

        startTime = moment(startTime, 'HH:mm').toString()
        endTime = moment(endTime, 'HH:mm').toString()

        if (startTime > endTime || startTime == endTime) {
            throw 'startTime => endTime'
        }

        if (type == 'specificDay') {
            verifySpecificDay(allSpecificDay, allWeekDays, allIntervalDays, allIntervalDaysAndWeekDays, specificDay, startTime, endTime)
        }
        else {
            if (type === 'weekDays') {
                weekDays.forEach(dayWeek => {
                    // console.log(dayWeek)
                    allSpecificDay.forEach(element => {
                        var dia = moment(element.specificDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute')
                        if (dia.weekday() == dayWeek) {
                            console.log('Conflito com specificDay')
                            verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)

                        }
                    })

                    allWeekDays.forEach(element => {
                        //Transformar a string em array um unica vez
                        if (!Array.isArray(element.weekDays))
                            element.weekDays = element.weekDays.split(",")

                        element.weekDays.forEach(e => {
                            //Dia da semana é o mesmo
                            if (e == dayWeek) {
                                // console.log("Coincide no dia: " + e)
                                verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
                            }
                        })
                    })

                    allIntervalDays.forEach(element => {
                        var startDay = moment(element.startDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute')
                        var endDay = moment(element.endDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').add(1, 'days')


                        while (startDay < endDay) {
                            console.log(startDay.format('YYYY-MM-DD HH:mm'))

                            if (startDay.weekday() == dayWeek)
                                verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)

                            startDay.add(1, 'days')
                        }
                    })

                    allIntervalDaysAndWeekDays.forEach(element => {
                        var startDay = moment(element.startDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute')
                        var endDay = moment(element.endDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').add(1, 'days')


                        while (startDay < endDay) {
                            console.log(startDay.format('YYYY-MM-DD HH:mm'))

                            if (startDay.weekday() == dayWeek)
                                verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)

                            startDay.add(1, 'days')
                        }


                        if (!Array.isArray(element.weekDays))
                            element.weekDays = element.weekDays.split(",")

                        element.weekDays.forEach(e => {
                            //Dia da semana é o mesmo
                            if (e == dayWeek) {
                                verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
                            }
                        })
                    })
                })
            }
            else {
                if (type == 'intervalDays') {
                    startDay = moment(startDay, "YYYY-MM-DD")
                    endDay = moment(endDay, "YYYY-MM-DD").add(1, 'days')

                    while (startDay < endDay) {
                        specificDay = startDay
                        verifySpecificDay(allSpecificDay, allWeekDays, allIntervalDays, allIntervalDaysAndWeekDays, specificDay, startTime, endTime)

                        console.log(startDay.format('^^ YYYY-MM-DD HH:mm ^^'))
                        console.log('\n')
                        startDay.add(1, 'days')
                    }

                }
                else {
                    if (type == 'weekDaysAndIntervalDays') {
                        startDay = moment(startDay, "YYYY-MM-DD")
                        endDay = moment(endDay, "YYYY-MM-DD").add(1, 'days')

                        while (startDay < endDay) {
                            specificDay = startDay
                            verifySpecificDay(allSpecificDay, allWeekDays, allIntervalDays, allIntervalDaysAndWeekDays, specificDay, startTime, endTime)

                            console.log(startDay.format('^^ YYYY-MM-DD HH:mm ^^'))
                            console.log('\n')
                            startDay.add(1, 'days')
                        }

                        weekDays.forEach(dayWeek => {
                            // console.log(dayWeek)
                            allSpecificDay.forEach(element => {
                                var dia = moment(element.specificDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute')
                                if (dia.weekday() == dayWeek) {
                                    console.log('Conflito com specificDay')
                                    verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)

                                }
                            })

                            allWeekDays.forEach(element => {
                                //Transformar a string em array um unica vez
                                if (!Array.isArray(element.weekDays))
                                    element.weekDays = element.weekDays.split(",")

                                element.weekDays.forEach(e => {
                                    //Dia da semana é o mesmo
                                    if (e == dayWeek) {
                                        // console.log("Coincide no dia: " + e)
                                        verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
                                    }
                                })
                            })

                            allIntervalDays.forEach(element => {
                                var startDay = moment(element.startDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute')
                                var endDay = moment(element.endDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').add(1, 'days')


                                while (startDay < endDay) {
                                    console.log(startDay.format('YYYY-MM-DD HH:mm'))

                                    if (startDay.weekday() == dayWeek)
                                        verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)

                                    startDay.add(1, 'days')
                                }
                            })

                            allIntervalDaysAndWeekDays.forEach(element => {
                                var startDay = moment(element.startDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute')
                                var endDay = moment(element.endDay, "YYYY-MM-DD").add(new Date().getTimezoneOffset(), 'minute').add(1, 'days')


                                while (startDay < endDay) {
                                    console.log(startDay.format('YYYY-MM-DD HH:mm'))

                                    if (startDay.weekday() == dayWeek)
                                        verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)

                                    startDay.add(1, 'days')
                                }


                                if (!Array.isArray(element.weekDays))
                                    element.weekDays = element.weekDays.split(",")

                                element.weekDays.forEach(e => {
                                    //Dia da semana é o mesmo
                                    if (e == dayWeek) {
                                        verificaConflitoHorario(startTime, endTime, element.startTime, element.endTime)
                                    }
                                })
                            })
                        })
                    }

                }
            }
        }
    },

    insertSpecificDay(params) {
        console.log('insertSpecificDay')
    },

    insertIntervalDays(params) {

        console.log('insertIntervalDays')
    },

    insertWeekDays(params) {

        console.log('insertWeekDays')
    },

    insertIntervalDaysAndWeekDays(params) {
        console.log('insertIntervalDaysAndWeekDays')
    }

}
