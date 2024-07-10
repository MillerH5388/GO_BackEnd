const validateAccessToken = require('../../middlewares/validateAccessToken')
const validateDto = require('../../middlewares/validateDto');
const validatePermissao = require('../../middlewares/validatePermissao');
const { setoresDto } = require('../../dto/modulos/equipe/setoresDto');

class Setores{

    constructor(servicos)
    {
        this.servicos = servicos

        // ROTA DE ADICIONAR SETOR
        servicos.app.post('/equipe/setores', validateDto(setoresDto),  validateAccessToken(servicos.autenticacao), validatePermissao(servicos.autenticacao, 1),  async (req, res) => {
            
            const novo_setor = await this.adicionar_setor(req.body.nome)
            if(!novo_setor)
            {
                res.status(200).send({ status: false });
                return
            }

            const log = await this.servicos.logs.registrar_log(req.userId, `Adicionou o Setor: "${req.body.nome}" (${novo_setor.insertId}) `, `adicionou`, req.ip)
            res.status(200).send({ status: true, setor: { id: novo_setor.insertId } });

        });

    }

    async adicionar_setor(nome)
    {
        return new Promise(async (resolve,reject) => {

            const novo_setor = await this.servicos.mysql.query(`INSERT INTO setores (nome) VALUES (?)`, [nome], true)
            resolve(novo_setor)
        })
    }

}
module.exports = Setores;