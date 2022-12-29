const xrpl = require('xrpl');
require('dotenv').config();

const lookupAccountNfts = async (wallet, mintWallet) => {
    const client = new xrpl.Client("wss://xrplcluster.com/");
    await client.connect();

    const lookupNfts = await client.request({
        "command": "account_nfts",
        "account": wallet,
        "ledger_index": "validated"
    });
    const issuedNft = [];

    lookupNfts.result.account_nfts.map((nft) => {
        if(nft.URI !== undefined && nft.Issuer === mintWallet) {
            issuedNft.push({nft: nft, ipfsUrl: xrpl.convertHexToString(nft.URI)})
        }
    });

    client.disconnect()

    // console.log("issuedNft: ", issuedNft)
    return issuedNft
};
// lookupAccountNfts(process.env.WALLET2, process.env.WALLET2)
module.exports = lookupAccountNfts