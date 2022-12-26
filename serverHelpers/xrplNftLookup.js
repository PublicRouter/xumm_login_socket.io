const xrpl = require('xrpl');

const lookupAccountNfts = async (wallet, mintWallet) => {
    // const wallet = "rKvE3ZUV4e975D5MfzTN4nYLeLgTu1HHF6";
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
// lookupAccountNfts('rKvE3ZUV4e975D5MfzTN4nYLeLgTu1HHF6', 'rKvE3ZUV4e975D5MfzTN4nYLeLgTu1HHF6')
module.exports = lookupAccountNfts