const express = require('express')
const routes = express.Router()

const UserController = require('./controllers/UserController')

// Corredores
routes.get('/', UserController.index)
// routes.get('/corredor/:id', RunnerController.get)
// routes.post('/corredor', [
//     validator.check('email').isEmail().withMessage('Is not a valid format!'),
//     validator.check('age').isISO8601().toDate(),
//     validator.check('gender').isIn(['Female', 'Male']),
//     validator.check('whatsapp').customSanitizer(value => {
//         return value.split("").filter(n => (Number(n) || n == 0)).join("");
//     }),

// ], RunnerController.create)
// routes.put('/corredor/:id', RunnerController.update)
// routes.delete('/corredor/:id', RunnerController.delete)

// Etapas

module.exports = routes