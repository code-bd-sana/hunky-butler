// contexts/SocketContext.js
"use client";
import { SOCKET_URL } from '@/utils/utils';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};