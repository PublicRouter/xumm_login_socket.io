const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const { initializeSocketEvents } = require('./socketHandlers');
const { errorHandlerMiddleware } = require('./middlewares');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8,
});

const serverState = {
    connectedUsers: [],
    loggedInUsers: []
};

initializeSocketEvents(io, serverState);
// app.use(errorHandlerMiddleware);

server.listen(process.env.PORT || 3001, function () {
    console.log(`Listening on port ${process.env.PORT || 3001}...`);
});
