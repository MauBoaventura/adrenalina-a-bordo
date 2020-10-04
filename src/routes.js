const express = require('express')
const routes = express.Router()
const authentication = require('./util/authentication')

const LoginController = require('./controllers/LoginController')
const UserController = require('./controllers/UserController')
const SchedulingController = require('./controllers/SchedulingController')
const VehicleController = require('./controllers/VehicleController')
const TripController = require('./controllers/TripController')
const TripUsersController = require('./controllers/TripUsersController')

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
routes.get('/scheduling/:id', SchedulingController.get)
routes.post('/scheduling', SchedulingController.post)
routes.put('/scheduling/:id', authentication.verificacaoJWT, SchedulingController.update)
routes.delete('/scheduling/:id', authentication.verificacaoJWT, SchedulingController.delete)

// Meio de transporte (Vehicle)
routes.get('/vehicle', VehicleController.index)
routes.get('/vehicle/:id', VehicleController.get)
routes.post('/vehicle', VehicleController.post)
routes.put('/vehicle/:id', authentication.verificacaoJWT, VehicleController.update)
routes.delete('/vehicle/:id', authentication.verificacaoJWT, VehicleController.delete)

// Viagem (Trip)
routes.get('/trip', TripController.index)
routes.get('/trip/:id', TripController.get)
routes.post('/trip', TripController.post)
routes.delete('/trip/:id', authentication.verificacaoJWT, TripController.delete)

// Usuario nas viagens (Trip_users)
routes.get('/tripusers', TripUsersController.index)
routes.get('/tripusers/:id', TripUsersController.get)
routes.post('/tripusers',authentication.verificacaoJWT, TripUsersController.post)
routes.delete('/tripusers/:id', authentication.verificacaoJWT, TripUsersController.delete)

module.exports = routes