import React, { useContext, useState } from 'react'
import '../Profile/profile.css'

import { LoginContext } from '../../App';

export default function Profile({ socket }) {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [burnPayload, setBurnPayload] = useState({ initiated: false });
  const [mintNftPayload, setMintNftPayload] = useState({ payload: false });
  const [display, setDisplay] = useState(true);

  let imageIpfsUrl;

  function parseUrl(url) {
    return url.split('//')[1];
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const deleteNft = () => {
    socket.emit("deleteNft", async (callback) => {
      const nftBurnPayload = await callback;
      setBurnPayload({ initiated: true, ...nftBurnPayload });
      console.log("new burnPayload state: ", burnPayload)
      socket.emit("subscribeToNftDelete", async (callback2) => {
        const subResolveData = await callback2
        console.log("Identity NFT array after deleteNft function ran: ", subResolveData);
        // setLoggedIn({...loggedIn, nftMetaData: callback2.});
        if (subResolveData.userIdentityNft == null) {
          setLoggedIn({ ...loggedIn, nftMetaData: subResolveData.userIdentityNft })
        }
      })
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("my event: ", event)

    const elements = event.currentTarget.elements;

    const transmissionObject = {
      userName: elements[0].value,
      profession: elements[1].value,
      years: elements[2].value,
      imageFile: elements[3].files[0],
      imageName: elements[3].files[0].name
    };
    console.log("transmissionObject: ", transmissionObject)

    socket.emit('createIpfs', transmissionObject, async (callback) => {
      console.log("Fired inside handleSubmit socket emit")
      const nfTokenMintPayload = await callback;
      console.log(nfTokenMintPayload);

      if (nfTokenMintPayload.message !== "failure") {
        setDisplay(false);
      };

      setMintNftPayload(nfTokenMintPayload);

      socket.emit('subToNftMint', nfTokenMintPayload.uuid, async (callback) => {
        const nfTokenMintTxData = await callback;
        console.log("subToNftMint resolved payload: ", nfTokenMintTxData);
        if (nfTokenMintTxData.signed) {
          const rawUrl = parseUrl(nfTokenMintPayload.arrayOfIssuedNft[0].ipfsUrl);
          const nftUrl = `https://ipfs.io/ipfs/${rawUrl}`;
          const fetchedMetaData = await fetch(nftUrl);
          const newMetaData = await fetchedMetaData.json();
          console.log("NFTokenMint TX Signed!")
          setLoggedIn({ ...loggedIn, nftMetaData: newMetaData })
        }
      })
    });
  };

  return (
    <div className='profileMain'>
      <div className='profileHead'>
        {/* <div id='profileInfo'>
          <p id='loggedInLoggedIn'>Online: <br /><em>{loggedIn.loggedIn ? "True" : "False"}</em></p>
          <p className='loggedInRAddress'>Account: <br /><em>{loggedIn.rAddress}</em></p>
        </div> */}
        <h1>Profile Page</h1>
      </div>

      {
        loggedIn.nftMetaData !== undefined && loggedIn.loggedIn ?
          <div className='profileBody'>
            <div id='profileCard'>
              <img src={`https://ipfs.io/ipfs/${parseUrl(loggedIn.nftMetaData.image)}`} alt={imageIpfsUrl} id='characterImage' />
              <div id='profileStats'>
                <h4>Username: <em>{loggedIn.nftMetaData.name}</em></h4>
                <p className='loggedInRAddress'>Wallet: <em>{loggedIn.rAddress}</em></p>
                <p>{capitalizeFirstLetter(loggedIn.nftMetaData.attributes[0].trait_type)}: <em>{loggedIn.nftMetaData.attributes[0].value}</em></p>
                <p>{capitalizeFirstLetter(loggedIn.nftMetaData.attributes[1].trait_type)}: <em>{loggedIn.nftMetaData.attributes[1].value}</em></p>
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
      }

    </div>
  )
}
