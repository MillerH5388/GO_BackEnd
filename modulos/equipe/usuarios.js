const validateAccessToken = require('../../middlewares/validateAccessToken')
const validateDto = require('../../middlewares/validateDto');
const { usuariosDto } = require('../../dto/modulos/equipe/usuariosDto');

class Usuarios{

    constructor(servicos)
    {

        this.servicos = servicos

        // Criar Usuario
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
            
            const novo_usuario = await this.adicionar_usuario(req.body.nome, foto, req.body.login, req.body.senha, req.body.setores, req.body.permissoes)
            if(!novo_usuario)
            {
                res.status(200).send({ status: false, mesagem: 'Não foi possível criar um novo usuário' });
                return
            }

            const log = await this.servicos.logs.registrar_log(req.userId, `Adicionou o Usuário: "${req.body.nome}" (${novo_usuario.insertId}) `, `adicionou`, req.ip)

            res.status(200).send({ status: true, usuario: {id: novo_usuario.insertId} });

        });

        // Deletar um usuario
        servicos.app.delete('/equipe/usuarios', validateAccessToken(servicos.autenticacao), async (req, res) => {

            const id_usuario = req.query.id
            if(!id_usuario || id_usuario == 1) 
            {
                res.status(200).send({ status: false, mesagem: 'ID não informado' });
                return
            }

            
            const remove_usuario = await this.remover_usuario(id_usuario)
            if(remove_usuario)
            {
                const usuario = await this.lista_usuario(id_usuario)
                const log = await this.servicos.logs.registrar_log(req.userId, `Deletou o Usuário: "${usuario.nome}" (${id_usuario}) `, `deletou`, req.ip)
            }

            res.status(200).send({ status: true });

        });

        // Listar Usuarios
        servicos.app.get('/equipe/usuarios', validateAccessToken(servicos.autenticacao), async (req, res) => {

            const usuarios = await this.lista_usuarios()
            res.status(200).send({ status: true, usuarios });

        });

    }

    async adicionar_usuario(nome, foto, login, senha, setores, permissoes)
    {
        return new Promise(async (resolve,reject) => {
            
            let link_foto = null
            if(foto)
            {
                link_foto = await this.servicos.upload.upload_file('../uploads/foto_usuarios', foto)
            }
            
            login = this.servicos.crypto.encrypt(login)
            senha = this.servicos.crypto.encrypt(senha)

            const novo_usuario = await this.servicos.mysql.query(`INSERT INTO usuarios (nome, foto, login, senha) VALUES (?, ?, ?, ?)`, [nome, link_foto, login, senha], true, false)

            if(!novo_usuario) resolve(novo_usuario)
            
            for (let index = 0; index < setores.length; index++) {

                const setor = setores[index];
                await this.adicionar_usuario_setor(novo_usuario.insertId, setor)
                
            }

            for (let index = 0; index < permissoes.length; index++) {

                const permissao = permissoes[index];
                await this.servicos.autenticacao.adicionar_permissao_usuario(novo_usuario.insertId, permissao)
            }
            

            resolve(novo_usuario)

        })
    }

    async lista_usuario(id_usuario)
    {
        return new Promise(async (resolve,reject) => {
            const usuario = this.servicos.mysql.query(`SELECT * FROM usuarios WHERE id = ?`, [id_usuario, false, false])
            resolve(usuario)
        })
    }

    async remover_usuario(id_usuario)
    {
        return new Promise(async (resolve,reject) => {
            const remove_usuario = this.servicos.mysql.query(`UPDATE usuarios SET status = 0, del = 1 WHERE id = ?`, [id_usuario, true, false])
            resolve(remove_usuario)
        })
    }

    async lista_usuarios()
    {
        return new Promise(async (resolve,reject) => {
            const usuarios = await this.servicos.mysql.query(`SELECT * FROM usuarios WHERE del = 0`, [], false, true)
            for (let index = 0; index < usuarios.length; index++) {

                const usuario = usuarios[index];
                usuario.login = this.servicos.crypto.decrypt(usuario.login)
                usuario.senha = this.servicos.crypto.decrypt(usuario.senha)
                usuario.setores = await this.lista_setores_usuario(usuario.id)
                usuario.permissoes = await this.servicos.autenticacao.listar_permissoes_usuario(usuario.id)
                
            }
            resolve(usuarios)
        })
    }

    // Funções destinadas a Setores

    // Recupera todos os setores de um usuario
    async lista_setores_usuario(id_usuario)
    {
        return new Promise(async (resolve,reject) => {
            const setores = await this.servicos.mysql.query(`SELECT s.id, s.nome FROM usuarios_setores us INNER JOIN setores s ON s.id = us.id_setor WHERE us.id_usuario = ?`,[id_usuario], false, true);
            resolve(setores ? setores : [])
        })
    }

    // Adiciona um usuario a um setor
    async adicionar_usuario_setor(id_usuario, id_setor)
    {
        return new Promise(async (resolve,reject) => {

            const novo_setor_usuario = await this.servicos.mysql.query(`INSERT INTO usuarios_setores (id_setor, id_usuario) VALUES (?, ?)`,[id_setor, id_usuario], true, false);
            resolve(novo_setor_usuario)

        })
    }

    // Deleta um usuario de um setor
    async remove_usuario_setor(id_usuario, id_setor)
    {
        return new Promise(async (resolve,reject) => {
            const novo_setor_usuario = await this.servicos.mysql.query(`DELETE FROM usuarios_setores WHERE id_setor = ? and id_usuario = ?`,[id_setor, id_usuario], true, false);
            resolve(novo_setor_usuario)
        })
    }



}
module.exports = Usuarios;