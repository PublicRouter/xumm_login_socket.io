// server dependencies
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');

// allow requests from specified origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

io.on('connection', function (socket) {
    console.log("another user joined: ", socket.id);

    socket.on("disconnect", (reason) => {
        console.log("disconnected user: ", socket.id, " ; ", reason )
    });    
});

server.listen(3001, function () {
    console.log('Listening on port 3001...');
});