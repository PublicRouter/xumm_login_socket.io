const {
    handleJoinServer,
    handleDisconnect,
    handleSignIn,
    handleSignOut,
    handleSubscribeToSignIn,
    handleNftMetaCreation,
    handleSubToNftMint,
    handleUpdateServerAccountState
} = require('./utils');

const Account = require('./accountClass');

const initializeSocketEvents = (io, serverState) => {

    io.on('connection', (socket) => {
        let currentAccount = new Account();

        handleJoinServer(socket, serverState);

        //sessionedAccountData, callback
        socket.on("updateServerAccountState", (sessionedAccountData, callback) => {
            handleUpdateServerAccountState(socket, io, sessionedAccountData, serverState, currentAccount, callback);
        });
        //reason
        socket.on("disconnect", (reason) => {
            handleDisconnect(socket, currentAccount, serverState, reason);
        });
        //callback
        socket.on('signIn', (callback) => {
            handleSignIn(currentAccount, callback);
        });
        //callback
        socket.on('signOut', (callback) => {
            handleSignOut(currentAccount, serverState, callback);
        });
        //callback
        socket.on('subscribeToSignIn', (callback) => {
            handleSubscribeToSignIn(socket, currentAccount, serverState, callback);
        });
        //createNftFormData, callback (WRITEFILE)
        socket.on("sendDataForNftIpfsMetaCreationThenReturnQrCodeForNfTokenMintTransaction", (createNftFormData, callback) => {
            handleNftMetaCreation(currentAccount, createNftFormData, callback);
        });
        //arg, callback
        socket.on("subToNftMint", (arg, callback) => {
            handleSubToNftMint(arg, callback);
        });

        // ... other socket events
    });
}

module.exports = { initializeSocketEvents };
