function validateAccessToken(autenticacao)
{
    return async function (req, res, next) {

        const authHeader  = req.headers['authorization'];

        if (!authHeader) {
            return res.status(403).json({ message: 'Token não fornecido' });
        }

        const access_token = authHeader.split(' ')[1];
        const usuario = await autenticacao.verificarTokendeAcesso(access_token)
        if(!usuario) return res.status(403).json({ message: 'Permissão negada.' });

        req.userId = usuario.id
        next();

    }
}
module.exports = validateAccessToken;