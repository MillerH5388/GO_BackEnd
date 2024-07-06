require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());


app.get('/', (req, res) => {
	res.status(200).send({ message: 'Hello World' });
});


const server = require('http').createServer(app);


const WebSocket = require('./services/websocket');
const websocket = new WebSocket(server, app)

server.listen(process.env.PORT, async () => 
{
    console.log(`Aplicação rodando na porta ${process.env.PORT}`)
})