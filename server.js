// server dependencies
const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

const createSignin = require('./serverHelpers/createXummSignin');
const subscribeTo = require('./serverHelpers/subscribeToSignin');

app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});

let serverState = {
    connectedUsers: []
}

io.on('connection', function (socket) {
    console.log(socket.id, "has joined the server.");
    serverState.connectedUsers.push(socket.id);
    console.log("New user list: ", serverState.connectedUsers)

    socket.on("disconnect", (reason) => {
        console.log(socket.id, "has left the server. Reason: ", reason )
        serverState.connectedUsers.pop(socket.id)
        console.log("New user list: ", serverState.connectedUsers)
    });
    
});

io.on('newSignIn', async () => {
    const signInObj = await createSignin();
    console.log(`
    SignIn Payload Links:
    Xumm URL: ${signInObj.qrLink},
    Qr PNG: ${signInObj.qrImage}
    `)
})

io.on()

server.listen(3001, function () {
    console.log('Listening on port 3001...');
});