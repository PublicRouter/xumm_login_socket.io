require('dotenv').config();

const lookupAccountNfts = require("./xrplNftLookup");
const storeMetaToIpfs = require("./nftStorageMint");

//@Params- Object{ signIn payload response object }
class Account {
    constructor(signedAuthenticationPayload) {
      this.loggedIn = signedAuthenticationPayload.meta.signed;
      this.wallet = signedAuthenticationPayload.response.signer;
      this.xummToken = signedAuthenticationPayload.response.user;
      this.payloadUuid = "";
      this.userIdentityNft = null;
    }

    async listOfNftsFromAppWallet(){
        const arrayOfNfts = await lookupAccountNfts(this.wallet);
        return arrayOfNfts;
    };

    // async createNewAccountInfoIpfsMetadata(userName, profession, years){
    //     const newIpfsHash = await storeMetaToIpfs(userName, profession, years);
    //     return newIpfsHash;
    // };

    createNewAppNfTokenMintPayload(){
        
    };

    createBurnCurrentAppNfTokenPayload(){

    };



  };




// private key signature to return owned wallet rAddress --> @rAddress

// DATABASE LAYER: use @rAddress to run database query for that address to return mapped tempRAddress for in-app usage
// IF - NO tempRAddress mapped, create new wallet and connect to sign-in wallet in database (10xrp reserve fee)

// LOAD TEMP PROFILE: use @tempRAddress to create Account Class --> @acccount class object

// account class functionality:
// - display rAddress
// - display xrp balance
// - display nfts
// - 





// ACCOUNT FUNCTIONALITY
  //1.  @Params: wallet
  //    check 
