import React, { useContext, useState, useEffect } from 'react'
import '../Profile/profile.css'
import { useNavigate } from 'react-router-dom';

// import NewIdentityNftForm from '../NewIdentityNftForm/NewIdentityNftForm';
import { AccountContext } from '../../App';
// import CreateNftForm from '../CreateNftForm/CreateNftForm';
import TestForm from '../TestForm/TestForm';
// import stockPricesSvg from '../../images/stock_prices.svg';
import piggyBankSvg from '../../images/piggyBank.svg';
// import revenueSvg from '../../images/revenue.svg';

import CollapsibleTree from '../CollapsibleTree/CollapsibleTree';
import treex from "../../images/treex1.png";

import verifyXrpScanApiFetchedNftsInCorrectFormat from "../../clientUtils/verifyXrpScanApiFetchedNftsInCorrectFormat";
import truncateToTwoDecimalPlaces from '../../clientUtils/truncateToTwoDecimalPlaces';

export default function Profile({ socket }) {
  const navigate = useNavigate();

  // STATES
  const [accountObject, setAccountObject] = useContext(AccountContext);
  const [mintNftPayload, setMintNftPayload] = useState({ payload: false });
  const [burnNftPayload, setBurnNftPayload] = useState({ payload: false });
  const [formOpened, setFormOpened] = useState(false);
  const [xrpscanFetchedAccountInfo, updateXrpscanFetchedAccountInfo] = useState({
    accountData: {},
    transactionData: false,
    fetchedNftMetaDataArrayFromRawAccountNftsTokenUri: [],
  });

  //transaction type filter helper function
  function checkTransactionCountByType(transactionType, transactionArray) {
    if (transactionArray) {
      console.log(typeof transactionArray)
      const paymentTransactionsCount = transactionArray.filter(transaction => transaction.TransactionType === transactionType).length;
      return paymentTransactionsCount;
    }
  };

  //url parsing helper function
  function parseUrl(url) {
    return url.split('//')[1];
  };

  //logout option currently unused
  function logoutAccount() {
    socket.emit('signOut', async (callback) => {
      const signOutResponse = await callback;
      console.log("signout emit rersponse: ", signOutResponse)
    });
    setAccountObject({ loggedIn: false });
    window.sessionStorage.clear();
    navigate("/");
  };

  //toggle open/close form for creating new nft
  function toggleCreateNftForm() {
    setFormOpened(!formOpened)
  };

  //delete nft trigger
  const deleteNft = () => {
    console.log("delete nft fired");
    socket.emit('deleteNft', async (callback) => {
      const nftBurnPayload = await callback;
      socket.emit("subscribeToNftBurnPayload");
      setBurnNftPayload({ ...nftBurnPayload, payload: true });
    });
  };

  useEffect(() => {
    const fetchAccountInfo = async () => {
      //FETCH XRPL ACCOUNT INFO FROM XRPSCAN API
      const accountInfo = await fetch(`https://api.xrpscan.com/api/v1/account/${accountObject.wallet}`);
      const jsonInfo = await accountInfo.json();
      console.log("Fetched wallet json data: ", jsonInfo);

      //FETCH XRPL ACCOUNT TRANSACTIONS FROM XRPSCAN API
      const returnedTransactionData = await fetch(`https://api.xrpscan.com/api/v1/account/${accountObject.wallet}/transactions`);
      const returnedTransactionDataJson = await returnedTransactionData.json();

      //FETCH XRPL ACCOUNT NFTS FROM XRPSCAN API
      const rawAccountNftsTokenDataArray = await fetch(`https://api.xrpscan.com/api/v1/account/${accountObject.wallet}/nfts`);
      const rawAccountNftsTokenDataArrayJson = await rawAccountNftsTokenDataArray.json();
      const fetchedNftMetaDataArrayFromRawAccountNftsTokenUri = await verifyXrpScanApiFetchedNftsInCorrectFormat(rawAccountNftsTokenDataArrayJson);

      console.log("Profile rawAccountNftsTokenDataArrayJson: ", rawAccountNftsTokenDataArrayJson);
      console.log("Profile fetchedNftMetaDataArrayFromRawAccountNftsTokenUri: ", fetchedNftMetaDataArrayFromRawAccountNftsTokenUri);
      console.log("Profile returnedTransactionDataJson: ", returnedTransactionDataJson);

      updateXrpscanFetchedAccountInfo({
        accountData: jsonInfo,
        transactionData: returnedTransactionDataJson,
        fetchedNftMetaDataArrayFromRawAccountNftsTokenUri: fetchedNftMetaDataArrayFromRawAccountNftsTokenUri,
      });
    };

    if (accountObject.loggedIn) {
      fetchAccountInfo();
    } else {
      console.log("User not logged in.");
    };

  }, [accountObject.loggedIn, accountObject.wallet]);

  //SOCKET EVENT FOR WHEN NFTokenBurn PAYLOAD HAS BEEN SIGNED/REJECTED
  socket.on("NFTokenBurnPayloadResolved", arg => {
    console.log("NFTokenBurnPayload response: ", arg);
    //if nftokenburn is signed
    if (arg === true) {
      const sessionStorageAccountJson = window.sessionStorage.getItem('accountObject');
      const sessionStorageAccount = JSON.parse(sessionStorageAccountJson);
      sessionStorageAccount.userIdentityNft = null;
      const sessionStorageAccountBackToJson = JSON.stringify(sessionStorageAccount);
      sessionStorage.setItem('accountObject', sessionStorageAccountBackToJson);
    };
    //reset payload state to false
    setBurnNftPayload({ payload: false });
    window.location.reload();
  });

  //SOCKET EVENT FOR WHEN NFTokenMint PAYLOAD HAS BEEN SIGNED/REJECTED
  socket.on("NFTokenMintPayloadResolved", arg => {
    console.log("NFTokenMint payload result: ", arg);
    if (arg.signed) {
      const sessionStorageAccountJson = window.sessionStorage.getItem('accountObject');
      const sessionStorageAccount = JSON.parse(sessionStorageAccountJson);
      sessionStorageAccount.userIdentityNft = arg.currentUserIdentityObject;
      const sessionStorageAccountBackToJson = JSON.stringify(sessionStorageAccount);
      sessionStorage.setItem('accountObject', sessionStorageAccountBackToJson);
    };
    //reset payload state to false
    setMintNftPayload({ payload: false });
    window.location.reload();
  });

  return (
    <div className='profileWrapper'>
      <div className='profileDash'>

        <div id="dashBoard">

          <div className='dashMain'>
            {accountObject.userIdentityNft ?
              <div id="identitySectionDiv">
                <div id="identitySectionTop">
                  <img id="identityImage" src={accountObject.userIdentityNft ? `https://ipfs.io/ipfs/${parseUrl(accountObject.userIdentityNft?.image)}` : null} alt="identity NFT" />
                  <h3 id="welcomeTitle">Welcome, <span id="welcomeTitleName">{accountObject.userIdentityNft?.name}</span>.</h3>
                  <button id="newIdentityNftButton" className='buttonPop' onClick={deleteNft}>Destroy NFT</button>
                  {
                    burnNftPayload.payload ?
                      <div className='mintNftQrDiv'>
                        <p>"Scan QR code with Xumm App to sign NfTokenBurn Payload"</p>
                        <a href={burnNftPayload.next.always} >
                          <img src={burnNftPayload.refs.qr_png} alt="qr to burn a nft" />
                        </a>
                      </div>
                      : null
                  }
                </div>

                <div className='identitySectionDivInfo'>
                  {
                    accountObject.userIdentityNft?.attributes?.map((attribute) => (
                      <div className='identityPropertiesDiv'>
                        <p class="traitTitle">{attribute.trait_type}</p>
                        <p class="traitValue">{attribute.value}</p>
                      </div>
                    ))
                  }
                </div>

              </div>
              :
              <div className='createIdentitySection'>
                <h3>Attention!</h3>
                <p>You do not have an identity NFT yet. Please click the button below to create one!</p>
                <button onClick={toggleCreateNftForm} className='buttonPop' id="createIdentityButton">Create Identity NFT</button>
                {
                  formOpened ?
                    // <CreateNftForm setFormOpened={setFormOpened} socket={socket} />
                    <TestForm setFormOpened={setFormOpened} socket={socket} setMintNftPayload={setMintNftPayload} />
                    : null
                }
                {
                  mintNftPayload.payload ?
                    <div className='mintNftQrDiv'>
                      <p>Scan QR code with Xumm App to sign NfTokenMint Payload</p>
                      <a href={mintNftPayload.qrLink} >
                        <img src={mintNftPayload.qrImage} alt="qr to mint a nft" />
                      </a>
                    </div>
                    : null
                }

              </div>
            }
            <div className='walletDashSection'>

              <div className='walletDashBoxesContainer'>
                <div className='dashSection'>

                  <div className='dashSectionHeader'>
                    <h2>Wallet</h2>
                    <a href="/">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#CFA14E" className="buttonPop">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </a>
                  </div>

                  <div className='dashSectionInfoContainer'>
                    <img src={piggyBankSvg} alt="piggybank aside" />
                    <div>
                      <p>Balance: <em>{truncateToTwoDecimalPlaces(xrpscanFetchedAccountInfo.accountData?.xrpBalance)}</em></p>
                      <p>Owners: <em>{xrpscanFetchedAccountInfo.accountData?.OwnerCount}</em></p>
                      <p className="parentAddress">Parent: <em>{xrpscanFetchedAccountInfo?.parent}</em></p>
                    </div>
                  </div>

                </div>

                <div className='dashSection'>

                  <div className='dashSectionHeader'>
                    <h2>NFTs</h2>
                    <a href="/nfts">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#CFA14E" className="buttonPop">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </a>
                  </div>

                  <div className='dashSectionInfoContainer'>
                    <img src={piggyBankSvg} alt="piggybank aside" />
                    <div>
                      <p>Total NFTs: <em>{xrpscanFetchedAccountInfo.fetchedNftMetaDataArrayFromRawAccountNftsTokenUri?.length}</em></p>
                      <p>Minted NFTs: <em>{xrpscanFetchedAccountInfo.accountData?.MintedNFTokens}</em></p>
                      <p>Burned NFTs: <em>{xrpscanFetchedAccountInfo.accountData?.BurnedNFTokens ? xrpscanFetchedAccountInfo.accountData?.BurnedNFTokens : 0}</em></p>
                    </div>
                  </div>

                </div>

                <div className='dashSection'>

                  <div className='dashSectionHeader'>
                    <h2>Transactions</h2>
                    <a href="/transactions">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#CFA14E" className="buttonPop">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </a>
                  </div>

                  <div className='dashSectionInfoContainer'>
                    <img src={piggyBankSvg} alt="piggybank aside" />
                    <div>
                      <p>Total Txs: <em>{xrpscanFetchedAccountInfo.transactionData?.transactions?.length}</em></p>
                      <p>Payments: <em>{checkTransactionCountByType("Payment", xrpscanFetchedAccountInfo.transactionData?.transactions)}</em></p>
                    </div>
                  </div>

                </div>
                <div className='dashSection'>

                  <div className='dashSectionHeader'>
                    <h2>Misc</h2>
                    <a href="/nfts">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#CFA14E" className="buttonPop">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </a>
                  </div>

                  <div className='dashSectionInfoContainer'>
                    <img src={piggyBankSvg} alt="piggybank aside" />
                    <div>
                      <p>Volume: <em>{xrpscanFetchedAccountInfo.paymentFlowData?.volume}</em></p>
                      <p>Payments: <em>{xrpscanFetchedAccountInfo.paymentFlowData?.payments}</em></p>
                    </div>
                  </div>

                </div>

              </div>
              <div id="bottomBox">
                <div>
                  <p>lorem ipsum dor foe ippsyfi dorgarh di f forgin ha. lorem ipsum dor foe ippsyfi dorgarh di f forgin ha. lorem ipsum dor foe ippsyfi dorgarh di f forgin ha.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="dashAside">
            <div id="asideRankBox">
              <div id="rankBox">

              </div>
            </div>
            <div id="asideUsersList">
              <div id='userBox'>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>

        </div>

        <img id="treesImg" src={treex} />

        <div>
          {
            xrpscanFetchedAccountInfo.transactionData ?
              <div id="collapsibleTree">
                <h4>Collapsible Transactions Tree<br /><p style={{ margin: "0px", fontWeight: "300", fontSize: "10px" }}>hover over node to see tx details, click on darker nodes to expand</p></h4>
                <CollapsibleTree data={xrpscanFetchedAccountInfo.transactionData} />
              </div> : null
          }
        </div>

      </div>
    </div>
  );
};