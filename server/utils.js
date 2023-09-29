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

const handleSignOut = (io, currentAccount, serverState, callback) => {
    const loggedInIndex = serverState.loggedInUsers.findIndex(
        (user) => user.wallet === currentAccount.wallet
    );
    if (loggedInIndex !== -1) {
        serverState.loggedInUsers.splice(loggedInIndex, 1);
        io.emit("currentLoggedInUsersList", serverState.loggedInUsers);
        callback("logged in user has been signed out.");
    };
};

//wait for sign-in payload resolve, if signed -> push user to server loggedInUsersList and send back updated account object
const handleUpdateServerAccountState = async (socket, io, sessionedAccountData, serverState, currentAccount, callback) => {
    try {
        console.log("RUNNING SERVER CURRENT_ACCOUNT INSTANCE UPDATE...")
        console.log("recieved accountObject data from front-end sessionStorage: ", sessionedAccountData);
        console.log("currentAccount instance state prior to update: ", currentAccount);

        if (!currentAccount || !sessionedAccountData) {
            throw new Error("Missing currentAccount or sessionedAccountData data.");
        }

        //if server account not loggedIn, and sessionStorage value / client is logged in
        if (currentAccount.loggedIn == false && sessionedAccountData.loggedIn === true) {
            await currentAccount.update(sessionedAccountData);

            //returns number(float)
            const accountXrpBalance = await currentAccount.checkAccountXrpBalance();
            let loggedInUserAlreadyExistsWithWalletOfAccountWeAreCurrentlyUpdating = false;

            //iterate over list of logged in users, check if a users wallet matches the wallet of account we are currently updating
            for (let i = 0; i < serverState.loggedInUsers.length; i++) {
                if (serverState.loggedInUsers[i].wallet === currentAccount.wallet) {
                    loggedInUserAlreadyExistsWithWalletOfAccountWeAreCurrentlyUpdating  = true;
                    //if matching wallet found, exit loop
                    break;
                };
            };

            if (!loggedInUserAlreadyExistsWithWalletOfAccountWeAreCurrentlyUpdating) {
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
        callback("Received session account data, and updated server currentAccount state.");

    } catch (error) {
        console.error("Error during updateServerAccountState:", error.message);

        // Depending on your needs, you can handle the error further or call the callback with an error
        callback(`Error: ${error.message}`);
    }
}

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

        const fullFileImagePath = `/Users/jamesg/Desktop/publicRouterClones/xumm_login_socket.io/server/serverHelpers/tempNftImage/${profileImageFileName}`;

        const ipfsUrl = await storeMetaToIpfs(profileUsername, profileCountry, profileBio, profileProfession, profileExperience, fullFileImagePath);

        //delete file
        (async () => {
            try {
                await fs.unlink(fullFileImagePath);
                console.log('File deleted successfully!');
            } catch (err) {
                console.error(`Error deleting the file: ${err.message}`);
            }
        })();

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

const handleNftBurn = async (currentAccount, callback) => {
    try {
        console.log("attempting to burn identity NFT");

        // Ensure the currentAccount and its properties are properly defined
        if (!currentAccount || !currentAccount.wallet || !currentAccount.userIdentityNft || !currentAccount.userIdentityNft.tokenID) {
            throw new Error("Invalid account details or missing tokenID for NFT.");
        }

        const createNFTokenBurnPayloadResponse = await createNFTokenBurnPayload(currentAccount.wallet, currentAccount.userIdentityNft.tokenID);

        // Check if the response is valid before assigning it
        if (!createNFTokenBurnPayloadResponse || !createNFTokenBurnPayloadResponse.uuid) {
            throw new Error("Invalid response from createNFTokenBurnPayload.");
        };

        currentAccount.latestPayload = {
            payloadType: 'NFTokenBurn',
            payloadUuid: createNFTokenBurnPayloadResponse.uuid,
        };

        callback(createNFTokenBurnPayloadResponse);

    } catch (error) {
        console.error("Error while attempting to burn identity NFT:", error.message);

        // Depending on your needs, you can call the callback with an error or handle it differently
        // For example:
        callback(null, error);
    };
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

const handleSubscribeToSignIn = async (io, socket, currentAccount, serverState, callback) => {
    console.log("Awaiting 'sign-in' payload resolution...");
    try {

        console.log("currentAccount: ", currentAccount)
        if (!currentAccount || !currentAccount.latestPayload || !currentAccount.latestPayload.payloadUuid) {
            throw new Error("Invalid account or missing payload data.");
        };

        const subbedPayloadResponseData = await subscribeToPayloadUuid(currentAccount.latestPayload.payloadUuid);

        if (!subbedPayloadResponseData || !subbedPayloadResponseData.meta || !subbedPayloadResponseData.response) {
            throw new Error("Incomplete payload response data.");
        };

        currentAccount.loggedIn = subbedPayloadResponseData.meta.signed;
        currentAccount.wallet = subbedPayloadResponseData.response.signer;
        currentAccount.xummToken = subbedPayloadResponseData.response.user;

        console.log("Full sign-in payload response from get: ", subbedPayloadResponseData);

        if (currentAccount.loggedIn) {
            await currentAccount.checkForAccountIdentityNft();

            serverState.loggedInUsers.push({
                socket: socket.id,
                wallet: currentAccount.wallet,
                identityNft: currentAccount.userIdentityNft,
                xrpBalance: await currentAccount.checkAccountXrpBalance(),
            });

            // send list of servers logged in users to the front end footer component
            io.emit("currentLoggedInUsersList", serverState.loggedInUsers);
        }

        callback(currentAccount);

    } catch (err) {
        console.log("Error in handleSubscribeToSignIn util: ", err);
        callback({ error: err.message });
    }
};

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