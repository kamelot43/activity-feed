import styled from 'styled-components';
import { useLogs } from '../context/LogContext';

const LogsContainer = styled.div`
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  max-height: 600px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  border: 1px solid #edf2f7;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h3 {
    font-weight: 400;
    color: #4a5568;
    font-size: 1rem;
    letter-spacing: 0.5px;
    margin: 0;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e0;
    background: #f7fafc;
    color: #4a5568;
  }
`;

const LogEntry = styled.div`
  padding: 10px;
  margin-bottom: 8px;
  background: #f7fafc;
  border-left: 3px solid #cbd5e0;
  font-size: 0.85rem;
  color: #4a5568;
  border-radius: 0 6px 6px 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

function Logs() {
  const { logs, clearLogs, logsEndRef } = useLogs();

  return (
    <LogsContainer>
      <Header>
        <h3>События</h3>
        <ClearButton onClick={clearLogs}>Очистить</ClearButton>
      </Header>
      
      {logs.map(log => (
        <LogEntry key={log.id}>{log.text}</LogEntry>
      ))}
      <div ref={logsEndRef} />
    </LogsContainer>
  );
}

export default Logs;