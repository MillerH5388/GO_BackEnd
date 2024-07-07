const mysql = require('mysql2');
class MySQL{

    constructor(host, password, user, database, port) {

        this.host = host;
        this.password = password;
        this.user = user;
        this.port = port
        this.database = database;

        this.connect()

        this.conexao.on('error', (err) => {
            console.error('MYSQL error:', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('Conexão MYSQL perdida')
                this.connect()
            } else {
              throw err;
            }
        });

    }

    connect()
    {
        this.conexao = mysql.createConnection({host : this.host,user: this.user,password: this.password,database: this.database,port: this.port});
        this.conexao.connect((err) => {
            if(! err) console.log("Conexão no MYSQL estabelecida com sucesso.")
            else{
                console.log("Conexão no MYSQL não estabelecida.")
                console.log(err)
            } 
        })
    }

}
module.exports = MySQL;