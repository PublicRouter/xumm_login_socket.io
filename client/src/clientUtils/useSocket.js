// useSocket.js
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const useSocket = (url) => {
  const socket = io(url);
  
  useEffect(() => {
    socket.on("connect", () => {
      console.log("client has made socket connection: id: ", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("client has disconnected from socket.")
    });

    return () => {
      socket.disconnect();
      console.log("disconnecting inside socket return")
    };
  }, [socket]);
  
  return socket;
};

export default useSocket;