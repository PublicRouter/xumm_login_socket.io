import './App.css';
import { io } from 'socket.io-client';
import { Routes, Route } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';

import Login from './components/Login/Login';
import Footer from './components/Footer/Footer'
import Profile from './components/Profile/Profile';
import Navigation from './components/Navigation/Navigation';
import AccountInfoTab from './components/AccountInfoTab/AccountInfoTab';
import Home from './components/Home/Home';

const socket = io('http://localhost:3001');

// socket.on("connect", () => {
//   console.log(socket.id); 
// });

export const AccountContext = createContext();

function App() {
  const [accountObject, setAccountObject] = useState({ loggedIn: false });

  useEffect(() => {
    
    console.log("THis is my useEffect firing...")
  }, []);

  //returns null if accountObject item does not exist in session storage
  const sessionStorageAccount = window.sessionStorage.getItem('accountObject');

  console.log("session storage account item: ", sessionStorageAccount)

  //logged in & sessionStorage is empty
  if (accountObject.loggedIn && sessionStorageAccount == null) {
    window.sessionStorage.setItem('accountObject', JSON.stringify(accountObject));
  };
  //not logged in, and sessionStorage is populated
  if (!accountObject.loggedIn && sessionStorageAccount !== null) {
    const currentAccount = JSON.parse(sessionStorageAccount);
    socket.emit('updateServerAccountState', currentAccount, async (callback) => {
      const receivedFrontEndResponseForUpdateServerAccountStateEmit = await callback;
      console.log("receivedFrontEndResponseForUpdateServerAccountStateEmit: ", receivedFrontEndResponseForUpdateServerAccountStateEmit);
    });
    setAccountObject(currentAccount);

  };

  console.log('APP PAGE ACCOUNT OBJECT CHECK: ', accountObject)

  socket.on("connect", () => {
    console.log(socket.id, "connected to back end server.")
  });

  return (
    <AccountContext.Provider value={[accountObject, setAccountObject]} >
      <div className="App">
        <Navigation />
        {/* <h1 id="appMainHead">Originators</h1> */}
        {
          accountObject.loggedIn ? <AccountInfoTab socket={socket}/> : null

        }

        {
          accountObject.loggedIn ?
            <Routes>
              <Route path="/" element={<Home socket={socket} />} />
              <Route path="/enter" element={<Login socket={socket} />} />
              <Route path="/profile" element={<Profile socket={socket} />} />
            </Routes>
            :
            <Routes>
              <Route path="/" element={<Home socket={socket} />} />
              <Route path="/enter" element={<Login socket={socket} />} />
            </Routes>
        }
        <Footer socket={socket} />
      </div>
    </AccountContext.Provider>
  );
}

export default App;