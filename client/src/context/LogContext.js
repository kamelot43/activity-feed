import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const LogContext = createContext();

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogs must be used within LogProvider');
  }
  return context;
};

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  const addLog = useCallback((message) => {
    setLogs(prev => [...prev, {
      id: Date.now(),
      text: `[${new Date().toLocaleTimeString()}] ${message}`
    }]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    addLog('🗑️ логи очищены');
  }, [addLog]);

  // Автоскролл к последнему логу
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const value = {
    logs,
    addLog,
    clearLogs,
    logsEndRef
  };

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
};