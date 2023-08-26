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


import treex from "../../images/treex1.png"


export default function Profile({ socket }) {
  const [accountObject, setAccountObject] = useContext(AccountContext);
  // const [burnPayload, setBurnPayload] = useState({ initiated: false });
  const [mintNftPayload, setMintNftPayload] = useState({ payload: false });
  // const [hasIdentityNft, setIdentityNft] = useState(false);
  const [formOpened, setFormOpened] = useState(false);
  const [xrpscanFetchedAccountInfo, updateXrpscanFetchedAccountInfo] = useState({
    accountData: {},
    transactionData: false,
    nftObjects: [],
    nftObjectsMetaData: []
  });

  useEffect(() => {

    const fetchAccountInfo = async () => {
      function extractIPFSHash(uri) {
        // Known IPFS gateways
        const gateways = [
          'ipfs.io/ipfs/',
          'cloudflare-ipfs.com/ipfs/',
          'gateway.pinata.cloud/ipfs/',
          // ... add more known gateways
        ];

        // Regular expression to match CIDv0, CIDv1, and subsequent JSON content
        const cidPattern = /(?:[Qm][a-zA-Z0-9]{44,50}|b[a-zA-Z0-9]{50,60})(\/\w+\.json)?/;

        // Search for a direct CID in the URI
        let match = uri.match(cidPattern);
        if (match) return match[0];

        // Check for known gateways
        for (let gateway of gateways) {
          if (uri.includes(gateway)) {
            match = uri.split(gateway)[1].match(cidPattern);
            if (match) return match[1] ? match[0] + match[1] : match[0];
          }
        };

        // If no match found, return null or a similar default value
        return null;
      }


      const accountInfo = await fetch(`https://api.xrpscan.com/api/v1/account/${accountObject.wallet}`);
      const jsonInfo = await accountInfo.json();
      console.log("Fetched wallet json data: ", jsonInfo);

      const returnedTransactionData = await fetch(`https://api.xrpscan.com/api/v1/account/${accountObject.wallet}/transactions`);
      const returnedTransactionDataJson = await returnedTransactionData.json();

      const accountNftsData = await fetch(`https://api.xrpscan.com/api/v1/account/${accountObject.wallet}/nfts`);
      const accountNftsDataJson = await accountNftsData.json();
      console.log("fetched account nfts jsonData: ", accountNftsDataJson);

      let nftsMetaDataObjects = [];

      for (let i = 0; i < accountNftsDataJson.length; i++) {
        if (accountNftsDataJson[i].URI) {
          try {
            const ipfsHash = extractIPFSHash(accountNftsDataJson[i].URI);
            const nftMetaData = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);

            // Check the content type of the response (potentially incorrect format ipfs lookup)
            const contentType = nftMetaData.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
              const nftMetaJson = await nftMetaData.json();
              console.log("CHECKING--------------------------", nftMetaJson);
              nftsMetaDataObjects.push(nftMetaJson);
            } else {
              console.warn(`Expected application/json but received ${contentType || "unknown"}. Skipping parsing for IPFS hash: ${ipfsHash}`);
            }

          } catch (error) {
            console.log(error);
          }
        }
      }


      // updateXrpscanFetchedAccountInfo({...xrpscanFetchedAccountInfo, nftObjectsMetaData: nftsMetaDataObjects})

      // updatexrpscanFetchedAccountInfo(jsonInfo);
      //changes paymentFlowData to a object from a array
      // updatePaymentFlowData(returnedPaymentFlowDataJson[0]);

      console.log("YAYOOOOOOOOOOO::::::: ", nftsMetaDataObjects)
      console.log("HAAAAHOOOOO: ", returnedTransactionDataJson)
      updateXrpscanFetchedAccountInfo({
        accountData: jsonInfo,
        transactionData: returnedTransactionDataJson,
        nftObjects: accountNftsDataJson,
        nftObjectsMetaData: nftsMetaDataObjects,
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
    <div className='profileMain'>
      <div className='profileDash'>
        <h3 id="welcomeTitle">Welcome, <em>{accountObject.userIdentityNft?.name}</em>.</h3>

        <div className='dashMain'>
          {accountObject.userIdentityNft ?
            <div id="identitySectionDiv">
              <img src={accountObject.userIdentityNft ? `https://ipfs.io/ipfs/${parseUrl(accountObject.userIdentityNft?.image)}` : null} alt="identity NFT" />
              <div className='identitySectionDivInfo'>
                <h3>Identity NFT:</h3>
                {
                  accountObject.userIdentityNft?.attributes?.map((attribute) => (
                    <p>{attribute.trait_type}: <em>{attribute.value}</em></p>
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
          <div className='asideIdentitySectionDiv'>
            <h3>Lorem ipsum dora lori elo.</h3>
            <p>lorem ipsum delorum uri toobd sori d duroe. lorem ipsum delorum uri toobd sori d duroe. lorem ipsum delorum uri toobd sori d duroe. lorem ipsum delorum uri toobd sori d duroe.</p>
            <button>Button</button>
          </div>
        </div>
        <img id="treesImg" src={treex} />

        <div>
          <div className='walletDashSection'>

            <div className='walletDashBoxesContainer'>
              <div className='dashSection'>
                <h2>Wallet</h2>
                <div className='dashSectionInfoContainer'>
                  <img src={piggyBankSvg} alt="piggybank aside" />
                  <div>
                    <p>XRP: <em>{xrpscanFetchedAccountInfo.accountData?.xrpBalance}</em></p>
                    <p>Owners: <em>{xrpscanFetchedAccountInfo.accountData?.OwnerCount}</em></p>
                    <p className="parentAddress">Parent: <em>{xrpscanFetchedAccountInfo?.parent}</em></p>
                  </div>

                </div>
              </div>

              <div className='dashSection'>
                <h2>NFTs</h2>
                <div className='dashSectionInfoContainer'>
                  <img src={piggyBankSvg} alt="piggybank aside" />
                  <div>
                    <p>Minted NFTs: <em>{xrpscanFetchedAccountInfo.accountData?.MintedNFTokens}</em></p>
                    <p>Burned NFTs: <em>{xrpscanFetchedAccountInfo.accountData?.BurnedNFTokens}</em></p>
                  </div>
                </div>
              </div>

              <div className='dashSection'>
                <h2>Transactions</h2>
                <div className='dashSectionInfoContainer'>
                  <img src={piggyBankSvg} alt="piggybank aside" />
                  <div>
                    <p>Volume: <em>{xrpscanFetchedAccountInfo.paymentFlowData?.volume}</em></p>
                    <p>Payments: <em>{xrpscanFetchedAccountInfo.paymentFlowData?.payments}</em></p>
                  </div>
                </div>
              </div>
              <div className='dashSection'>
                <h2>Transactions</h2>
                <div className='dashSectionInfoContainer'>
                  <img src={piggyBankSvg} alt="piggybank aside" />
                  <div>
                    <p>Volume: <em>{xrpscanFetchedAccountInfo.paymentFlowData?.volume}</em></p>
                    <p>Payments: <em>{xrpscanFetchedAccountInfo.paymentFlowData?.payments}</em></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
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