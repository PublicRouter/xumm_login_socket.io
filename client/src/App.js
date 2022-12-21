import './App.css';
import io from 'socket.io-client';
import { Routes, Route } from 'react-router-dom';
import { createContext, useState } from 'react';

import Login from './components/Login/Login';
import Footer from './components/Footer/Footer'

import Profile from './components/Profile/Profile';
import Navigation from './components/Navigation/Navigation';

const socket = io.connect('http://localhost:3001')

export const LoginContext = createContext();

function App() {
  const [loggedIn, setLoggedIn] = useState({
    loggedIn: false,
    rAddress: null,
    xummToken: null
  });

  socket.on("connect", () => {
    console.log(socket.id, "connected to back end server.")

  })
  return (
    <LoginContext.Provider value={[loggedIn, setLoggedIn]} >
      <div className="App">
        <Navigation />
        <h1 id="appMainHead">XUMM SOCKETS</h1>
        {
              loggedIn.loggedIn ? 
              <Routes>
                <Route path="/" element={<Login socket={socket} />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
              :
              <Routes>
                <Route path="/" element={<Login socket={socket} />} />
              </Routes>
            }
        {/* <Login socket={socket}/> */}
      </div>
      <Footer />
    </LoginContext.Provider>
  );
}

export default App;
