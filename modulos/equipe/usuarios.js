const validateAccessToken = require('../../middlewares/validateAccessToken')
const validateDto = require('../../middlewares/validateDto');
const { usuariosDto } = require('../../dto/modulos/equipe/usuariosDto');

class Usuarios{

    constructor(servicos)
    {

        this.servicos = servicos

        servicos.app.post('/equipe/usuarios', servicos.multer_upload.any(), validateDto(usuariosDto), validateAccessToken(servicos.autenticacao), async (req, res) => {

            const foto = this.servicos.upload.verifica_foto_body(req.files, 'foto')
            if(foto && !this.servicos.upload.isImageFile(foto))
            {
                res.status(200).send({ status: false, mesagem: 'O arquivo Foto não é uma imagem' });
                return
            }

            const usuario = await this.servicos.autenticacao.verificar_credenciais(req.body.login, req.body.senha)
            if(usuario)
            {
                res.status(200).send({ status: false, mesagem: 'Credenciais de acesso já estão sendo utilizadas' });
                return
            }
            
            const novo_usuario = await this.adicionar_usuario(req.body.nome, foto, req.body.login, req.body.senha)
            if(!novo_usuario)
            {
                res.status(200).send({ status: false, mesagem: 'Não foi possível criar um novo usuário' });
                return
            }

            const log = await this.servicos.logs.registrar_log(req.userId, `Adicionou o Usuário: "${req.body.nome}" (${novo_usuario.insertId}) `, `adicionou`, req.ip)

            res.status(200).send({ status: true, usuario: {id: novo_usuario.insertId} });

        });

    }

    async adicionar_usuario(nome, foto, login, senha)
    {
        return new Promise(async (resolve,reject) => {
            
            let link_foto = null
            if(foto)
            {
                link_foto = await this.servicos.upload.upload_file('../uploads/foto_usuarios', foto)
            }
            
            login = this.servicos.crypto.encrypt(login)
            senha = this.servicos.crypto.encrypt(senha)

            const novo_usuario = await this.servicos.mysql.query(`INSERT INTO usuarios (nome, foto, login, senha) VALUES (?, ?, ?, ?)`, [nome, link_foto, login, senha], true)
            resolve(novo_usuario)

        })
    }

    async lista_usuarios()
    {
        const usuarios = await this.servicos.mysql.query(`SELECT * FROM usuarios`, [], false)
    }

}
module.exports = Usuarios;