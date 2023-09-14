const xrpl = require('xrpl');
require('dotenv').config();

const createSignin = require('./serverHelpers/xrplHelpers/createXummSignin');
const subscribeToPayloadUuid = require('./serverHelpers/xrplHelpers/subscribeToPayloadUuid');
const lookupAccountNfts = require("./serverHelpers/xrplHelpers/lookupAccountNfts");
const createNFTokenBurnPayload = require("./serverHelpers/xrplHelpers/createNFTokenBurnPayload");
const storeMetaToIpfs = require("./serverHelpers/xrplHelpers/storeMetaToIpfs");
const mintNfToken = require("./serverHelpers/xrplHelpers/mintNfToken");
const checkNftsListForNftsWithNftTypeOriginators = require('./serverHelpers/xrplHelpers/checkNftsListForNftsWithNftTypeOriginators');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const client = new xrpl.Client('wss://s1.ripple.com/');

//@Params- Object{ xumm payload.get response object }
class Account {
  constructor() {
    this.loggedIn = null;
    this.wallet = null;
    this.xrpBalance = null;
    this.xummToken = null;
    this.latestPayload = null;
    this.userIdentityNft = null;
  }

  //update account properties
  update(data) {
    Object.keys(data).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    });
  };

  updateIdentityNft = (jsonMetaDataObject) => {
    console.log("identity nft set.")
    this.userIdentityNft = jsonMetaDataObject
  };

  //return user props
  showCurrentUserInfo = () => {
    return {
      loggedIn: this.loggedIn,
      rAddress: this.wallet,
      xrpBalance: this.xrpBalance,
      latestPayload: this.latestPayload,
      identityNft: this.userIdentityNft
    }
  };

  //returns: [{nft, ipfsUrl}]
  returnArrayOfAccountNfts = async () => {
    const arrayOfNfts = await lookupAccountNfts(this.wallet);
    return arrayOfNfts;
  };

  //returns 0 and sets identityNft to null if no nft or more than 1;
  //retuns nft and also updates class identityNft if only 1;
  checkForAccountIdentityNft = async () => {
    const allAccountNftsArray = await this.returnArrayOfAccountNfts();
    const identityNftList = await checkNftsListForNftsWithNftTypeOriginators(allAccountNftsArray);

    if (identityNftList.length === 0) {
      console.log("User has no identity NFT yet.");
      this.updateIdentityNft(null);
      return 0;
    } else if (identityNftList.length === 1) {
      this.updateIdentityNft(identityNftList[0]);
      console.log("identityNftList appropriately has only one identityNFT in wallet. NFT data: ", this.userIdentityNft);
      return this.userIdentityNft;
    } else {
      console.log("Your account has more than 1 identify NFT!! Oops")
      this.updateIdentityNft(null);
      return 0;
    }
  }

  checkAccountXrpBalance = async () => {
    await client.connect()
    const response = await client.request({
      "command": "account_info",
      "account": this.wallet,
      "ledger_index": "validated"
    })
    await client.disconnect()

    function roundDown(number, decimals) {
      const factor = Math.pow(10, decimals);
      return Math.floor(number * factor) / factor;
    }

    let xrpBalance = Number(xrpl.dropsToXrp(Number(response.result.account_data.Balance)));
    xrpBalance = roundDown(xrpBalance, 2);
    console.log("Account class checkAccountXrpBalance amount: ", xrpBalance.toFixed(2));

    let finalFormattedBalance = parseFloat(xrpBalance.toFixed(2));

    return finalFormattedBalance;
  }

  // createNewAppNfTokenMintPayload() {

  // };

  // createBurnCurrentAppNfTokenPayload() {

  // };

  // refreshBalanceAndIdentityNft = async () => {
  //   let currentWalletBalance = await this.checkAccountXrpBalance();
  //   this.xrpBalance = currentWalletBalance;
  // };

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
