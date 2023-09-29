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

export const AccountContext = createContext();

function useSocket(url) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io(url);
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [url]);

  return socket;
}

function useSessionStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

function App() {
  const socket = useSocket('http://localhost:3001');
  const [accountObject, setAccountObject] = useSessionStorage('accountObject', { loggedIn: false });

  useEffect(() => {
    if (accountObject.loggedIn && socket) {
      socket.emit('updateServerAccountState', accountObject, async (callback) => {
        const response = await callback;
        console.log("Response from server: ", response);
      });
    }
  }, [accountObject, socket]);

  if (!socket) return null; // or return a loading spinner or some placeholder content

  return (
    <AccountContext.Provider value={[accountObject, setAccountObject]}>
      <div className="App">
        <Navigation />
        {accountObject.loggedIn && <AccountInfoTab socket={socket} />}
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/enter" element={<Login socket={socket} />} />
          {accountObject.loggedIn && (
            <>
              <Route path="/profile" element={<Profile socket={socket} />} />
              <Route path="/nfts" element={<NftPage socket={socket} />} />
              <Route path="/transactions" element={<Transactions socket={socket} />} />
            </>
          )}
        </Routes>
        <Footer socket={socket} />
      </div>
    </AccountContext.Provider>
  );
};

export default App;
