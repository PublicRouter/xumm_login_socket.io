import React, { useContext, useState, useEffect } from 'react'
import '../Profile/profile.css'

import { LoginContext } from '../../App';
// import CharacterUi from '../CharacterUi/CharacterUi';

export default function Profile({ socket }) {
  const [loggedInContext, setLoggedInContext] = useContext(LoginContext);
  // const [burnPayload, setBurnPayload] = useState({ initiated: false });
  // const [mintNftPayload, setMintNftPayload] = useState({ payload: false });
  // const [display, setDisplay] = useState(true);

  const [walletData, updateWalletData] = useState({})
  const [paymentFlowData, updatePaymentFlowData] = useState([])

  useEffect(() => {

    const fetchAccountInfo = async () => {
      const accountInfo = await fetch(`https://api.xrpscan.com/api/v1/account/${loggedInContext.wallet}`);
      const jsonInfo = await accountInfo.json();
      console.log("Fetched wallet json data: ", jsonInfo);
      // let walletKeys = Object.entries(jsonInfo)

      const returnedPaymentFlowData = await fetch(`https://api.xrpscan.com/api/v1/account/${loggedInContext.wallet}/payment_flows`);
      const returnedPaymentFlowDataJson = await returnedPaymentFlowData.json();
      console.log("payment flow data: ", returnedPaymentFlowDataJson)

      updateWalletData(jsonInfo);
      updatePaymentFlowData(returnedPaymentFlowDataJson[0]);
      // walletData = jsonInfo
      // keyValuePairs = Object.entries(jsonInfo);

    };

    if (loggedInContext.loggedIn) {
      fetchAccountInfo()
    } else {
      console.log("User not logged in.");
    };


  }, []);
  // let keyValuePairs;
  // let walletData = null;


  // function parseDate(date) {
  //   return date.split('//')[1];
  // };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  console.log("WE ON THE PROF: ", loggedInContext);




  // console.log("KEYPAIRS: ", keyValuePairs)



  // const deleteNft = () => {
  //   socket.emit("deleteNft", async (callback) => {
  //     const nftBurnPayload = await callback;
  //     setBurnPayload({ initiated: true, ...nftBurnPayload });
  //     console.log("new burnPayload state: ", burnPayload)
  //     socket.emit("subscribeToNftDelete", async (callback2) => {
  //       const subResolveData = await callback2
  //       console.log("Identity NFT array after deleteNft function ran: ", subResolveData);
  //       // setLoggedInContext({...loggedInContext, nftMetaData: callback2.});
  //       if (subResolveData.userIdentityNft == null) {
  //         setLoggedIn({ ...loggedInContext, nftMetaData: subResolveData.userIdentityNft })
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
  //         setLoggedInContext({ ...loggedInContext, nftMetaData: newMetaData })
  //       }
  //     })
  //   });
  // };

  function parseUrl(url) {
    return url.split('//')[1];
  };

  // const characterProfileSrc = './images/honeyLogo.png';
  // const helmetSrc = './images/honeyLogo.png';
  // const chestSrc = './images/honeyLogo.png';
  // const legsSrc = './images/honeyLogo.png';
  // const feetSrc = './images/honeyLogo.png';
  // const weaponSrc = './images/honeyLogo.png';


  return (
    <div className='profileMain'>

      <div className='profileHead'>
        <h1>Profile Page</h1>
      </div>

      {/* <CharacterUi
        imageSrc={characterProfileSrc}
        helmetSrc={helmetSrc}
        chestSrc={chestSrc}
        legsSrc={legsSrc}
        feetSrc={feetSrc}
        weaponSrc={weaponSrc}
      /> */}
      <div className='profileDash'>
        <div className='dashMain'>
          {loggedInContext.userIdentityNft ?
            <div id="identitySectionDiv">
              <h3>{loggedInContext.userIdentityNft?.name}</h3>
              <img src={loggedInContext.userIdentityNft ? `https://ipfs.io/ipfs/${parseUrl(loggedInContext.userIdentityNft?.image)}` : null} />
              <p>{loggedInContext.userIdentityNft?.attributes[0]?.value || 'No identity NFT'}</p>
              <p>EXP: {loggedInContext.userIdentityNft?.attributes[1]?.value || 'No identity NFT'}yrs</p>
            </div>
            : 
            <div className='createIdentitySection'>
              <p>You do not have an identity NFT yet. Please click teh button below to create one!</p>
              <button>Create Identity NFT</button>
            </div>

          }

        </div>
        <div className='dashSection'>
          <h2>Wallet</h2>
          <div className='dashSectionInfoContainer'>
            <p>XRP: {walletData?.xrpBalance}</p>
            <p>Owners: {walletData?.OwnerCount}</p>
            <p id="parentAddress">Parent: {walletData?.parent}</p>
            {/* <p>Inception: {`${walletData.inception.split("-")[1]}/${walletData.inception.split("-")[0]}`}</p> */}
            {/* <p>Todays Total Payments: {paymentFlowData.payments}</p>
            <p>Todays Payment Vol: {paymentFlowData.volume}</p> */}
          </div>


        </div>
        <div className='dashSection'>
          <h2>NFTs</h2>
          <div className='dashSectionInfoContainer'>
            <p>Minted NFTs: {walletData?.MintedNFTokens}</p>
            <p>Burned NFTs: {walletData?.BurnedNFTokens}</p>
          </div>
        </div>
        <div className='dashSection'>
          <h2>Misc</h2>
          <div className='dashSectionInfoContainer'>
            <p>Volume: {paymentFlowData[0]?.volume}</p>
            <p>Payments: {paymentFlowData[0]?.payments}</p>
          </div>
        </div>

      </div>

      {/* {
        loggedInContext.identityNft !== null && loggedInContext.loggedIn ?
          <div className='profileBody'>
            <div id='profileCard'>
              <img src={`https://ipfs.io/ipfs/${parseUrl(loggedIn.nftMetaData.image)}`} alt={imageIpfsUrl} id='characterImage' />
              <div id='profileStats'>
                <h4>Username: <em>{loggedInContext.nftMetaData.name}</em></h4>
                <p className='loggedInRAddress'>Wallet: <em>{loggedIn.rAddress}</em></p>
                <p>{capitalizeFirstLetter(loggedInContext.nftMetaData.attributes[0].trait_type)}: <em>{loggedIn.nftMetaData.attributes[0].value}</em></p>
                <p>{capitalizeFirstLetter(loggedInContext.nftMetaData.attributes[1].trait_type)}: <em>{loggedIn.nftMetaData.attributes[1].value}</em></p>
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
      } */}

    </div>
  )
}
