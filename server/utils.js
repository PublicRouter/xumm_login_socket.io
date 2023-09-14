const { writeFile, unlink } = require('fs');

const createSignin = require('./serverHelpers/xrplHelpers/createXummSignin');
const subscribeToPayloadUuid = require('./serverHelpers/xrplHelpers/subscribeToPayloadUuid');
const createNFTokenBurnPayload = require("./serverHelpers/xrplHelpers/createNFTokenBurnPayload");
const storeMetaToIpfs = require("./serverHelpers/xrplHelpers/storeMetaToIpfs");
const mintNfToken = require("./serverHelpers/xrplHelpers/mintNfToken");

const handleJoinServer = (socket, serverState) => {
    console.log(`${socket.id} has joined the server.`);
    serverState.connectedUsers.push(socket.id);
    console.log("Connected user list: ", serverState.connectedUsers);
};

const handleDisconnect = (socket, currentAccount, serverState, reason) => {
    console.log(`${socket.id} has left the server. Reason: ${reason}`);

    const connectedIndex = serverState.connectedUsers.indexOf(socket.id);
    if (connectedIndex !== -1) {
        serverState.connectedUsers.splice(connectedIndex, 1);
    }

    const loggedInIndex = serverState.loggedInUsers.findIndex(
        (user) => user.wallet === currentAccount.wallet
    );
    if (loggedInIndex !== -1) {
        serverState.loggedInUsers.splice(loggedInIndex, 1);
    }

    console.log("New connectedUser list: ", serverState.connectedUsers);
    console.log("New loggedInUser list: ", serverState.loggedInUsers);
};

const handleSignIn = async (currentAccount, callback) => {
    const signInObj = await createSignin();
    currentAccount.latestPayload = {
        payloadType: 'signIn',
        payloadUuid: signInObj.uuid,
    };

    console.log(`
        SignIn Payload Links:
        Xumm Sign-In payload URL: ${signInObj.qrLink},
        Xumm Sign-In payload Qr .PNG: ${signInObj.qrImage}
    `);
    callback({ payload: signInObj });
};

const handleSignOut = (currentAccount, serverState, callback) => {
    const loggedInIndex = serverState.loggedInUsers.findIndex(
        (user) => user.wallet === currentAccount.wallet
    );
    if (loggedInIndex !== -1) {
        serverState.loggedInUsers.splice(loggedInIndex, 1);
        callback("logged in user has been signed out.");
    }
};

//wait for sign-in payload resolve, if signed -> push user to server loggedInUsersList and send back updated account object
const handleSubscribeToSignIn = async (socket, currentAccount, serverState, callback) => {
    console.log("Awaiting 'sign-in' payload resolution...");
    try {
        const subbedPayloadResponseData = await subscribeToPayloadUuid(currentAccount.latestPayload.payloadUuid);

        currentAccount.loggedIn = subbedPayloadResponseData.meta.signed;
        currentAccount.wallet = subbedPayloadResponseData.response.signer;
        currentAccount.xummToken = subbedPayloadResponseData.response.user;

        if (currentAccount.loggedIn) {
            serverState.loggedInUsers.push({
                socket: socket.id,
                wallet: currentAccount.wallet,
            });
        };
        //check account for identity nft and update currentAccount with info if it finds one
        await currentAccount.checkForAccountIdentityNft();

        let currentAccountProps = currentAccount.showCurrentUserInfo();
        console.log("current account properties in handleSubscribeToSignIn util scope: ", currentAccountProps);

        callback(currentAccount);
    } catch (err) {
        console.log("Error in handleSubscribeToSignIn util: ", err);
    };
};

const createIPFSHashThenUseHashToCreateNFTokenMintPayload = async (currentAccount, createNftFormData, callback) => {
    console.log("server recieved createNftMeta data: ", createNftFormData);

    const profileImageFileName = createNftFormData.profilePictureName;
    const profileUsername = createNftFormData.username;
    const profileImageFile = createNftFormData.profilePicture;
    const profileCountry = createNftFormData.country;
    const profileBio = createNftFormData.bio;
    const profileProfession = createNftFormData.profession;
    const profileExperience = createNftFormData.experience;

    try {
        await new Promise((resolve, reject) => {
            writeFile(`./serverHelpers/tempNftImage/${profileImageFileName}`, profileImageFile, (err) => {
                if (err) {
                    console.log("file write failure!");
                    console.log("error msg: ", err);
                    callback({ message: "failure" });
                    reject(err);
                } else {
                    console.log("File write success!");
                    resolve();
                }
            });
        });

        const ipfsUrl = await storeMetaToIpfs(profileUsername, profileCountry, profileBio, profileProfession, profileExperience, `/Users/jamesg/Desktop/publicRouterClones/xumm_login_socket.io/server/serverHelpers/tempNftImage/${profileImageFileName}`);

        //returns {payload, uuid, qrLink, qrImage}
        const mintPayload = await mintNfToken(currentAccount.wallet, ipfsUrl, profileUsername);

        //update account latestPayload to NFTokenMint tx
        currentAccount.latestPayload = {
            payloadType: 'NFTokenMint',
            payloadUuid: mintPayload.uuid,
        };

        // if all above successfull, sends back { payload: true, uuid: tokenMintCreate.uuid, qrLink: tokenMintCreate.next.always, qrImage: tokenMintCreate.refs.qr_png}
        callback(mintPayload);

    } catch (error) {
        console.error("Error:", error);
        // Handle the error appropriately
        callback({ message: "failure" });
    }
};

const handleSubToNftMint = async (currentAccount) => {
    console.log("Awaiting 'NFTokenMint' payload resolution...");

    let signed;

    try {
        const resolvedSubPayload = await subscribeToPayloadUuid(currentAccount.latestPayload.payloadUuid);
        signed = resolvedSubPayload.meta.signed;

        if (signed) {
            const userIdentityNft = await currentAccount.checkForAccountIdentityNft();
            return { signed: true, currentUserIdentityObject: userIdentityNft };
        } else {
            return { signed: false };
        }
    } catch (err) {
        console.log(err);
    };
};

const handleUpdateServerAccountState = async (socket, io, sessionedAccountData, serverState, currentAccount, callback) => {
    console.log("Received updateServerAccountState sessionedAccountData: ", sessionedAccountData);
    console.log("CURRENTACCOUNTDATA___________: ", currentAccount);

    if (currentAccount.loggedIn == null) {
        currentAccount.update(sessionedAccountData);
        const balance = await currentAccount.checkAccountXrpBalance();
        console.log("CHECKING CHECKING CLASS METHOD BALANCE: ", balance);
        let hasWallet = false;

        for (let i = 0; i < serverState.loggedInUsers.length; i++) {
            if (serverState.loggedInUsers[i].wallet === currentAccount.wallet) {
                hasWallet = true;
                break;
            };
        };

        if (!hasWallet) {
            currentAccount.checkAccountXrpBalance().then(xrpBalance => {
                serverState.loggedInUsers.push({
                    socket: socket.id,
                    wallet: currentAccount.wallet,
                    identityNft: currentAccount.userIdentityNft,
                    xrpBalance: xrpBalance,
                });

                // send list of servers logged in users to the front end
                io.emit("currentLoggedInUsersList", serverState.loggedInUsers);
            });
        };
    };
    callback("Recieved session account data, and updated server currentAccount state.")
};

const handleNftBurn = async (currentAccount, callback) => {
    console.log("attempting to burn identity NFT");
    const createNFTokenBurnPayloadResponse = await createNFTokenBurnPayload(currentAccount.wallet, currentAccount.userIdentityNft.tokenID);

    currentAccount.latestPayload = {
        payloadType: 'NFTokenBurn',
        payloadUuid: createNFTokenBurnPayloadResponse.uuid,
    };
    callback(createNFTokenBurnPayloadResponse)
}

const handleSubscribeToNftBurn = async (currentAccount) => {
    const subbedPayloadResponseData = await subscribeToPayloadUuid(currentAccount.latestPayload.payloadUuid);
    const signed = subbedPayloadResponseData.meta.signed;
    return signed
}

module.exports = {
    handleJoinServer,
    handleUpdateServerAccountState,
    handleDisconnect,
    handleSignIn,
    handleSignOut,
    handleSubscribeToSignIn,
    createIPFSHashThenUseHashToCreateNFTokenMintPayload,
    handleSubToNftMint,
    handleNftBurn,
    handleSubscribeToNftBurn
};