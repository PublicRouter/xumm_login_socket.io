// server dependencies
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

require('dotenv').config();


const createSignin = require('./serverHelpers/createXummSignin');
const subscribeTo = require('./serverHelpers/subscribeToSignin');
const xrplNftLookup = require("./serverHelpers/xrplNftLookup");
app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});

let serverState = {
    connectedUsers: [],
    loggedInUsers: []
}

io.on('connection', async function (socket) {
    let payloadUuid;

    console.log(socket.id, "has joined the server.");
    serverState.connectedUsers.push(socket.id);
    console.log("New user list: ", serverState.connectedUsers)

    socket.on("disconnect", (reason) => {
        console.log(socket.id, "has left the server. Reason: ", reason)
        serverState.connectedUsers.pop(socket.id);
        serverState.loggedInUsers.pop({ socket: socket.id });
        io.emit('loggedInUsers', serverState.loggedInUsers)

        console.log("New user list: ", serverState.connectedUsers)
    });

    socket.on('newSignIn', async (callback) => {
        const signInObj = await createSignin();
        payloadUuid = signInObj.uuid;
        console.log(`
        SignIn Payload Links:
        Xumm URL: ${signInObj.qrLink},
        Qr PNG: ${signInObj.qrImage}
        `);
        callback({ payload: signInObj });
    });

    socket.on('subscribeThenLookupResolutionTx', async (callback) => {
        console.log("Initiating sign-in payload listener...");
        const subscribeAndLookupRes = await subscribeTo(payloadUuid);
        const nftLookupResult = await xrplNftLookup(subscribeAndLookupRes.response.signer, process.env.WALLET2);
        

        if (subscribeAndLookupRes.meta.signed === true) {
            console.log("server: payload signed!");
            serverState.loggedInUsers.push({ socket: socket.id, wallet: subscribeAndLookupRes.response.signer, token: subscribeAndLookupRes.response.user })

            console.log("Logged in users: ", serverState.loggedInUsers)
            io.emit('loggedInUsers', serverState.loggedInUsers)


        }

        callback({
            payload: subscribeAndLookupRes,
            nfTokenUrl: nftLookupResult.length > 0 ? nftLookupResult[0].ipfsUrl : null
        });
    })

});


server.listen(3001, function () {
    console.log('Listening on port 3001...');
});