import React, { useContext, useState, useEffect } from 'react'
import '../Profile/profile.css'

// import NewIdentityNftForm from '../NewIdentityNftForm/NewIdentityNftForm';
import { AccountContext } from '../../App';

// import CharacterUi from '../CharacterUi/CharacterUi';
import CreateNftForm from '../CreateNftForm/CreateNftForm';
import TestForm from '../TestForm/TestForm';
import stockPricesSvg from '../../images/stock_prices.svg';
import piggyBankSvg from '../../images/piggyBank.svg';
import revenueSvg from '../../images/revenue.svg';


export default function Profile({ socket }) {
  const [accountObject, setAccountObject] = useContext(AccountContext);
  // const [burnPayload, setBurnPayload] = useState({ initiated: false });
  const [mintNftPayload, setMintNftPayload] = useState({ payload: false });
  // const [hasIdentityNft, setIdentityNft] = useState(false);
  const [formOpened, setFormOpened] = useState(false);
  const [xrpscanFetchedAccountInfo, updateXrpscanFetchedAccountInfo] = useState({
    accountData: {},
    paymentFlowData: [],
    nftObjects: [],
    nftObjectsMetaData: []
  });

  useEffect(() => {

    const fetchAccountInfo = async () => {
      function parseUrl(url) {
        return url.split('//')[1];
      };

      const accountInfo = await fetch(`https://api.xrpscan.com/api/v1/account/${accountObject.wallet}`);
      const jsonInfo = await accountInfo.json();
      console.log("Fetched wallet json data: ", jsonInfo);

      const returnedPaymentFlowData = await fetch(`https://api.xrpscan.com/api/v1/account/${accountObject.wallet}/payment_flows`);
      const returnedPaymentFlowDataJson = await returnedPaymentFlowData.json();
      console.log("fetchecked Payment flows data: ", returnedPaymentFlowDataJson);

      const accountNftsData = await fetch(`https://api.xrpscan.com/api/v1/account/${accountObject.wallet}/nfts`);
      const accountNftsDataJson = await accountNftsData.json();
      console.log("fetched account nfts jsonData: ", accountNftsDataJson);

      let nftsMetaDataObjects = [];

      for (let i = 0; i < accountNftsDataJson.length; i++) {
        if (accountNftsDataJson[i].URI) {
          const nftMetaData = await fetch(`https://ipfs.io/ipfs/${parseUrl(accountNftsDataJson[i].URI)}`);
          const nftMetaJson = await nftMetaData.json()
          nftsMetaDataObjects.push(nftMetaJson)
        }

      };

      // updateXrpscanFetchedAccountInfo({...xrpscanFetchedAccountInfo, nftObjectsMetaData: nftsMetaDataObjects})

      // updatexrpscanFetchedAccountInfo(jsonInfo);
      //changes paymentFlowData to a object from a array
      // updatePaymentFlowData(returnedPaymentFlowDataJson[0]);

      console.log("YAYOOOOOOOOOOO::::::: ", nftsMetaDataObjects)
      updateXrpscanFetchedAccountInfo({
        accountData: jsonInfo,
        paymentFlowData: returnedPaymentFlowDataJson,
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
  }, []);

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

        <div className='dashMain'>
          {accountObject.userIdentityNft ?
            <div id="identitySectionDiv">
              <img src={accountObject.userIdentityNft ? `https://ipfs.io/ipfs/${parseUrl(accountObject.userIdentityNft?.image)}` : null} />
              <div className='identitySectionDivInfo'>
                <h3>Welcome, <em>{accountObject.userIdentityNft?.name}</em>.</h3>
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
                      <img src={mintNftPayload.qrImage} />
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

        <div className='walletDashSection'>
          {/* <div className='walletDashNftsContainer'>
            {
              xrpscanFetchedAccountInfo.nftObjects.map(nft => (
                <div>
                  <p>nft.</p>
                </div>
              ))
            }
          </div> */}
          <div className='walletDashBoxesContainer'>
            <div className='dashSection'>
              <h2>Wallet</h2>
              <div className='dashSectionInfoContainer'>
                <img src={piggyBankSvg} />
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
                <img src={piggyBankSvg} />
                <div>
                  <p>Minted NFTs: <em>{xrpscanFetchedAccountInfo.accountData?.MintedNFTokens}</em></p>
                  <p>Burned NFTs: <em>{xrpscanFetchedAccountInfo.accountData?.BurnedNFTokens}</em></p>
                </div>
              </div>
            </div>

            <div className='dashSection'>
              <h2>Misc</h2>
              <div className='dashSectionInfoContainer'>
                <img src={piggyBankSvg} />
                <div>
                  <p>Volume: <em>{xrpscanFetchedAccountInfo.paymentFlowData?.volume}</em></p>
                  <p>Payments: <em>{xrpscanFetchedAccountInfo.paymentFlowData?.payments}</em></p>
                </div>
              </div>
            </div>

            <div className='dashSection'>
              <h2>Wallet</h2>
              <div className='dashSectionInfoContainer'>
                <img src={piggyBankSvg} />
                <div>
                  <p>XRP: <em>{xrpscanFetchedAccountInfo.accountData?.xrpBalance}</em></p>
                  <p>Owners: <em>{xrpscanFetchedAccountInfo.accountData?.OwnerCount}</em></p>
                  <p className="parentAddress">Parent: <em>{xrpscanFetchedAccountInfo.accountData?.parent}</em></p>
                </div>
              </div>
            </div>

            <div className='dashSection'>
              <h2>NFTs</h2>
              <div className='dashSectionInfoContainer'>
                <img src={piggyBankSvg} />
                <div>
                  <p>Minted NFTs: <em>{xrpscanFetchedAccountInfo.accountData?.MintedNFTokens}</em></p>
                  <p>Burned NFTs: <em>{xrpscanFetchedAccountInfo.accountData?.BurnedNFTokens}</em></p>
                </div>
              </div>
            </div>

            <div className='dashSection'>
              <h2>Misc</h2>
              <div className='dashSectionInfoContainer'>
                <img src={piggyBankSvg} />
                <div>
                  <p>Volume: <em>{xrpscanFetchedAccountInfo.paymentFlowData?.volume}</em></p>
                  <p>Payments: <em>{xrpscanFetchedAccountInfo.paymentFlowData?.payments}</em></p>
                </div>
              </div>
            </div>

          </div>
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