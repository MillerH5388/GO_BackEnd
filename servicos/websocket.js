class WebSocket{

    constructor(server, app)
    {
        const io = require('socket.io')(server, { cors: { origin: '*' } });
    }

}
module.exports = WebSocket;