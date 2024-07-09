const Usuarios = require('./usuarios')
const Setores = require('./setores')

class ModuloEquipe{

    constructor(servicos)
    {
        this.usuarios = new Usuarios(servicos)
        this.setores = new Setores(servicos)
    }

}
module.exports = ModuloEquipe;