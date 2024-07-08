const jwt = require('jsonwebtoken');
const validateDto = require('../middlewares/validateDto');
const { loginDto } = require('../dto/autenticacao/loginDto');
class Autenticacao{

    constructor(app, secretKey, mysql, crypto)
    {
        this.secretKey = secretKey
        this.mysql = mysql
        this.crypto = crypto

        app.post('/login',validateDto(loginDto), async (req, res) => {

            const usuario = await this.verificar_credenciais(req.body.login, req.body.senha)

            if(!usuario)
            {
                res.status(200).send({ status: false, mensagem: 'Login ou Senha inválidos' });
                return
            } 

            const access_token = this.gerarTokendeAcesso({login: req.body.login, senha: req.body.senha})
            res.status(200).send({ status: true, access_token});

        });
    }

    async verificar_credenciais(login, senha)
    {
        return new Promise(async (resolve,reject) => {

            try {
                login = this.crypto.encrypt(login)
                senha = this.crypto.encrypt(senha)
                
                const usuario = await this.mysql.query(`SELECT * FROM usuarios WHERE login = ? and senha = ?`, [login, senha])
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

}
module.exports = Autenticacao;