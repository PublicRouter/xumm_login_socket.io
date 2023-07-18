require('dotenv').config();

const createSignin = require('./createXummSignin');
const subscribeToSignIn = require('./subscribeToSignin')
const lookupAccountNfts = require("./xrplNftLookup");

const storeMetaToIpfs = require("./nftStorageMint");
const mintNfToken = require('./xummMintNft');
const burnNft = require('./burnNft');

//@Params- Object{ signIn payload response object }
class Account {
  constructor(signedAuthenticationPayload) {
    this.loggedIn = signedAuthenticationPayload.meta.signed;
    this.wallet = signedAuthenticationPayload.response.signer;
    this.xummToken = signedAuthenticationPayload.response.user;
    this.payloadUuid = "";
    this.userIdentityNft = null;
  }

  showCurrentUserInfo = () => {
    return {
      loggedIn: this.loggedIn,
      rAddress: this.wallet,
      identityNft: this.userIdentityNft
    }
  };

  setIdentityNft = (jsonMetaDataObject) => {
    console.log("identity nft set.")  
    this.userIdentityNft = jsonMetaDataObject
  };

  returnArrayOfAccountNfts = async () => {
    const arrayOfNfts = await lookupAccountNfts(this.wallet);
    return arrayOfNfts;
  };

  // filterAllNftsMetadataFor

  // async createNewAccountInfoIpfsMetadata(userName, profession, years){
  //     const newIpfsHash = await storeMetaToIpfs(userName, profession, years);
  //     return newIpfsHash;
  // };

  createNewAppNfTokenMintPayload() {

  };

  createBurnCurrentAppNfTokenPayload() {

  };



};

module.exports = Account;




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
