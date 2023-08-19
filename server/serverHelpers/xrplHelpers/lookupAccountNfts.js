const xrpl = require('xrpl');
require('dotenv').config();

//takes wallet address, returns array of all [NFTS]
const lookupAccountNfts = async (wallet) => {
    const client = new xrpl.Client("wss://xrplcluster.com/");
    await client.connect();

    const lookupNfts = await client.request({
        "command": "account_nfts",
        "account": wallet,
        "ledger_index": "validated"
    });

    const allAccountNftsArray = [];

    console.log("lookupAccountNfts running.....looking for nfts with issuer matching wallet.....");

    lookupNfts.result.account_nfts.map((nft) => {
        //MAY NEED TO CHANGE ISSUER TO A SET WALLET INSTEAD OF THE USERS WALLET
        if(nft.URI !== undefined) {
            allAccountNftsArray.push({
                nft: nft, 
                ipfsUrl: xrpl.convertHexToString(nft.URI)
            });
        }

        
    });
    
    client.disconnect();
    // return issuedNft
    return allAccountNftsArray;
};
// lookupAccountNfts(process.env.WALLET2, process.env.WALLET2)
module.exports = lookupAccountNfts