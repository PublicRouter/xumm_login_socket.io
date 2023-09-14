import './App.css';
import { Routes, Route } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import Navigation from './components/Navigation/Navigation';
import AccountInfoTab from './components/AccountInfoTab/AccountInfoTab';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import Transactions from './components/Transactions/Transactions';
import NftPage from './components/NftPage/NftPage';
import Footer from './components/Footer/Footer'


// import useSocket from './clientUtils/useSocket';
// import useSessionStorage from './clientUtils/useSessionStorage';

export const AccountContext = createContext();

const clientUrl = 'http://localhost:3001';
const socket = io(clientUrl);

function App() {
  // const socket = useSocket('http://localhost:3001');
  const [accountObject, setAccountObject] = useState({ loggedIn: false });
  // const [accountObject, setAccountObject] = useSessionStorage('accountObject', { loggedIn: false });

  // useEffect(() => {
  //   console.log("useme pls")
  //   if (accountObject.loggedIn && accountObject !== { loggedIn: false }) {
  //     socket.emit('updateServerAccountState', accountObject, async (callback) => {
  //       const response = await callback;
  //       console.log("Response from server: ", response);
  //     });
  //   }
  // }, [accountObject, socket]);

  //returns null if accountObject item does not exist in session storage
  const sessionStorageAccount = window.sessionStorage.getItem('accountObject');

  console.log("session storage account item: ", sessionStorageAccount);

  useEffect(() => {
    //if you put sessionstorage logic in effect, will not store account data to sessionstorage after logging in
    console.log("THis is my useEffect firing...")
  }, []);

  //logged in & sessionStorage is empty
  if (accountObject.loggedIn && sessionStorageAccount == null) {
    window.sessionStorage.setItem('accountObject', JSON.stringify(accountObject));
  };
  //not logged in, and sessionStorage is populated
  if (!accountObject.loggedIn && sessionStorageAccount !== null) {
    console.log("executing updateServerAccountState emit.")
    const currentAccount = JSON.parse(sessionStorageAccount);
    socket.emit('updateServerAccountState', currentAccount, async (callback) => {
      const receivedFrontEndResponseForUpdateServerAccountStateEmit = await callback;
      console.log("receivedFrontEndResponseForUpdateServerAccountStateEmit: ", receivedFrontEndResponseForUpdateServerAccountStateEmit);
    });
    setAccountObject(currentAccount);

  };

  //if logged in, and session storage is populated

  console.log('App component: Current connected users account: ', accountObject)

  return (
    <AccountContext.Provider value={[accountObject, setAccountObject]} >
      <div className="App">
        <Navigation />
        {/* <h1 id="appMainHead">Originators</h1> */}
        {
          accountObject.loggedIn ? <AccountInfoTab socket={socket} /> : null
        }
        {
          accountObject.loggedIn ?
            <Routes>
              <Route path="/" element={<Home socket={socket} />} />
              <Route path="/enter" element={<Login socket={socket} />} />
              <Route path="/profile" element={<Profile socket={socket} />} />
              <Route path="/nfts" element={<NftPage socket={socket} />} />
              <Route path="/transactions" element={<Transactions socket={socket} />} />
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