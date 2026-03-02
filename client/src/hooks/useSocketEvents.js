import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

export const useSocketEvents = (events, dependencies = []) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Регистрируем все обработчики
    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Очищаем при размонтировании или изменении зависимостей
    return () => {
      Object.keys(events).forEach(event => {
        socket.off(event);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, events, ...dependencies]);
};