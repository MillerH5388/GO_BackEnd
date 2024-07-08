class Usuarios{

    constructor(servicos)
    {

        this.servicos = servicos

        servicos.app.get('/equipe/usuarios', (req, res) => {

            this.lista_usuarios()
            res.status(200).send({ 'teste': '123' });

        });

    }

    async lista_usuarios()
    {
        console.log('Buscando usuarios')
        const usuarios = await this.servicos.mysql.query(`SELECT * FROM usuarios`, [])
        console.log(usuarios)
    }

}
module.exports = Usuarios;