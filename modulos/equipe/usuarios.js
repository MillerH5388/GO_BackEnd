const validateAccessToken = require('../../middlewares/validateAccessToken')

class Usuarios{

    constructor(servicos)
    {

        this.servicos = servicos

        servicos.app.post('/equipe/usuarios', servicos.multer_upload.any(), validateAccessToken(servicos.autenticacao), async (req, res) => {

            const upload = await this.servicos.upload.upload_file('../uploads/usuarios',req.files[0])

            console.log(upload)

            res.status(200).send({ status: true });

        });

    }

    async lista_usuarios()
    {
        const usuarios = await this.servicos.mysql.query(`SELECT * FROM usuarios`, [], false)
    }

}
module.exports = Usuarios;