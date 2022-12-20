// server dependencies
const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
// createServer(app);
// const io = require('socket.io')(server);
const cors = require('cors');

// allow requests from specified origins
// const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }));

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

io.on()

server.listen(3001, function () {
    console.log('Listening on port 3001...');
});