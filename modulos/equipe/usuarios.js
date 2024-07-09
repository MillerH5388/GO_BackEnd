const validateAccessToken = require('../../middlewares/validateAccessToken')

class Usuarios{

    constructor(servicos)
    {

        this.servicos = servicos

        servicos.app.get('/equipe/usuarios', validateAccessToken(servicos.autenticacao), (req, res) => {

            this.lista_usuarios()
            res.status(200).send({ id: req.userId });

        });

        servicos.app.post('/equipe/usuarios', validateAccessToken(servicos.autenticacao), async (req, res) => {

            const log = await this.servicos.logs.registrar_log(req.userId, `Teste`, `teste`, req.ip)
            res.status(200).send({ id: req.userId });

        });

    }

    async lista_usuarios()
    {
        const usuarios = await this.servicos.mysql.query(`SELECT * FROM usuarios`, [], false)
    }

}
module.exports = Usuarios;