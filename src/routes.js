const express = require('express')
const routes = express.Router()

const UserController = require('./controllers/UserController')
const LoginController = require('./controllers/LoginController')

// Corredores
routes.post('/cadastro', UserController.cadastro)
routes.get('/cliente', UserController.index)

//Login
routes.post('/login', LoginController.login)

module.exports = routes