require('dotenv').config();

const createSignin = require('./createXummSignin');
const subscribeToSignIn = require('./subscribeToPayloadUuid')
const lookupAccountNfts = require("./lookupAccountNfts");

const storeMetaToIpfs = require("./storeMetaToIpfs");
const mintNfToken = require('./mintNfToken');
const burnNft = require('./burnNft');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


//@Params- Object{ xumm payload.get response object }
class Account {
  constructor() {
    this.loggedIn = null;
    this.wallet = null;
    this.xummToken = null;
    this.latestPayload = null;
    this.userIdentityNft = null;
  }

  update(data) {
    Object.keys(data).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    });
  };

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

  checkAccountXrpBalance = async () => {
    const accountInfo = await fetch(`https://api.xrpscan.com/api/v1/account/${this.wallet}`);
    const jsonInfo = await accountInfo.json();
    console.log("YEEEYEYEYEYEYEYEYEYEYYEYEYE_________: ", jsonInfo)
    return jsonInfo.xrpBalance
  }

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
