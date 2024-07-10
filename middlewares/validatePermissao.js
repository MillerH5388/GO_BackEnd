function validatePermissao(autenticacao, id_permissao)
{
    return async function (req, res, next) {

        const permissao = await autenticacao.verificarPermissaoUsuario(req.userId, id_permissao)
        if(!permissao)
        {
            return res.status(401).json({ message: 'Esse usuário não tem permissão para essa ação' });
        }

        next();

    }
}
module.exports = validatePermissao;