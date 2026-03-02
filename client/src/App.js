import styled from 'styled-components';
import { SocketProvider } from './context/SocketContext';
import Feed from './components/Feed';
import Logs from './components/Logs';
import AddPostForm from './components/AddPostForm';
import { LogProvider } from './context/LogContext';

const AppContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #fafafa;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-weight: 300;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #34495e;
  letter-spacing: -0.5px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 30px;
`;

function App() {
  return (
    <LogProvider>
      <SocketProvider>
      <AppContainer>
        <Title>Activity Feed</Title>
        
        <ContentContainer>
          <div style={{ flex: 2 }}>
            <AddPostForm />
            <Feed />
          </div>
            <Logs />
          </ContentContainer>
        </AppContainer>
      </SocketProvider>
    </LogProvider>
  );
}

export default App;