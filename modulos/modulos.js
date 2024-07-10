const ModuloEquipe = require('./equipe/modulo')
const validateAccessToken = require('../middlewares/validateAccessToken')


class Modulos{

    constructor(servicos)
    {

        this.servicos = servicos
        this.modulo_equipe = new ModuloEquipe(servicos)

        servicos.app.get('/modulos/', validateAccessToken(servicos.autenticacao),  async (req, res) => {
            
            const modulos = await this.lista_modulos()
            res.status(200).send({ status: true, modulos });

        });

        servicos.app.get('/modulos/permissoes', validateAccessToken(servicos.autenticacao),  async (req, res) => {
            
            const permissoes = await this.lista_permissoes()
            res.status(200).send({ status: true, permissoes });

        });

    }

    async lista_modulos()
    {
        return new Promise(async (resolve,reject) => {
            const modulos = await this.servicos.mysql.query(`SELECT * FROM modulos`, [], false)
            resolve(modulos)
        })
    }

    async lista_permissoes()
    {
        return new Promise(async (resolve,reject) => {
            const permissoes = await this.servicos.mysql.query(`SELECT * FROM modulo_permissoes`, [], false)
            resolve(permissoes)
        })
    }

}
module.exports = Modulos;