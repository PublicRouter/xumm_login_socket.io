const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const morgan = require('morgan');
// const mongooseConnect = require('./database/mongoose')
require('dotenv').config();

const { initializeSocketEvents } = require('./socketHandlers');
const { errorHandlerMiddleware } = require('./middlewares');

const app = express();
app.use(cors());

// Connect to MongoDB
// mongooseConnect().then(db => console.log("DB on server: ", db.connections[0].db));

app.use(morgan('combined'));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

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
