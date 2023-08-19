io.on('connection', (socket) => {
    //initialize new account class each time there is a server connection
    let currentAccount = new Account();

    // let payloadUuid;

    console.log(socket.id, "has joined the server.");
    serverState.connectedUsers.push(socket.id);

    console.log("Connected user list: ", serverState.connectedUsers);

    //receieve account data from front end sessionStorage and update currentAccount state
    socket.on("updateServerAccountState", async (sessionedAccountData, callback) => {
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
                serverState.loggedInUsers.push({
                    socket: socket.id,
                    wallet: currentAccount.wallet,
                });
            };
        };
        console.log("CURRENT CURRENT ACCOUNT: ", currentAccount)
        callback("Received updateServerAccountState confirm!")
    });

    //send list of servers logged in users to front end
    socket.on("checkLoggedInUserList", async (callback) => {
        console.log("Logged in list: ", serverState.loggedInUsers);

        callback(serverState.loggedInUsers)
    });

    //when connected instance disconnects remove from both server lists
    socket.on("disconnect", (reason) => {
        console.log(socket.id, "has left the server. Reason: ", reason);

        // Remove the disconnected socket.id from connectedUsers array
        const connectedIndex = serverState.connectedUsers.indexOf(socket.id);
        if (connectedIndex !== -1) {
            serverState.connectedUsers.splice(connectedIndex, 1);
        }

        // Remove the disconnected user from loggedInUsers array
        const loggedInIndex = serverState.loggedInUsers.findIndex(
            (user) => user.wallet === currentAccount.wallet
        );
        if (loggedInIndex !== -1) {
            serverState.loggedInUsers.splice(loggedInIndex, 1);
        };

        console.log("New connectedUser list: ", serverState.connectedUsers);
        console.log("New loggedInUser list: ", serverState.loggedInUsers);
    });


    //create sign in payload xumm tx/pl and return QR
    socket.on('signIn', async (callback) => {
        //returns signInObj = { uuid: ..., qrLink: ..., qrImage: ... }
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
    });

    socket.on('signOut', async (callback) => {
        // Remove the disconnected user from loggedInUsers array
        const loggedInIndex = serverState.loggedInUsers.findIndex(
            (user) => user.wallet === currentAccount.wallet
        );
        if (loggedInIndex !== -1) {
            serverState.loggedInUsers.splice(loggedInIndex, 1);
            callback("logged in user has been signed out.")
        };
        
    });

    //#2
    socket.on('subscribeToSignIn', async (callback) => {
        console.log("Awaiting 'sign-in' payload resolution...");
        const subbedPayloadResponseData = await subscribeToPayloadUuid(currentAccount.latestPayload.payloadUuid);

        currentAccount.loggedIn = subbedPayloadResponseData.meta.signed;
        currentAccount.wallet = subbedPayloadResponseData.response.signer;
        currentAccount.xummToken = subbedPayloadResponseData.response.user;


        // const thisAccount = new Account(subbedPayloadResponseData);
        console.log("thisAccount: ", currentAccount);

        //SETTING CURRENT ACCOUNT INFO
        // currentAccount = thisAccount;
        // console.log("currentAccount info: ", currentAccount.showCurrentUserInfo());

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
            console.log("identityNftList has one item: ", identityNftList)
            currentAccount.setIdentityNft(identityNftList[0]);
            console.log(currentAccount.userIdentityNft)
        } else {
            console.log("Your account has more than 1 identify NFT!! Oops")
        }
        callback(currentAccount)
    });

    socket.on("sendDataForNftIpfsMetaCreationThenReturnQrCodeForNfTokenMintTransaction", async (createNftFormData, callback) => {
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
                writeFile(`serverHelpers/tempNftImage/${profileImageFileName}`, profileImageFile, (err) => {
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

            const ipfsUrl = await storeMetaToIpfs(profileUsername, profileCountry, profileBio, profileProfession, profileExperience, `/Users/jamesg/Desktop/publicRouterClones/xumm_login_socket.io/serverHelpers/tempNftImage/${profileImageFileName}`);

            // ... (rest of your code)
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



    });

    //ALERT: userWallet was deleted from global context
    socket.on("subToNftMint", async (arg, callback) => {
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
    });

    // socket.on("deleteNft", async (callback) => {
    //     if (userIdentityNft !== null) {
    //         console.log("USERIDENTITYYYYYY: ", userIdentityNft)
    //         const tokenBurnPayload = await burnNft(userToken, userWallet, userIdentityNft.NFTokenID);
    //         payloadUuid = tokenBurnPayload.uuid;
    //         callback({ payload: tokenBurnPayload });
    //     } else {
    //         console.log("userIdentityNft == null......")
    //     }
    // });

    // socket.on("subscribeToNftDelete", async (callback2) => {
    //     console.log("burn subscribe uuid state: ", payloadUuid);
    //     const subscribeResponse = await subscribeToPayloadUuid(payloadUuid);
    //     //list of nfts owned issued from app wallet: if [0]: nfToken was burned; if [1] nfToken still owned by wallet
    //     const nftList = await lookupAccountNfts(subscribeResponse.response.signer, subscribeResponse.response.signer);
    //     console.log("NFT LIST YOO: ", nftList);
    //     nftList.length > 0 && nftList.length < 2 ? userIdentityNft = nftList[0].nft : userIdentityNft = null;

    //     console.log("USERIDENTITY YOO: ", userIdentityNft)

    //     if (subscribeResponse.meta.signed === true) {
    //         console.log("NftBurn payload signed! userIdentityNft should be null.");
    //         console.log("User Identity NFT: ", userIdentityNft)
    //         callback2({ userIdentityNft: userIdentityNft })
    //     } else {
    //         console.log("NftBurn payload not signed! Current Identity NFT still being used. Try Again!");
    //         console.log("User Identity NFT: ", userIdentityNft);
    //         callback2({ userIdentityNft: userIdentityNft });

    //     }
    // })
});