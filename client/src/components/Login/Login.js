import React, { useEffect } from 'react'
import "../Login/login.css"
import { useContext, useState } from 'react';
import { AccountContext } from '../../App';
import { useNavigate } from 'react-router-dom';
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

  const authenticateXumm = () => {

    //FIRST EMIT ( receive 'sign-in' payload object)
    socket.emit('signIn', async (callback) => {
      const receivedObj = await callback;
      setPayloadCreate(receivedObj);
      //SECOND EMIT ( receive server { currentAccount } after instance updated with credentials from xumm sign-in, and nft lookup)
      socket.emit('subscribeToSignIn', async (callback) => {
        const finalSignInPayloadReturnObject = await callback;
        console.log("returned updated server account object: ", finalSignInPayloadReturnObject);

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
        <img id="fingerprintLoginSvg" src={fingerprintLogin} />
        <div className='loginComponent'>
          <h1>Connect</h1>
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
    </div>
  )
}
