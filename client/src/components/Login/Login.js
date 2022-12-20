import React from 'react'
import "../Login/login.css"
import io from 'socket.io-client';
import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../App';

export default function Login({ socket }) {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [payloadCreate, setPayloadCreate] = useState({});

  // const signInPayload = useRef({})


  useEffect(() => {
    // setLoggedIn({...loggedIn,loggedIn: true })

  }, []);
  console.log("LoginContext: ", loggedIn)
  // console.log("SOCKET: ", socket)
  

  const authenticateXumm = () => {
    socket.emit('newSignIn', async (callback) => {
      const receivedObj = await callback
      setPayloadCreate(receivedObj)
    });
    // setLoggedIn({ ...loggedIn, loggedIn: true })
  }

  return (
    <div className='loginComponent'>
      {/* <h1>Login Component</h1> */}
      <button onClick={authenticateXumm}>Auth Wallet</button>
      {
        Object.keys(payloadCreate).length === 0 ?
        null
        :
        <div className='payloadDiv'>
          <img src={payloadCreate.payload.qrImage}/>
          <a href={payloadCreate.payload.qrLink}>{payloadCreate.payload.qrLink}</a>
        </div>
      }
      {
        loggedIn.loggedIn ?
          <p id='successP'><em>Congratulations! You are now logged in.</em></p>
          :
          <p id='failureP'><em>You need to login using XUMM to enter...</em></p>
      }
    </div>
  )
}
