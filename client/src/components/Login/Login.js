import React from 'react'
import "../Login/login.css"
import { useContext, useState } from 'react';
import { LoginContext } from '../../App';

export default function Login({ socket }) {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [payloadCreate, setPayloadCreate] = useState({}); 

  console.log("LoginContext: ", loggedIn)  

  const authenticateXumm = () => {
    socket.emit('newSignIn', async (callback) => {
      const receivedObj = await callback;
      setPayloadCreate(receivedObj);
      socket.emit('subscribeThenLookupResolutionTx', async (callback) => {
        console.log('inside second emit')
        const finalTxData = await callback;
        console.log("End Tx Data: ", finalTxData)
        if(finalTxData.payload.meta.signed === true){
          console.log("TX Signed! Confirmed user logged in.");
          setLoggedIn({...loggedIn, loggedIn: true, rAddress: finalTxData.payload.response.signer, xummToken: finalTxData.payload.response.user})
        } else {
          console.log("Sign-In TX Rejected!, Try Again.")
        }
      });
    });
  };

  return (
    <div className='loginComponent'>
      <h1>Sign-In To Account</h1>
      {
        Object.keys(payloadCreate).length === 0 ?
        null
        :
        <div className='payloadDiv'>
          <img src={payloadCreate.payload.qrImage}/>
          <a href={payloadCreate.payload.qrLink} target="_blank">{payloadCreate.payload.qrLink}</a>
        </div>
      }
      {
        loggedIn.loggedIn ?
          <p id='successP'><em>Congratulations! You are now logged in.</em></p>
          :
          <p id='failureP'><em>Authenticate XRPL account to enter...</em></p>
      }
      <button onClick={authenticateXumm}>Auth Wallet</button>

    </div>
  )
}
