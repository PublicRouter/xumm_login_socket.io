const {
    handleJoinServer,
    handleDisconnect,
    handleSignIn,
    handleSignOut,
    handleSubscribeToSignIn,
    createIPFSHashThenUseHashToCreateNFTokenMintPayload,
    handleSubToNftMint,
    handleUpdateServerAccountState,
    handleNftBurn,
    handleSubscribeToNftBurn
} = require('./utils');

const Account = require('./accountClass');

const initializeSocketEvents = (io, serverState) => {
    console.log("INITIALIZING SOCKEREVENTS")
    io.on('connection', (socket) => {
        //when client connects to scoket server, initialize a bare bones currentAccount instance
        let currentAccount = new Account();

        console.log(`${socket.id} has joined the server.`);
        serverState.connectedUsers.push(socket.id);
        console.log("Connected user list: ", serverState.connectedUsers);

        //if front end accountObject.loggedIn == true
        //updates currentAccount instance with account data from sessionStorage
        socket.on("updateServerAccountState", (sessionedAccountData, callback) => {
            handleUpdateServerAccountState(socket, io, sessionedAccountData, serverState, currentAccount, callback);
        });

        socket.on("disconnect", (reason) => {
            handleDisconnect(socket, currentAccount, serverState, reason);
        });

        socket.on('signIn', (callback) => {
            handleSignIn(currentAccount, callback);
        });

        socket.on('signOut', (callback) => {
            handleSignOut(io, currentAccount, serverState, callback);
        });

        socket.on('subscribeToSignIn', (callback) => {
            handleSubscribeToSignIn(io, socket, currentAccount, serverState, callback);
        });

        socket.on("sendDataForNftIpfsMetaCreationThenReturnQrCodeForNfTokenMintTransaction", (createNftFormData, callback) => {
            createIPFSHashThenUseHashToCreateNFTokenMintPayload(currentAccount, createNftFormData, callback);
        });

        socket.on("subToNftMint", async () => {
            //returns either {signed: true} or {signed: false}
            const signedResult = await handleSubToNftMint(currentAccount);
            socket.emit("NFTokenMintPayloadResolved", signedResult);
        });

        socket.on("checkConnectedList", (callback) => {
            callback(serverState.connectedUsers)
        })

        socket.on("deleteNft", (callback) => {
            handleNftBurn(currentAccount, callback);
        })

        socket.on("subscribeToNftBurnPayload", async () => {
            const signed = await handleSubscribeToNftBurn(currentAccount);
            socket.emit("NFTokenBurnPayloadResolved", signed)
        })

        // ... other socket events
    });
}

module.exports = { initializeSocketEvents };
