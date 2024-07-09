class Logs{

    constructor(mysql)
    {
        this.mysql = mysql
    }

    async registrar_log(id_usuario, descricao, tipo, ip)
    {
        let log = await this.mysql.query(`INSERT INTO logs_adm (id_usuario, descricao, tipo, ip) VALUES (?, ?, ?, ?)`, [id_usuario, descricao, tipo, ip], true)
        return log
    }

}
module.exports = Logs;