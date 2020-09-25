const express = require('express')
const routes = express.Router()
const authentication = require('./util/authentication')

const LoginController = require('./controllers/LoginController')
const UserController = require('./controllers/UserController')
const SchedulingController = require('./controllers/SchedulingController')

//Login
routes.post('/login', LoginController.login)

// Usuarios (User)
routes.get('/user', UserController.index)
routes.get('/user/:cpf', UserController.get)
routes.post('/user', UserController.post)
routes.put('/user/:cpf', authentication.verificacaoJWT, UserController.update)
routes.delete('/user/:cpf', authentication.verificacaoJWT, UserController.delete)

// Agendamento (Scheduling)
routes.get('/scheduling', SchedulingController.index)
routes.get('/scheduling/:cpf', SchedulingController.get)
routes.post('/scheduling', SchedulingController.post)
routes.put('/scheduling/:cpf', authentication.verificacaoJWT, SchedulingController.update)
routes.delete('/scheduling/:cpf', authentication.verificacaoJWT, SchedulingController.delete)


module.exports = routes