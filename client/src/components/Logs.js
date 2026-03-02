import styled from 'styled-components';
import { useLogs } from '../context/LogContext';

const LogsContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #edf2f7;
  height: fit-content;
  position: sticky;
  top: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    letter-spacing: -0.3px;
    margin: 0;
  }
`;

const ClearButton = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #edf2f7;
    color: #2d3748;
  }
`;

const LogList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LogEntry = styled.div`
  padding: 10px 12px;
  background: #f8fafc;
  border-left: 3px solid #4299e1;
  font-size: 0.85rem;
  color: #2d3748;
  border-radius: 8px;
  line-height: 1.4;
  word-break: break-word;
`;

const EmptyLogs = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #a0aec0;
  font-size: 0.9rem;
  background: #f8fafc;
  border-radius: 12px;
`;

function Logs() {
  const { logs, clearLogs, logsEndRef } = useLogs();

  return (
    <LogsContainer>
      <Header>
        <h3>События</h3>
        <ClearButton onClick={clearLogs}>Очистить</ClearButton>
      </Header>
      
      <LogList>
        {logs.length === 0 && (
          <EmptyLogs>Нет событий</EmptyLogs>
        )}
        {logs.map(log => (
          <LogEntry key={log.id}>{log.text}</LogEntry>
        ))}
        <div ref={logsEndRef} />
      </LogList>
    </LogsContainer>
  );
}

export default Logs;