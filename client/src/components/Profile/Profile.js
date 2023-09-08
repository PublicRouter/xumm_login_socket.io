import React, { useContext, useState, useEffect } from 'react'
import '../Profile/profile.css'

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
  const [accountObject, setAccountObject] = useContext(AccountContext);
  // const [burnPayload, setBurnPayload] = useState({ initiated: false });
  const [mintNftPayload, setMintNftPayload] = useState({ payload: false });
  // const [hasIdentityNft, setIdentityNft] = useState(false);
  const [formOpened, setFormOpened] = useState(false);
  const [xrpscanFetchedAccountInfo, updateXrpscanFetchedAccountInfo] = useState({
    accountData: {},
    transactionData: false,
    fetchedNftMetaDataArrayFromRawAccountNftsTokenUri: [],
  });

  function checkTransactionCountByType(transactionType, transactionArray) {
    if (transactionArray) {
      console.log(typeof transactionArray)
      const paymentTransactionsCount = transactionArray.filter(transaction => transaction.TransactionType === transactionType).length;
      return paymentTransactionsCount;
    }

  }


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


      // updateXrpscanFetchedAccountInfo({...xrpscanFetchedAccountInfo, nftObjectsMetaData: nftsMetaDataObjects})

      // updatexrpscanFetchedAccountInfo(jsonInfo);
      //changes paymentFlowData to a object from a array
      // updatePaymentFlowData(returnedPaymentFlowDataJson[0]);
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

    // if (accountObject.userIdentityNft) {
    //   setIdentityNft(true);
    // }    
  }, [accountObject.loggedIn, accountObject.wallet]);

  function toggleCreateNftForm() {
    setFormOpened(!formOpened)
  };
  // let keyValuePairs;
  // let xrpscanFetchedAccountInfo = null;


  // function parseDate(date) {
  //   return date.split('//')[1];
  // };

  // function capitalizeFirstLetter(string) {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // };



  // console.log("KEYPAIRS: ", keyValuePairs)



  // const deleteNft = () => {
  //   socket.emit("deleteNft", async (callback) => {
  //     const nftBurnPayload = await callback;
  //     setBurnPayload({ initiated: true, ...nftBurnPayload });
  //     console.log("new burnPayload state: ", burnPayload)
  //     socket.emit("subscribeToNftDelete", async (callback2) => {
  //       const subResolveData = await callback2
  //       console.log("Identity NFT array after deleteNft function ran: ", subResolveData);
  //       // setaccountObject({...accountObject, nftMetaData: callback2.});
  //       if (subResolveData.userIdentityNft == null) {
  //         setLoggedIn({ ...accountObject, nftMetaData: subResolveData.userIdentityNft })
  //       }
  //     })
  //   })
  // }

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log("my event: ", event)

  //   const elements = event.currentTarget.elements;

  //   const transmissionObject = {
  //     userName: elements[0].value,
  //     profession: elements[1].value,
  //     years: elements[2].value,
  //     imageFile: elements[3].files[0],
  //     imageName: elements[3].files[0].name
  //   };
  //   console.log("transmissionObject: ", transmissionObject)

  //   socket.emit('createIpfs', transmissionObject, async (callback) => {
  //     console.log("Fired inside handleSubmit socket emit")
  //     const nfTokenMintPayload = await callback;
  //     console.log(nfTokenMintPayload);

  //     if (nfTokenMintPayload.message !== "failure") {
  //       setDisplay(false);
  //     };

  //     setMintNftPayload(nfTokenMintPayload);

  //     socket.emit('subToNftMint', nfTokenMintPayload.uuid, async (callback) => {
  //       const nfTokenMintTxData = await callback;
  //       console.log("subToNftMint resolved payload: ", nfTokenMintTxData);
  //       if (nfTokenMintTxData.signed) {
  //         const rawUrl = parseUrl(nfTokenMintPayload.arrayOfIssuedNft[0].ipfsUrl);
  //         const nftUrl = `https://ipfs.io/ipfs/${rawUrl}`;
  //         const fetchedMetaData = await fetch(nftUrl);
  //         const newMetaData = await fetchedMetaData.json();
  //         console.log("NFTokenMint TX Signed!")
  //         setaccountObject({ ...accountObject, nftMetaData: newMetaData })
  //       }
  //     })
  //   });
  // };

  function parseUrl(url) {
    return url.split('//')[1];
  };

  return (
    <div className='profileWrapper'>
      <div className='profileDash'>

        <div id="dashBoard">
          <div className='dashMain'>
            {accountObject.userIdentityNft ?
              <div id="identitySectionDiv">
                <div id="identitySectionTop">
                  <img src={accountObject.userIdentityNft ? `https://ipfs.io/ipfs/${parseUrl(accountObject.userIdentityNft?.image)}` : null} alt="identity NFT" />
                  <h3 id="welcomeTitle">Welcome, <span id="welcomeTitleName">{accountObject.userIdentityNft?.name}</span>.</h3>
                  <button id="newIdentityNftButton" className='buttonPop'>Destroy NFT</button>
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
                <p>You do not have an identity NFT yet. Please click teh button below to create one!</p>
                <button onClick={toggleCreateNftForm} >Create Identity NFT</button>
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
                {/* <h4>Click for more info.</h4> */}
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
  )
};



/* <p>Inception: {`${xrpscanFetchedAccountInfo.inception.split("-")[1]}/${xrpscanFetchedAccountInfo.inception.split("-")[0]}`}</p> */
/* <p>Todays Total Payments: {paymentFlowData.payments}</p>
   <p>Todays Payment Vol: {paymentFlowData.volume}</p> */


/* {
      accountObject.identityNft !== null && accountObject.loggedIn ?
        <div className='profileBody'>
          <div id='profileCard'>
            <img src={`https://ipfs.io/ipfs/${parseUrl(loggedIn.nftMetaData.image)}`} alt={imageIpfsUrl} id='characterImage' />
            <div id='profileStats'>
              <h4>Username: <em>{accountObject.nftMetaData.name}</em></h4>
              <p className='loggedInRAddress'>Wallet: <em>{loggedIn.rAddress}</em></p>
              <p>{capitalizeFirstLetter(accountObject.nftMetaData.attributes[0].trait_type)}: <em>{loggedIn.nftMetaData.attributes[0].value}</em></p>
              <p>{capitalizeFirstLetter(accountObject.nftMetaData.attributes[1].trait_type)}: <em>{loggedIn.nftMetaData.attributes[1].value}</em></p>
            </div>
          </div>
          <div className='deleteDiv'>
            <h2>Delete Current NFT?</h2>
            <button onClick={deleteNft}>Delete</button>
            {burnPayload.initiated ?
              <img src={burnPayload.payload.refs.qr_png} />
              : null
            }
          </div>
          <div id='profileBodyMain'>


          </div>
        </div>
        :
        <div className='profileMain'>
          <h3 id="noNftText">Account currently does not own a Identity NFT.</h3>

          <div className='profileFormDiv'>
            <form onSubmit={handleSubmit} className="profileForm" style={display ? null : { display: "none" }}>
              <input type="text" name="username" placeholder="Username" />
              <input type="text" name="profession" placeholder="Profession" />
              <input type="text" name="years" placeholder="Experience(yrs)" />
              <input type="file" name="nftImage" placeholder="NFT Image file(jpeg, png)" />
              <button type="submit">Create NFT</button>
            </form>
            {mintNftPayload.payload ?
              <div className='mintNftQrDiv'>
                <img src={mintNftPayload.qrImage} />
                <a href={mintNftPayload.qrLink} />
              </div>
              : null
            }

          </div>
        </div>
    } */