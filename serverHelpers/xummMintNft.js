
const xrpl = require("xrpl");
const { XummSdk } = require('xumm-sdk');
require('dotenv').config();

const Sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

const mintNfToken = async (mintingWallet, ipfsHash, memoType, memoData) => {
    const hexHash = xrpl.convertStringToHex(ipfsHash);
    const hexMemoData = xrpl.convertStringToHex(memoData);
    const hexMemoType = xrpl.convertStringToHex(memoType);
    const tokenMintCreate = await Sdk.payload.create({
        "TransactionType": "NFTokenMint",
        "Account": mintingWallet,
        "TransferFee": 0,
        "NFTokenTaxon": 0,
        "Flags": 2,
        "Fee": "10",
        "URI": hexHash,
        "Memos": [
            {
                "Memo": {
                    "MemoType":
                        hexMemoType,
                    "MemoData": hexMemoData
                }
            }
        ]
    });

    console.log("tokenMintCreate payload: ",tokenMintCreate)

};

const subscribeToTokenMint = async (uuid) => {
    const subscription = await Sdk.payload.subscribe(uuid, (event) => {
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data;
        };
    });

    const resolveData = await subscription.resolved;

    if (resolveData) {
        console.log("GETTING FINAL PAYLOAD");
        const payload = await Sdk.payload.get(uuid);
        console.log(payload);
        return payload;
    };
};

const lookupPayload = async (uuid) => {
    const payload = await Sdk.payload.get(uuid);
    console.log(payload);

};
lookupPayload();


// mintNfToken(process.env.WALLLET2, process.env.IPFS1, "AccountName", "MyAccountName");





