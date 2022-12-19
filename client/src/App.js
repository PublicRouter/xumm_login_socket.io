import './App.css';
import { io } from 'socket.io-client';

function App() {

  const socket = io('http://localhost:3001', { transports: ['websocket'] });
  socket.on("connect", () => {
    console.log(socket.id)

  })
  return (
    <div className="App">
      <h1>WELCOME TO XUMM SOCKETS</h1>
    </div>
  );
}

export default App;
