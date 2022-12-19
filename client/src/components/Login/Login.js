import React from 'react'
import io from 'socket.io-client';

export default function Login() {
    const socket = io('http://localhost:3001', { transports : ['websocket'] });
    socket.on("connect", () => {
        console.log(socket.id)
   
    })

  return (
    <div>
        <h1>Login Component</h1>
    </div>
  )
}
