//GLOBAL SERVER SCOPE:
// server (http server instance using express.js)
// io (socket io instance, wrapping express server)
// serverState:{ connectedUsers: [], loggedInUsers: [] }


//OUTTER SCOPE:
// socket
// currentAccount = new Class Account()
//

const { writeFile, unlink } = require('fs');

const createSignin = require('./serverHelpers/xrplHelpers/createXummSignin');
const subscribeToPayloadUuid = require('./serverHelpers/xrplHelpers/subscribeToPayloadUuid');
const lookupAccountNfts = require("./serverHelpers/xrplHelpers/lookupAccountNfts");
// const burnNft = require("./serverHelpers/xrplHelpers/burnNft");
const storeMetaToIpfs = require("./serverHelpers/xrplHelpers/storeMetaToIpfs");
const mintNfToken = require("./serverHelpers/xrplHelpers/mintNfToken");
const checkNftsListForNftsWithNftTypeOriginators = require('./serverHelpers/xrplHelpers/checkNftsListForNftsWithNftTypeOriginators');

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

const handleSubscribeToSignIn = async (socket, currentAccount, serverState, callback) => {
    console.log("Awaiting 'sign-in' payload resolution...");
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

    const allAccountNftsArray = await currentAccount.returnArrayOfAccountNfts();
    console.log("nft array on server", allAccountNftsArray);

    const identityNftList = await checkNftsListForNftsWithNftTypeOriginators(allAccountNftsArray);

    if (identityNftList.length === 0) {
        console.log("User has no identity NFT yet.");
    } else if (identityNftList.length === 1) {
        currentAccount.setIdentityNft(identityNftList[0]);
        console.log("identityNftList appropriately has only one identityNFT in wallet. NFT data: ", currentAccount.userIdentityNft)
    } else {
        console.log("Your account has more than 1 identify NFT!! Oops")
    }
    callback(currentAccount)
};

const handleNftMetaCreation = async (currentAccount, createNftFormData, callback) => {
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

        const mintPayload = await mintNfToken(currentAccount.wallet, ipfsUrl, profileUsername);
        console.log("mintPayload-----------: ", mintPayload);

        // if all above successfull, sends back { payload: true, uuid: tokenMintCreate.uuid, qrLink: tokenMintCreate.next.always, qrImage: tokenMintCreate.refs.qr_png}
        // callback(mintPayload);
        callback(mintPayload);

    } catch (error) {
        console.error("Error:", error);
        // Handle the error appropriately
        callback({ message: "failure" });
    }
};

const handleSubToNftMint = async (arg, callback) => {
    console.log("Awaiting 'NFTokenMint' payload resolution...");
    const resolvedSubPayload = await subscribeToPayloadUuid(arg);
    const signed = resolvedSubPayload.meta.signed;
    //
    // need handling in case tx format errors even if payload is signed
    // subbedPayloadResponseData.response.dispatched_result === 'invalidTransaction',
    // 
    if (signed) {
        userWallet = resolvedSubPayload.response.signer;
        userToken = resolvedSubPayload.response.user;
        const arrayOfIssuedNft = await lookupAccountNfts(userWallet);

        const composedPayload = {
            signed: true,
            // wallet: userWallet,
            // arrayOfIssuedNft: arrayOfIssuedNft
        }
        callback(composedPayload)
    } else {
        callback({ signed: false })
    }
};

const handleUpdateServerAccountState = async (socket, io, sessionedAccountData, serverState, currentAccount, callback) => {
    console.log("Received updateServerAccountState sessionedAccountData: ", sessionedAccountData);
        console.log("CURRENTACCOUNTDATA___________: ", currentAccount)
        if (currentAccount.loggedIn == null) {
            currentAccount.update(sessionedAccountData);

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

module.exports = {
    handleJoinServer,
    handleUpdateServerAccountState,
    handleDisconnect,
    handleSignIn,
    handleSignOut,
    handleSubscribeToSignIn,
    handleNftMetaCreation,
    handleSubToNftMint
};