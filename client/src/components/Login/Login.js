import React from 'react'
import io from 'socket.io-client';
import { useContext, useEffect } from 'react';
import { LoginContext } from '../../App';

export default function Login({ socket }) {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  useEffect(() => {
    // setLoggedIn({...loggedIn,loggedIn: true })

  }, []);
  console.log("LoginContext: ", loggedIn)
  const authenticateXumm = () => {
    
    // setLoggedIn({ ...loggedIn, loggedIn: true })
  }

  return (
    <div>
      <h1>Login Component</h1>
      <button onClick={authenticateXumm}>Auth Wallet</button>
      {
        loggedIn.loggedIn ?
          <p>Congratulations! You are now logged in.</p>
          :
          <p>You need to login using XUMM to enter...</p>
      }
    </div>
  )
}
