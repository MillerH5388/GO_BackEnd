require('dotenv').config();

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
	res.status(200).send({ message: 'Hello World' });
});


const server = require('http').createServer(app);

const WebSocket = require('./servicos/websocket');
const websocket = new WebSocket(server, app)

const Mysql = require('./servicos/mysql');
const mysql = new Mysql(process.env.DB_HOST, process.env.DB_PASSWORD, process.env.DB_USER, process.env.DB_DATABASE)

const Crypto = require('./servicos/crypto')
const crypto = new Crypto(app, process.env.SECRET_KEY)

const Autenticacao = require('./servicos/autenticacao')
const autenticacao = new Autenticacao(app, process.env.SECRET_KEY, mysql, crypto)

const servicos = {app, mysql, websocket, crypto, autenticacao}


// Modulos
const ModuloEquipe = require('./modulos/equipe/modulo')
const moduloEquipe = new ModuloEquipe(servicos)

server.listen(process.env.PORT, async () => 
{
    console.log(`Aplicação rodando na porta ${process.env.PORT}`)
})