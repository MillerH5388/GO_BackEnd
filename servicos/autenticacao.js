const jwt = require('jsonwebtoken');
const validateDto = require('../middlewares/validateDto');
const { loginDto } = require('../dto/autenticacao/loginDto.js');
class Autenticacao{

    constructor(app, secretKey, mysql, crypto, jsonParser)
    {
        this.secretKey = secretKey
        this.mysql = mysql
        this.crypto = crypto

        app.post('/login',jsonParser, validateDto(loginDto), async (req, res) => {

            const usuario = await this.verificar_credenciais(req.body.login, req.body.senha)

            if(!usuario)
            {
                res.status(200).send({ status: false, mensagem: 'Login ou Senha inválidos' });
                return
            } 

            const access_token = this.gerarTokendeAcesso({login: req.body.login, senha: req.body.senha})
            res.status(200).send({ status: true, access_token});

        });

        app.get('/autenticacao_access_token', async (req, res) => {

            const access_token = req.query.access_token
            const usuario = await this.verificarTokendeAcesso(access_token)

            if(!usuario)
            {
                res.status(200).send({ status: false});
            }
            else
            {
                res.status(200).send({ status: true, usuario});
            }

        })

    }

    async verificar_credenciais(login, senha)
    {
        return new Promise(async (resolve,reject) => {

            try {
                login = this.crypto.encrypt(login)
                senha = this.crypto.encrypt(senha)
                
                const usuario = await this.mysql.query(`SELECT * FROM usuarios WHERE login = ? and senha = ? and del = 0 and status = 1`, [login, senha], false, false)
                resolve(usuario)

            } catch (error) {
                resolve(false)
            }

        });
    }

    gerarTokendeAcesso(payload) {
        return jwt.sign(payload, this.secretKey);
    }

    async verificarTokendeAcesso(token)
    {
        return new Promise(async (resolve,reject) => {
            jwt.verify(token, this.secretKey, async (err, decoded) => {

                try {
                    if(err) resolve(false)
                    const usuario = await this.verificar_credenciais(decoded.login, decoded.senha)
                    if(!usuario) resolve(false)
                    resolve(usuario)
                    
                } catch (error) {
                    resolve(false)
                }

            });
        })
    }

    async verificarPermissaoUsuario(id_usuario, id_permissao)
    {
        return new Promise(async (resolve,reject) => {
            const permissao = await this.mysql.query(`SELECT id FROM modulo_permissoes_usuarios WHERE id_modulo_permissao = ? and id_usuario = ? LIMIT 1`, [id_permissao, id_usuario], false, false)
            resolve(permissao)
        })
    }


    // Gestão de Permissões
    async adicionar_permissao_usuario(id_usuario, id_permissao)
    {
        return new Promise(async (resolve,reject) => {
            const nova_permissao = await this.mysql.query(`INSERT INTO modulo_permissoes_usuarios (id_modulo_permissao, id_usuario) VALUES (?, ?)`, [id_permissao, id_usuario], true, false)
            resolve(nova_permissao)
        })
    }

    async remover_permissao_usuario(id_usuario, id_permissao)
    {
        return new Promise(async (resolve,reject) => {
            const delete_permissao = await this.mysql.query(`DELETE FROM modulo_permissoes_usuarios WHERE id_modulo_permissa = ? and id_usuario = ?`, [id_permissao, id_usuario], false, false)
            resolve(delete_permissao)
        })
    }

    async listar_permissoes_usuario(id_usuario)
    {
        return new Promise(async (resolve,reject) => {
            const permissoes = await this.mysql.query(`SELECT mp.id, mp.acao FROM modulo_permissoes_usuarios mpu INNER JOIN modulo_permissoes mp ON mp.id = mpu.id_modulo_permissao WHERE mpu.id_usuario = ?`, [id_usuario], false, true)
            resolve(permissoes)
        })
    }

}
module.exports = Autenticacao;