import './App.css';
import io from 'socket.io-client';
import { Routes, Route } from 'react-router-dom';
import { createContext, useState } from 'react';

import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Footer from './components/Footer/Footer'
import Profile from './components/Profile/Profile';
import Navigation from './components/Navigation/Navigation';
import AccountInfoTab from './components/AccountInfoTab/AccountInfoTab';
const socket = io.connect('http://localhost:3001')

export const LoginContext = createContext();

function App() {
  const [loggedIn, setLoggedIn] = useState({
    loggedIn: false,
    wallet: null,
    // createNftFlag: false
  });

  socket.on("connect", () => {
    console.log(socket.id, "connected to back end server.")
  })

  return (
    <LoginContext.Provider value={[loggedIn, setLoggedIn]} >
      <div className="App">
        <Navigation />
        {/* <h1 id="appMainHead">Originators</h1> */}
        {
          loggedIn.loggedIn ? <AccountInfoTab loggedIn={loggedIn}/> : null
        }
        {
              loggedIn.loggedIn ? 
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
        <Footer socket={socket}/>
      </div>
    </LoginContext.Provider>
  );
}

export default App;
