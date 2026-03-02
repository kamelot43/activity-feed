import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLogs } from './LogContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { addLog } = useLogs();
  useEffect(() => {
    // Создаем подключение
    const socketInstance = io('http://localhost:4000');
    
    socketInstance.on('connect', () => {
      console.log('🔌 Socket connected:', socketInstance.id);
      setIsConnected(true);
      addLog(`🔌 подключено (id: ${socketInstance.id})`);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setIsConnected(false);
      addLog(`🔌 отключено: ${reason}`);
    });

    setSocket(socketInstance);

    // Очистка при размонтировании
    return () => {
      socketInstance.disconnect();
      addLog('🔌 Socket disconnected on unmount');
      };
  }, [addLog]);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};