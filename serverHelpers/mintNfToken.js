
const xrpl = require("xrpl");
const { XummSdk } = require('xumm-sdk');
require('dotenv').config();
const Sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

const mintNfToken = async (mintingWallet, ipfsHash, memoUsername) => {
    const hexHash = xrpl.convertStringToHex(ipfsHash);
    const hexMemoData = xrpl.convertStringToHex(memoUsername);
    const hexMemoType = xrpl.convertStringToHex("Originators_Account_Username");
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

    const response = {
        payload: true,
        uuid: tokenMintCreate.uuid,
        qrLink: tokenMintCreate.next.always,
        qrImage: tokenMintCreate.refs.qr_png
    };

    return response ; 
};

module.exports = mintNfToken




