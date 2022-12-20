import './App.css';
import io from 'socket.io-client';
import { createContext, useState } from 'react';
import Login from './components/Login/Login';
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
        <h1 id="appMainHead">WELCOME TO XUMM SOCKETS</h1>
        <Login socket={socket}/>
      </div>
    </LoginContext.Provider>
  );
}

export default App;
