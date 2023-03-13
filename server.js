// server dependencies
const express = require('express');
const app = express();
const http = require('http');
const { writeFile, unlink } = require('fs');
const { Server } = require('socket.io');
const cors = require('cors');

require('dotenv').config();


const createSignin = require('./serverHelpers/createXummSignin');
const subscribeTo = require('./serverHelpers/subscribeToSignin');
const xrplNftLookup = require("./serverHelpers/xrplNftLookup");
const burnNft = require("./serverHelpers/burnNft");
const storeMetaToIpfs = require("./serverHelpers/nftStorageMint");
const mintNfToken = require("./serverHelpers/xummMintNft")

app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8,
});

let serverState = {
    connectedUsers: [],
    loggedInUsers: []
};

let payloadUuid;
let userWallet;
let userToken = null;
let userIdentityNft = null;

io.on('connection', async function (socket) {

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
    //#
    socket.on('signIn', async (callback) => {
        const signInObj = await createSignin();
        payloadUuid = signInObj.uuid;
        console.log(`
        SignIn Payload Links:
        Xumm URL: ${signInObj.qrLink},
        Qr PNG: ${signInObj.qrImage}
        `);
        callback({ payload: signInObj });
    });
    //-
    socket.on('subscribeToSignIn', async (callback) => {
        console.log("Awaiting 'sign-in' payload resolution...");
        const signInResolvedPayload = await subscribeTo(payloadUuid);
        const signed = signInResolvedPayload.meta.signed;
        if (signed) {
            userWallet = signInResolvedPayload.response.signer;
            userToken = signInResolvedPayload.response.user;
            const arrayOfIssuedNft = await xrplNftLookup(userWallet, userWallet);
            serverState.loggedInUsers.push({ socket: socket.id, wallet: userWallet, token: userToken })
            io.emit('loggedInUsers', serverState.loggedInUsers)

            const composedPayload = {
                signed: true,
                wallet: userWallet,
                arrayOfIssuedNft: arrayOfIssuedNft
            }
            callback(composedPayload)
        } else {
            callback({ signed: false })
        }
    });

    socket.on("createIpfs", async (arg1, callback) => {
        console.log("server recieved createNftMeta data: ", arg1);
        const imageName = await arg1.imageName;
        const argImage = await arg1.imageFile;

        writeFile(`serverHelpers/tempNftImage/${imageName}`, argImage, (err) => {
            if(err){
                console.log("file write failure!")
                console.log("error msg: ",err)
                callback({ message: "failure" });
            } else {
                console.log("File write success!")
            }   
        });

        const ipfsUrl = await storeMetaToIpfs(arg1.userName, arg1.profession, arg1.years, `serverHelpers/tempNftImage/${imageName}`);
        console.log("ipfsUrl: ", ipfsUrl);
        const mintPayload = await mintNfToken(userWallet, ipfsUrl, arg1.userName);
        console.log("mintPayload: ", mintPayload);
        callback(mintPayload);
    });


    socket.on("subToNftMint", async (arg, callback) => {
        console.log("Awaiting 'NFTokenMint' payload resolution...");
        const signInResolvedPayload = await subscribeTo(arg);
        const signed = signInResolvedPayload.meta.signed;
        //
        // need handling in case tx format errors even if payload is signed
        // signInResolvedPayload.response.dispatched_result === 'invalidTransaction',
        // 
        if (signed) {
            userWallet = signInResolvedPayload.response.signer;
            userToken = signInResolvedPayload.response.user;
            const arrayOfIssuedNft = await xrplNftLookup(userWallet, userWallet);

            const composedPayload = {
                signed: true,
                wallet: userWallet,
                arrayOfIssuedNft: arrayOfIssuedNft
            }
            callback(composedPayload)
        } else {
            callback({ signed: false })
        }
    });

    socket.on("deleteNft", async (callback) => {
        if (userIdentityNft !== null) {
            console.log("USERIDENTITYYYYYY: ", userIdentityNft)
            const tokenBurnPayload = await burnNft(userToken, userWallet, userIdentityNft.NFTokenID);
            payloadUuid = tokenBurnPayload.uuid;
            callback({ payload: tokenBurnPayload });
        } else {
            console.log("userIdentityNft == null......")
        }
    });

    socket.on("subscribeToNftDelete", async (callback2) => {
        console.log("burn subscribe uuid state: ", payloadUuid);
        const subscribeResponse = await subscribeTo(payloadUuid);
        //list of nfts owned issued from app wallet: if [0]: nfToken was burned; if [1] nfToken still owned by wallet
        const nftList = await xrplNftLookup(subscribeResponse.response.signer, subscribeResponse.response.signer);
        console.log("NFT LIST YOO: ", nftList);
        nftList.length > 0 && nftList.length < 2 ? userIdentityNft = nftList[0].nft : userIdentityNft = null;

        console.log("USERIDENTITY YOO: ", userIdentityNft)

        if (subscribeResponse.meta.signed === true) {
            console.log("NftBurn payload signed! userIdentityNft should be null.");
            console.log("User Identity NFT: ", userIdentityNft)
            callback2({ userIdentityNft: userIdentityNft })
        } else {
            console.log("NftBurn payload not signed! Current Identity NFT still being used. Try Again!");
            console.log("User Identity NFT: ", userIdentityNft);
            callback2({ userIdentityNft: userIdentityNft });

        }
    })
});

server.listen(3001, function () {
    console.log('Listening on port 3001...');
});