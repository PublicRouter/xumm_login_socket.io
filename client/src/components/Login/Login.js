import React, { useEffect } from 'react'
import "../Login/login.css"
// import { redirect } from 'react-router-dom'
import { useContext, useState } from 'react';
import { AccountContext } from '../../App';
import { useNavigate } from 'react-router-dom';

import loginCardsImage from '../../images/banking-basics-2-2x.webp';
import fingerprintLogin from '../../images/fingerprint_login2.svg';

export default function Login({ socket }) {
  const [accountObject, setAccountObject] = useContext(AccountContext);
  const [payloadCreate, setPayloadCreate] = useState({});
  const [payloadMessage, setPayloadMessage] = useState("Scan & sign with XUMM!");

  const navigate = useNavigate();
  console.log("AccountContext: ", accountObject);

  useEffect(() => {
    if(accountObject.loggedIn) {
      navigate('/profile');
    };
  },[]);

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
          setAccountObject({...accountObject, ...finalSignInPayloadReturnObject});
          setPayloadMessage("Congratulations! You are now logged in.");
          setPayloadCreate({});
          navigate('/profile');

        } else {
          console.log("User Failed to sign in.");
          setPayloadMessage("Account 'sign-in' QR was rejected. Please reload web-page or click 'Genereate QR' again. Cannot proceed to 'Profile' without signing from XUMM wallet.");
        };
      });
    });
  };

  return (
    <div className='loginMain'>
        {/* <img id="loginCardsImage" src={loginCardsImage} /> */}
        <img id="fingerprintLoginSvg" src={fingerprintLogin} />


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
                <a href={payloadCreate.payload.qrLink} target="_blank">
                  <img src={payloadCreate.payload.qrImage} />
                </a>
              </div>
          }
          <p id="signInMsg">{payloadMessage}</p>
          <button className="buttonPop" onClick={authenticateXumm}>Generate QR</button>
        </div>
      }
    </div>
  )
}
