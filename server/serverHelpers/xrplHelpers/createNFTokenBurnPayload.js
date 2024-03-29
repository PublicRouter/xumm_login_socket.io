
const xrpl = require("xrpl");
const { XummSdk } = require('xumm-sdk');
require('dotenv').config();

const Sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

const createNFTokenBurnPayload = async (targetAccount, tokenId) => {
    const txjson = {
        // "user_token": userToken,
        "txjson": {
            "TransactionType": "NFTokenBurn",
            "Account": targetAccount,
            "Fee": "10",
            "NFTokenID": tokenId
        }
    };

    const txjsonStringified = JSON.stringify(txjson)
    console.log(txjsonStringified)

    const NFTokenBurnPayload = await Sdk.payload.create(txjsonStringified);
    console.log("tokenMintCreate payload: ", NFTokenBurnPayload )

    return NFTokenBurnPayload 
};

module.exports = createNFTokenBurnPayload;
