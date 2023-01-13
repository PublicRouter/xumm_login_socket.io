require('dotenv').config();

const lookupAccountNfts = require("./xrplNftLookup");
const storeMetaToIpfs = require("./nftStorageMint");

class Account {
    constructor(signedAuthenticationPayload) {
      this.loggedIn = signedAuthenticationPayload.meta.signed;
      this.wallet = signedAuthenticationPayload.response.signer;
      this.xummToken = signedAuthenticationPayload.response.user;

    }

    async listOfNftsFromAppWallet(){
        const arrayOfNfts = await lookupAccountNfts(this.wallet, process.env.WALLET2);
        return arrayOfNfts;
    };

    async createNewAccountInfoIpfsMetadata(userName, profession, years){
        const newIpfsHash = await storeMetaToIpfs(userName, profession, years);
        return newIpfsHash;
    };

    createNewAppNfTokenMintPayload(){
        
    };

    createBurnCurrentAppNfTokenPayload(){

    };



  }