const Usuarios = require('./usuarios/usuarios')

class ModuloEquipe{

    constructor(servicos)
    {
        this.usuarios = new Usuarios(servicos)
    }

}
module.exports = ModuloEquipe;