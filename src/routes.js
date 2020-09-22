const express = require('express')
const routes = express.Router()

const UserController = require('./controllers/UserController')

// Corredores
routes.post('/cadastro', UserController.cadastro)
routes.get('/cliente', UserController.index)
routes.post('/login', UserController.get)

module.exports = routes