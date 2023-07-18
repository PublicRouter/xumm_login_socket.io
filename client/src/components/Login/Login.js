import React from 'react'
import "../Login/login.css"
// import { redirect } from 'react-router-dom'
import { useContext, useState } from 'react';
import { LoginContext } from '../../App';


export default function Login({ socket }) {
  const [loggedInContext, setLoggedInContext] = useContext(LoginContext);
  const [payloadCreate, setPayloadCreate] = useState({});
  const [payloadMessage, setPayloadMessage] = useState("Scan & sign with XUMM!");

  console.log("LoginContext: ", loggedInContext);

  let metaData = undefined;

  function parseUrl(url) {
    return url.split('//')[1];
  };

  const authenticateXumm = () => {

    //FIRST EMIT ( receive 'sign-in' payload object)
    socket.emit('signIn', async (callback) => {
      const receivedObj = await callback;
      //updates UI state when payloadCreate state object updated
      setPayloadCreate(receivedObj);
      //SECOND EMIT ( receive {signed: bool, wallet: '', arrayOfIssedNfts: []})
      socket.emit('subscribeToSignIn', async (callback) => {
        const finalSignInPayloadReturnObject = await callback;
        console.log("did class send?:", finalSignInPayloadReturnObject)
        // if (finalTxData.signed && finalTxData.arrayOfIssuedNft.length > 0 && finalTxData.arrayOfIssuedNft.length < 2) {
        //   const rawUrl = await parseUrl(finalTxData.arrayOfIssuedNft[0].ipfsUrl);
        //   const nftUrl = `https://ipfs.io/ipfs/${rawUrl}`;
        //   const fetchedMetaData = await fetch(nftUrl);
        //   metaData = await fetchedMetaData.json();
        // };

        // if (finalTxData.signed) {
        //   console.log('sign in success')
        //   setLoggedInContext({ ...loggedInContext, loggedIn: finalTxData.signed, rAddress: finalTxData.wallet, nftMetaData: metaData });
        //   setPayloadMessage("Congratulations! You are now logged in.")
        // } else {
        //   console.log("sign in rejected")
        //   setPayloadMessage("Account 'sign-in' QR was rejected. Please reload web-page or click 'Genereate QR' again. Cannot proceed to 'Profile' without signing from XUMM wallet. ")
        // }

        if (finalSignInPayloadReturnObject.loggedIn) {
          console.log("user successfully signed in.");
          
          setLoggedInContext({...loggedInContext, ...finalSignInPayloadReturnObject});
          setPayloadMessage("Congratulations! You are now logged in.");
        } else {
          console.log("User Failed to sign in.")
          setPayloadMessage("Account 'sign-in' QR was rejected. Please reload web-page or click 'Genereate QR' again. Cannot proceed to 'Profile' without signing from XUMM wallet. ")
        }
      });
    });
  };

  return (
    <div className='loginMain'>
      {"mintPayload" in payloadCreate ?
        <div className='loginComponent'>
          <h1>Sign Account Info NFT Mint: </h1>
          <div className='payloadDiv'>
            <img src={payloadCreate.qrImage} />
            <a href={payloadCreate.qrLink} target="_blank">{payloadCreate.qrLink}</a>
          </div>
        </div>
        :
        <div className='loginComponent'>
          <h1>Login</h1>
          {
            Object.keys(payloadCreate).length === 0 ?
              null
              :
              <div className='payloadDiv'>
                <img src={payloadCreate.payload.qrImage} />
                <a href={payloadCreate.payload.qrLink} target="_blank">{payloadCreate.payload.qrLink}</a>
              </div>
          }
          <p id="signInMsg">{payloadMessage}</p>
          <button onClick={authenticateXumm}>Generate QR</button>
        </div>
      }
    </div>
  )
}
