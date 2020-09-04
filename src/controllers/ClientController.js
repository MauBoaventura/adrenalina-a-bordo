// const connection = require('../database/connection')
// const util = require('../util/uteis')
// const DAO_Client = require('../database/DAO/DAOClient')

module.exports = {
    async index(req, res) {

        // const client = await DAO_Client.getAll()

        res.json("client")
    },

    async get(req, res) {
        const cpf = req.params.cpf;

        const client = await DAO_Client.getOneByCPF(cpf)
        if (client == undefined)
            return res.status(401).json({
                error: "Client do not exist"
            })
        res.json(client)
    },

    async post(req, res) {
        const cpf = req.body.cpf;
        const email = req.body.email;

        //Verifica se o cpf já esta sendo utilizado
        if (await util.existe_Cliente_cpf(cpf)) {
            return res.status(401).json({
                error: "Cpf already used!"
            })
        }

        //Verifica se o email já esta sendo utilizado
        if (await util.existe_Cliente_email(email)) {
            return res.status(401).json({
                error: "Email already used!"
            })
        }

        //Insere no banco
        try {
            req.body.password = await util.criptografar(req.body.password)
            await DAO_Client.insert(req.body)
        } catch (error) {
            res.status(400).send({ error: error })
        }
        res.status(200).send()
    },

    async delete(req, res) {
        const cliente_header = req.userId;
        const cpf = req.params.cpf;
        if (cliente_header == cpf) {
            //Verifica se o cpf existe
            if (! await util.existe_Cliente_cpf(cpf)) {
                return res.status(401).json({
                    error: "Client do not exist!"
                })
            }
            await DAO_Client.deleteOneByCPF(cpf);

            res.status(204).send()

        } else {
            return res.status(401).json({
                error: "Access Denied!"
            })
        }

    },

    async update(req, res) {
        const cliente_header = req.userId;
        const cpf = req.params.cpf;

        if (cliente_header == cpf) {
            const client = await DAO_Client.getOneByCPF(cpf)

            //Verifica se o cpf já esta sendo utilizado
            if (!await util.existe_Cliente_cpf(cpf)) {
                return res.status(401).json({
                    error: "Client do not exist!"
                })
            }

            if (req.body.cpf != cliente_header)
                //Verifica se o cpf novo já esta sendo utilizado
                if (await util.existe_Cliente_cpf(req.body.cpf)) {
                    return res.status(401).json({
                        error: "New CPF already used!"
                    })
                }

            if (client.email != req.body.email) {
                //Verifica se o email novo já esta sendo utilizado
                if (await util.existe_Cliente_email(req.body.email)) {
                    return res.status(401).json({
                        error: "New email already used!"
                    })
                }
            }
            req.body.password = await util.criptografar(req.body.password)
            await DAO_Client.updateOneByCPF(cpf, req.body)

            return res.status(200).send()
        } else {
            return res.status(401).json({
                error: "Access Denied!"
            })
        }

    }
};